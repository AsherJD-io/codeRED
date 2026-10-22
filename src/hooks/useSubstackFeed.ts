import { useCallback, useEffect, useRef, useState } from "react";
import type { SubstackPost } from "../lib/substack";
import { FEED_CLIENT_REFRESH_MS } from "../lib/substack";

export type SubstackFeed = {
  posts: SubstackPost[];
  loading: boolean;
  error: string | null;
  stale: boolean;
};

type EndpointResponse = {
  ok: boolean;
  posts?: SubstackPost[];
  source?: "fresh" | "stale";
  error?: string;
};

const ENDPOINT = "/api/substack";

/**
 * Fetch the Substack feed from the same-origin endpoint, revalidating in the
 * background on an interval so newly published posts appear without a reload
 * or a redeploy.
 */
export function useSubstackFeed(
  intervalMs = FEED_CLIENT_REFRESH_MS,
): SubstackFeed {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch(ENDPOINT, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok)
        throw new Error(`endpoint responded with ${response.status}`);

      const payload = (await response.json()) as EndpointResponse;

      // An unsuccessful payload with no cached posts is a real failure.
      if (!payload.ok || !Array.isArray(payload.posts)) {
        throw new Error(payload.error ?? "feed returned no posts");
      }

      if (!mounted.current) return;
      setPosts(payload.posts);
      setError(null);
      setStale(payload.source === "stale");
    } catch (err) {
      if (!mounted.current) return;
      setError(err instanceof Error ? err.message : "feed unavailable");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void load();

    const timer = setInterval(() => void load(), intervalMs);
    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [load, intervalMs]);

  return { posts, loading, error, stale };
}
