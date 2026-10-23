// Substack feed parsing and normalisation.
// Pure functions only: no Node or browser APIs, so this module can be imported
// from the browser bundle, the Vercel function and the dev server alike.

export type SubstackPost = {
  id: string;
  title: string;
  url: string;
  /** ISO 8601 timestamp, or null when the feed supplies no usable date. */
  date: string | null;
  /** Human readable date, e.g. "26 Sep 2026". */
  displayDate: string;
  /**
   * Estimated reading time in minutes, or null when the article body is too
   * short to estimate. Derived from the article body rather than published, so
   * it stays a property of the writing.
   */
  readMinutes: number | null;
  excerpt: string;
  image: string | null;
  featured: boolean;
};

export const SUBSTACK_FEED_URL = "https://23asher.substack.com/feed";
export const SUBSTACK_PUBLICATION_URL = "https://23asher.substack.com/";
export const SUBSTACK_PROFILE_URL = "https://substack.com/@23asher";

/**
 * Posts that must always be shown, in this order. Everything else is discovered
 * from the feed and sorted newest first.
 */
export const FEATURED_POST_URLS = [
  "https://23asher.substack.com/p/in-the-beninging",
  "https://23asher.substack.com/p/keeping-the-stone-rolling-down-the",
] as const;

export const FEED_TIMEOUT_MS = 8000;
export const FEED_CACHE_SECONDS = 1800; // 30 minutes
export const FEED_STALE_SECONDS = 86400; // 24 hours
export const FEED_CLIENT_REFRESH_MS = 30 * 60 * 1000;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "\u2026",
  mdash: "\u2014",
  ndash: "\u2013",
  rsquo: "\u2019",
  lsquo: "\u2018",
  ldquo: "\u201c",
  rdquo: "\u201d",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
};

/** Decode the HTML entities that commonly appear in RSS text nodes. */
export function decodeEntities(input: string): string {
  if (!input) return "";
  return input.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,
    (match, body: string) => {
      if (body[0] === "#") {
        const isHex = body[1] === "x" || body[1] === "X";
        const raw = isHex ? body.slice(2) : body.slice(1);
        const code = parseInt(raw, isHex ? 16 : 10);
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return match;
        try {
          return String.fromCodePoint(code);
        } catch {
          return match;
        }
      }
      const named = ENTITIES[body.toLowerCase()];
      return named ?? match;
    },
  );
}

/** Remove HTML tags and collapse the resulting whitespace. */
export function stripHtml(input: string): string {
  if (!input) return "";
  return input
    .replace(/<\s*br\s*\/?\s*>/gi, " ")
    .replace(/<\/\s*p\s*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncate at a word boundary without cutting mid-word. */
export function truncate(text: string, max = 180): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? lastSpace : max;
  return `${slice.slice(0, cut).trimEnd()}\u2026`;
}

/**
 * Only allow https images served by Substack's own CDNs. Anything else is
 * dropped so a hostile feed cannot hotlink arbitrary origins.
 */
export function isAllowedImageUrl(url: string): boolean {
  if (!url || !/^https:\/\//i.test(url)) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === "substackcdn.com" ||
      host === "substack-post-media.s3.amazonaws.com" ||
      host === "substack.com"
    );
  } catch {
    return false;
  }
}

/** Only allow the publication's own article URLs. */
export function isAllowedPostUrl(url: string): boolean {
  if (!url || !/^https:\/\//i.test(url)) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "23asher.substack.com" ||
      parsed.hostname === "substack.com"
    );
  } catch {
    return false;
  }
}

function formatDisplayDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Read a text node, unwrapping CDATA when present. */
function readTag(source: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`);
  const match = source.match(re);
  if (!match) return "";
  const inner = match[1];
  const cdata = inner.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return decodeEntities((cdata ? cdata[1] : inner).trim());
}

/** Read an attribute from the first matching tag. */
function readAttribute(source: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}\\b[^>]*?\\b${attr}\\s*=\\s*"([^"]*)"`, "i");
  const match = source.match(re);
  return match ? decodeEntities(match[1].trim()) : "";
}

