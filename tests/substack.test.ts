import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decodeEntities,
  isAllowedImageUrl,
  isAllowedPostUrl,
  orderPostsForDisplay,
  parseSubstackFeed,
  stripHtml,
  truncate,
  type SubstackPost,
} from "../src/lib/substack.ts";

const IMG_KCNA =
  "https://substackcdn.com/image/fetch/$s_!6pE8!,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe5f861a6-d387-4501-a449-f4fdadcdc28a_1210x299.png";
const IMG_STONE =
  "https://substackcdn.com/image/fetch/$s_!cwMi!,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F92ebf8b7-ba0b-456d-a3aa-54681665cf48_1024x608.png";
const IMG_BEGINNING =
  "https://substackcdn.com/image/fetch/$s_!QhDX!,f_auto,q_auto:good/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F42b3cc42-5710-4820-ac39-1ada62963d7f_2378x2104.jpeg";

function item(
  overrides: Partial<Parameters<typeof buildItem>[0]> = {},
): string {
  return buildItem(overrides);
}

function buildItem({
  title = "Untitled",
  link = "https://23asher.substack.com/p/example",
  pubDate = "Sat, 26 Sep 2026 01:15:45 GMT",
  description = "An example excerpt.",
  enclosure = IMG_KCNA,
}: Partial<{
  title: string;
  link: string;
  pubDate: string;
  description: string;
  enclosure: string;
}> = {}): string {
  return `<item><title><![CDATA[${title}]]></title><description><![CDATA[${description}]]></description><link>${link}</link><guid isPermaLink="false">${link}</guid><dc:creator><![CDATA[Delebayo Asher]]></dc:creator><pubDate>${pubDate}</pubDate><enclosure url="${enclosure}" length="0" type="image/jpeg"/><content:encoded><![CDATA[<p>${description}</p>]]></content:encoded></item>`;
}

const channel = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title><![CDATA[Delebayo Asher]]></title><link>https://23asher.substack.com</link>${body}</channel></rss>`;

describe("decodeEntities", () => {
  it("decodes named and numeric entities", () => {
    assert.equal(decodeEntities("&amp;"), "&");
    assert.equal(decodeEntities("&rsquo;"), "\u2019");
    assert.equal(decodeEntities("&#8594;"), "\u2192");
  });

  it("leaves unknown entities untouched", () => {
    assert.equal(decodeEntities("&bogus;"), "&bogus;");
  });
});

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    assert.equal(stripHtml("<p>Hello <b>world</b></p>"), "Hello world");
  });

  it("turns <br> into a space", () => {
    assert.equal(stripHtml("a<br>b"), "a b");
  });
});

describe("truncate", () => {
  it("returns short text unchanged", () => {
    assert.equal(truncate("short", 80), "short");
  });

  it("cuts at a word boundary with an ellipsis", () => {
    const long = "one two three four five six seven eight nine ten";
    const result = truncate(long, 20);
    assert.ok(result.endsWith("\u2026"));
    // Nothing is sliced mid-token and the cut lands on a whole word.
    const body = result.slice(0, -1);
    assert.ok(long.startsWith(body));
    assert.ok(!body.endsWith(" "));
    // The next word would not have fit within the limit.
    assert.ok(body.length <= 20);
  });
});

describe("url validation", () => {
  it("accepts Substack image hosts", () => {
    assert.equal(isAllowedImageUrl(IMG_KCNA), true);
    assert.equal(
      isAllowedImageUrl(
        "https://substack-post-media.s3.amazonaws.com/public/images/x.png",
      ),
      true,
    );
  });

  it("rejects non-Substack and non-https images", () => {
    assert.equal(isAllowedImageUrl("https://evil.example.com/x.png"), false);
    assert.equal(isAllowedImageUrl("http://substackcdn.com/x.png"), false);
    assert.equal(isAllowedImageUrl("not a url"), false);
  });

  it("accepts publication post urls", () => {
    assert.equal(
      isAllowedPostUrl("https://23asher.substack.com/p/in-the-beninging"),
      true,
    );
    assert.equal(isAllowedPostUrl("https://evil.example.com/p/x"), false);
    assert.equal(isAllowedPostUrl("javascript:alert(1)"), false);
  });
});

