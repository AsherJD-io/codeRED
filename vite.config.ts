import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { ServerResponse } from "node:http";
import {
  FEED_CACHE_SECONDS,
  FEED_TIMEOUT_MS,
  SUBSTACK_FEED_URL,
  orderPostsForDisplay,
  parseSubstackFeed,
} from "./src/lib/substack";

/**
 * Local development stand-in for the /api/substack Vercel function.
 * Production uses api/substack.ts; this plugin only serves `vite dev`.
 */
function substackDevProxy(): Plugin {
  let cached: { xml: string; at: number } | null = null;

  const readFeed = async (): Promise<string> => {
    if (cached && Date.now() - cached.at < FEED_CACHE_SECONDS * 1000) {
      return cached.xml;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
    try {
      const response = await fetch(SUBSTACK_FEED_URL, {
        signal: controller.signal,
        headers: { "User-Agent": "CodeRED Portfolio Feed Sync" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const xml = await response.text();
      const parsed = parseSubstackFeed(xml);
      if (parsed.posts.length === 0) throw new Error("no posts");
      cached = { xml, at: Date.now() };
      return xml;
    } catch (error) {
      if (cached) return cached.xml; // serve the last good copy
      throw error;
    } finally {
      clearTimeout(timer);
    }
  };

  const respond = (
    res: ServerResponse,
    status: number,
    body: unknown,
  ): void => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${FEED_CACHE_SECONDS}, stale-while-revalidate=86400`,
    );
    res.end(JSON.stringify(body));
  };

  return {
    name: "codered-substack-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/substack", (req, res) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
          res.setHeader("Allow", "GET, HEAD");
          respond(res, 405, {
            ok: false,
            error: "method not allowed",
            posts: [],
          });
          return;
        }
        readFeed()
          .then((xml) => {
            const parsed = parseSubstackFeed(xml);
            respond(res, 200, {
              ok: true,
              source: "fresh",
              posts: orderPostsForDisplay(parsed.posts),
              publication: "https://23asher.substack.com/",
              profile: "https://substack.com/@23asher",
            });
          })
          .catch((error: unknown) => {
            const message =
              error instanceof Error ? error.message : "unknown error";
            respond(res, 502, { ok: false, error: message, posts: [] });
          });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), substackDevProxy()],
});