/** Split the channel into individual <item> blocks. */
function splitItems(xml: string): string[] {
  const start = xml.indexOf("<item>");
  if (start === -1) return [];
  const body = xml.slice(start);
  const parts = body.split(/<item\b[^>]*>/i).slice(1);
  return parts
    .map((part) => part.split(/<\/item\s*>/i)[0])
    .filter((part) => part.trim());
}

/** Derive a short excerpt from the full article body when description is empty. */
function excerptFromBody(body: string, max = 180): string {
  return truncate(stripHtml(decodeEntities(body)), max);
}

/**
 * Estimate a reading time in minutes from the article body.
 *
 * The common 200 words per minute is used, floored at one minute so a short
 * post still reads as "1 min read" rather than "0 min read". Returns null when
 * there is no usable body, so the card can omit the marker instead of showing
 * a meaningless number.
 */
export function estimateReadMinutes(body: string): number | null {
  const words = stripHtml(decodeEntities(body)).split(/\s+/).filter(Boolean);
  if (words.length < 20) return null;
  return Math.max(1, Math.round(words.length / 200));
}

export type ParsedFeed = {
  posts: SubstackPost[];
  feedTitle: string;
};

/**
 * Parse a Substack RSS document into normalised posts, newest first.
 * Never throws: malformed input yields an empty list so callers can fall back.
 */
export function parseSubstackFeed(xml: string): ParsedFeed {
  if (typeof xml !== "string" || !xml.trim())
    return { posts: [], feedTitle: "" };

  try {
    const feedTitle = readTag(xml, "title");

    const posts = splitItems(xml).map((item, index) => {
      const title = readTag(item, "title");
      const link = readTag(item, "link");
      const guid = readTag(item, "guid");
      const pubDate = readTag(item, "pubDate");
      const description = stripHtml(readTag(item, "description"));
      const body = readTag(item, "content:encoded");
      const enclosure = readAttribute(item, "enclosure", "url");

      const parsedDate = pubDate ? new Date(pubDate) : null;
      const hasDate =
        parsedDate !== null && !Number.isNaN(parsedDate.getTime());

      const url = isAllowedPostUrl(link)
        ? link
        : isAllowedPostUrl(guid)
          ? guid
          : "";

      const excerpt = description || excerptFromBody(body);

      return {
        id: url || `${index}-${title.slice(0, 40)}`,
        title: title || "Untitled",
        url,
        date: hasDate ? parsedDate!.toISOString() : null,
        displayDate: hasDate ? formatDisplayDate(parsedDate!) : "",
        readMinutes: estimateReadMinutes(body),
        excerpt,
        image: isAllowedImageUrl(enclosure) ? enclosure : null,
        featured: url
          ? (FEATURED_POST_URLS as readonly string[]).includes(url)
          : false,
      };
    });

    // Keep posts with a usable date first, newest to oldest; undated items last.
    posts.sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });

    return { posts, feedTitle };
  } catch {
    return { posts: [], feedTitle: "" };
  }
}

/**
 * Order posts for display: the featured posts first in their configured order,
 * then every other post newest first. Featured posts never appear twice.
 * The discovered list is sorted here so the contract holds regardless of the
 * order the caller happens to pass in.
 */
export function orderPostsForDisplay(posts: SubstackPost[]): SubstackPost[] {
  const featured = FEATURED_POST_URLS.map((url) =>
    posts.find((post) => post.url === url),
  ).filter((post): post is SubstackPost => Boolean(post));

  const featuredUrls = new Set<string>(FEATURED_POST_URLS);
  const discovered = posts.filter((post) => !featuredUrls.has(post.url));

  discovered.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  return [...featured, ...discovered];
}