describe("parseSubstackFeed", () => {
  it("parses items newest first", () => {
    const xml = channel(
      item({
        title: "Newest",
        link: "https://23asher.substack.com/p/newest",
        pubDate: "Sat, 26 Sep 2026 01:15:45 GMT",
      }) +
        item({
          title: "Oldest",
          link: "https://23asher.substack.com/p/oldest",
          pubDate: "Tue, 13 Jan 2026 22:45:04 GMT",
        }),
    );

    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts.length, 2);
    assert.equal(posts[0].title, "Newest");
    assert.equal(posts[1].title, "Oldest");
    assert.equal(posts[0].date, "2026-09-26T01:15:45.000Z");
  });

  it("marks the two featured posts", () => {
    const xml = channel(
      item({
        title: "In the beninging 😂",
        link: "https://23asher.substack.com/p/in-the-beninging",
        pubDate: "Tue, 13 Jan 2026 22:45:04 GMT",
        description:
          "I\u2019ve been living in data longer than I\u2019ve been calling it that \uD83D\uDE05",
        enclosure: IMG_BEGINNING,
      }) +
        item({
          title: "Keeping the Stone Rolling Down the Hill",
          link: "https://23asher.substack.com/p/keeping-the-stone-rolling-down-the",
          pubDate: "Sun, 25 Jan 2026 11:49:09 GMT",
          description: "Shouldn't it be moving of it own volition?",
        }),
    );

    const { posts } = parseSubstackFeed(xml);
    const featured = posts.filter((p) => p.featured);
    assert.equal(featured.length, 2);
    assert.equal(featured[0].title, "Keeping the Stone Rolling Down the Hill");
    assert.equal(featured[1].title, "In the beninging 😂");
  });

  it("keeps the original cover image url", () => {
    const xml = channel(item({ title: "With image", enclosure: IMG_STONE }));
    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts[0].image, IMG_STONE);
  });

  it("drops disallowed cover images and reports null", () => {
    const xml = channel(
      item({
        title: "Bad image",
        enclosure: "https://evil.example.com/tracker.png",
      }),
    );
    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts[0].image, null);
  });

  it("falls back to the article body when description is empty", () => {
    const xml = channel(
      `<item><title><![CDATA[Body only]]></title><description><![CDATA[]]></description><link>https://23asher.substack.com/p/body-only</link><pubDate>Sat, 26 Sep 2026 01:15:45 GMT</pubDate><content:encoded><![CDATA[<p>Body excerpt here</p>]]></content:encoded></item>`,
    );
    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts[0].excerpt, "Body excerpt here");
  });

  it("produces no excerpt when neither description nor body is present", () => {
    const xml = channel(
      `<item><title><![CDATA[No text]]></title><link>https://23asher.substack.com/p/x</link><pubDate>Sat, 26 Sep 2026 01:15:45 GMT</pubDate></item>`,
    );
    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts[0].excerpt, "");
  });

  it("formats a readable display date", () => {
    const xml = channel(item({ pubDate: "Sat, 26 Sep 2026 01:15:45 GMT" }));
    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts[0].displayDate, "26 Sep 2026");
  });

  it("handles unparseable dates without crashing", () => {
    const xml = channel(item({ pubDate: "not a date" }));
    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts[0].date, null);
    assert.equal(posts[0].displayDate, "");
  });

  it("returns no posts for malformed or empty input", () => {
    assert.deepEqual(parseSubstackFeed("").posts, []);
    assert.deepEqual(parseSubstackFeed("<not rss>").posts, []);
    assert.deepEqual(parseSubstackFeed("{{{{").posts, []);
  });

  it("ignores disallowed post urls", () => {
    const xml = channel(
      item({ title: "Evil", link: "https://evil.example.com/p/x" }),
    );
    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts[0].url, "");
    assert.equal(posts[0].title, "Evil");
  });
});

