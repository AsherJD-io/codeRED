import {
  FEED_CACHE_SECONDS,
  FEED_STALE_SECONDS,
  FEED_TIMEOUT_MS,
  SUBSTACK_FEED_URL,
  SUBSTACK_PROFILE_URL,
  SUBSTACK_PUBLICATION_URL,
  orderPostsForDisplay,
  parseSubstackFeed,
} from "../src/lib/substack.js";

const CACHE_CONTROL = `public, s-maxage=${FEED_CACHE_SECONDS}, stale-while-revalidate=${FEED_STALE_SECONDS}`;
const ERROR_CACHE_CONTROL = "public, s-maxage=30";

type FeedState = {
  lastGood: string | null;
  fetchedAt: number;
};

// Module-level cache: survives across invocations while the function stays warm,
// so a new post appears within the interval without waiting for a cold start.
const state: FeedState = { lastGood: null, fetchedAt: 0 };

/**
 * Fetch the feed with a hard timeout so a stalled upstream cannot hang the
 * function indefinitely.
 */
async function fetchFeed(): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const response = await fetch(SUBSTACK_FEED_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent": "CodeRED Portfolio Feed Sync",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`feed responded with status ${response.status}`);
    }

    const text = await response.text();
    if (!text.includes("<item")) {
      throw new Error("feed response did not contain any posts");
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Return feed XML, preferring a fresh fetch and falling back to the last good
 * copy. A malformed or empty feed is rejected before it can replace good data.
 */
async function getFeedXml(): Promise<{ xml: string; stale: boolean }> {
  const now = Date.now();

  if (state.lastGood && now - state.fetchedAt < FEED_CACHE_SECONDS * 1000) {
    return { xml: state.lastGood, stale: false };
  }

  try {
    const xml = await fetchFeed();
    const parsed = parseSubstackFeed(xml);
    if (parsed.posts.length === 0) {
      throw new Error("parsed feed contained no posts");
    }
    state.lastGood = xml;
    state.fetchedAt = now;
    return { xml, stale: false };
  } catch (error) {
    state.fetchedAt = now; // throttle retries after a failure
    if (state.lastGood) {
      return { xml: state.lastGood, stale: true };
    }
    throw error;
  }
}

export async function GET(request: Request): Promise<Response> {
  const method = request.method.toUpperCase();

  if (method !== "GET" && method !== "HEAD") {
    return Response.json(
      { ok: false, error: "method not allowed", posts: [] },
      { status: 405, headers: { "Cache-Control": ERROR_CACHE_CONTROL } },
    );
  }

  try {
    const { xml, stale } = await getFeedXml();
    // Parse again from the payload we serve, so stale content is sanitised too.
    const parsed = parseSubstackFeed(xml);

    return Response.json(
      {
        ok: true,
        source: stale ? "stale" : "fresh",
        posts: orderPostsForDisplay(parsed.posts),
        publication: SUBSTACK_PUBLICATION_URL,
        profile: SUBSTACK_PROFILE_URL,
      },
      { headers: { "Cache-Control": CACHE_CONTROL } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return Response.json(
      { ok: false, error: message, posts: [] },
      { status: 502, headers: { "Cache-Control": ERROR_CACHE_CONTROL } },
    );
  }
}