describe("orderPostsForDisplay", () => {
  const makePost = (
    url: string,
    title: string,
    date: string,
  ): SubstackPost => ({
    id: url,
    title,
    url,
    date,
    displayDate: date,
    excerpt: "",
    image: null,
    featured: false,
  });

  it("puts featured posts first, in configured order, then the rest newest first", () => {
    const posts = [
      makePost(
        "https://23asher.substack.com/p/kcna",
        "KCNA",
        "2026-09-26T00:00:00.000Z",
      ),
      makePost(
        "https://23asher.substack.com/p/in-the-beninging",
        "In the beninging 😂",
        "2026-01-13T00:00:00.000Z",
      ),
      makePost(
        "https://23asher.substack.com/p/keeping-the-stone-rolling-down-the",
        "Keeping the Stone Rolling Down the Hill",
        "2026-01-25T00:00:00.000Z",
      ),
    ];

    const ordered = orderPostsForDisplay(posts);
    assert.equal(ordered.length, 3);
    assert.equal(
      ordered[0].url,
      "https://23asher.substack.com/p/in-the-beninging",
    );
    assert.equal(
      ordered[1].url,
      "https://23asher.substack.com/p/keeping-the-stone-rolling-down-the",
    );
    assert.equal(ordered[2].url, "https://23asher.substack.com/p/kcna");
  });

  it("never duplicates a featured post", () => {
    const featured = makePost(
      "https://23asher.substack.com/p/in-the-beninging",
      "In the beninging 😂",
      "2026-01-13T00:00:00.000Z",
    );
    const ordered = orderPostsForDisplay([featured]);
    assert.equal(ordered.length, 1);
    assert.equal(ordered[0].title, "In the beninging 😂");
  });

  it("orders non-featured posts newest first", () => {
    const posts = [
      makePost(
        "https://23asher.substack.com/p/a",
        "A",
        "2026-01-01T00:00:00.000Z",
      ),
      makePost(
        "https://23asher.substack.com/p/b",
        "B",
        "2026-06-01T00:00:00.000Z",
      ),
      makePost(
        "https://23asher.substack.com/p/c",
        "C",
        "2026-03-01T00:00:00.000Z",
      ),
    ];
    const ordered = orderPostsForDisplay(posts);
    assert.deepEqual(
      ordered.map((p) => p.title),
      ["B", "C", "A"],
    );
  });

  it("sorts undated discovered posts after dated ones", () => {
    const posts = [
      makePost("https://23asher.substack.com/p/undated", "Undated", ""),
      makePost(
        "https://23asher.substack.com/p/dated",
        "Dated",
        "2026-01-01T00:00:00.000Z",
      ),
    ];
    const ordered = orderPostsForDisplay(posts);
    assert.deepEqual(
      ordered.map((p) => p.title),
      ["Dated", "Undated"],
    );
  });

  it("keeps discovered posts when featured posts are absent from the feed", () => {
    const posts = [
      makePost(
        "https://23asher.substack.com/p/x",
        "X",
        "2026-02-01T00:00:00.000Z",
      ),
    ];
    const ordered = orderPostsForDisplay(posts);
    assert.equal(ordered.length, 1);
    assert.equal(ordered[0].title, "X");
  });

  it("handles an empty feed", () => {
    assert.deepEqual(orderPostsForDisplay([]), []);
  });
});

describe("end-to-end against the real feed shape", () => {
  it("parses the live feed structure into the expected three posts", () => {
    const xml = channel(
      item({
        title:
          "54/100 \u2192 82/100: What Changed Between My Two KCNA Attempts",
        link: "https://23asher.substack.com/p/54100-82100-what-changed-between",
        pubDate: "Sat, 26 Sep 2026 01:15:45 GMT",
        description:
          "I received a 54 out of 100 on my first attempt at the Kubernetes and Cloud Native Associate (KCNA) exam.",
        enclosure: IMG_KCNA,
      }) +
        item({
          title: "Keeping the Stone Rolling Down the Hill",
          link: "https://23asher.substack.com/p/keeping-the-stone-rolling-down-the",
          pubDate: "Sun, 25 Jan 2026 11:49:09 GMT",
          description: "Shouldn't it be moving of it own volition?",
          enclosure: IMG_STONE,
        }) +
        item({
          title: "In the beninging 😂",
          link: "https://23asher.substack.com/p/in-the-beninging",
          pubDate: "Tue, 13 Jan 2026 22:45:04 GMT",
          description:
            "I\u2019ve been living in data longer than I\u2019ve been calling it that \uD83D\uDE05",
          enclosure: IMG_BEGINNING,
        }),
    );

    const { posts } = parseSubstackFeed(xml);
    assert.equal(posts.length, 3);

    const ordered = orderPostsForDisplay(posts);
    assert.equal(ordered.length, 3);
    assert.equal(ordered[0].title, "In the beninging 😂");
    assert.equal(ordered[0].featured, true);
    assert.equal(ordered[1].featured, true);
    assert.equal(ordered[2].featured, false);

    // Every post must carry an allowed cover image and a publication url.
    for (const post of ordered) {
      assert.ok(
        isAllowedImageUrl(post.image ?? ""),
        `${post.title} image rejected`,
      );
      assert.ok(isAllowedPostUrl(post.url), `${post.title} url rejected`);
      assert.ok(post.displayDate.length > 0, `${post.title} missing date`);
      assert.ok(post.excerpt.length > 0, `${post.title} missing excerpt`);
    }
  });
});
