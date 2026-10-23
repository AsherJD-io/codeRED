import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./backgroundfield.scss";

/**
 * CodeRED living background.
 *
 * A single full-bleed canvas field. Connected nodes, travelling signal
 * pulses, depth and subtle pointer response — the 80seven ambient-field
 * technique re-tuned to the CodeRED palette. The field recedes as the
 * visitor scrolls so the writing surface stays quiet, and it pauses while
 * the tab is hidden. Under reduced motion it draws one static frame and
 * stops; the page still reads fully.
 */
interface Node {
  x: number;
  y: number;
  ox: number;
  oy: number;
  r: number;
  phase: number;
  amp: number;
}

interface Edge {
  a: number;
  b: number;
}

interface Pulse {
  edge: number;
  t: number;
  speed: number;
  color: string;
}

/* Deterministic PRNG so the topology is stable across resizes and reloads. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = {
  node: "#8fa4c8",
  link: "rgba(122, 32, 58, 0.30)",
  pulses: ["#9a2b4c", "#8fa4c8", "#c8b4c0"],
};

/** How far down the document the visitor is, 0 at the top, 1 at the end. */
function scrollFraction(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

export default function BackgroundField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pointerFine =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let scroll = 0;

    // Parallax target and eased current position.
    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // More nodes on the home page so there is genuinely something to
      // explore; secondary routes stay quiet but alive.
      const base = isHome ? 120 : 46;
      const area = width * height;
      const count = Math.max(16, Math.min(base, Math.round(area / 24000) + 20));

      const rand = rng(0xc0de ^ count ^ Math.round(width));
      nodes = Array.from({ length: count }, () => {
        const x = rand() * width;
        const y = rand() * height;
        return {
          x,
          y,
          ox: x,
          oy: y,
          r: 0.8 + rand() * 1.2,
          phase: rand() * Math.PI * 2,
          amp: 4 + rand() * 9,
        };
      });

      const maxDist = Math.min(width, height) * 0.32;
      const maxDistSq = maxDist * maxDist;
      const seen = new Set<string>();
      edges = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const near: { j: number; d: number }[] = [];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].ox - nodes[j].ox;
          const dy = nodes[i].oy - nodes[j].oy;
          const d = dx * dx + dy * dy;
          if (d < maxDistSq) near.push({ j, d });
        }
        near.sort((p, q) => p.d - q.d);
        for (let k = 0; k < Math.min(2, near.length); k += 1) {
          const key = `${i}-${near[k].j}`;
          if (seen.has(key)) continue;
          seen.add(key);
          edges.push({ a: i, b: near[k].j });
        }
      }

      const rand2 = rng(0x7e1 ^ edges.length);
      const pulseCount = isHome ? 24 : 10;
      const total = Math.min(pulseCount, Math.max(3, edges.length));
      pulses = Array.from({ length: total }, () => ({
        edge: Math.floor(rand2() * Math.max(edges.length, 1)),
        t: rand2(),
        speed: 0.03 + rand2() * 0.07,
        color: PALETTE.pulses[Math.floor(rand2() * PALETTE.pulses.length)],
      }));
    };

    const draw = (dt: number) => {
      elapsed += dt;
      scroll = scrollFraction();

      // The field evolves through the page: as the visitor scrolls the node
      // layer thins and the pulse traffic eases, so the reading surface
      // stays quiet while the field continues to live.
      const depth = 1 - scroll * 0.55;

      ctx.clearRect(0, 0, width, height);

      if (pointerFine && !reduced) {
        cx += (px - cx) * 0.05;
        cy += (py - cy) * 0.05;
        ctx.save();
        ctx.translate(cx, cy);
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        n.x = n.ox + Math.sin(elapsed * 0.00018 + n.phase) * n.amp;
        n.y = n.oy + Math.cos(elapsed * 0.00014 + n.phase) * n.amp * 0.7;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = PALETTE.link;
      ctx.globalAlpha = 0.25 * depth;
      ctx.beginPath();
      for (let i = 0; i < edges.length; i += 1) {
        const e = edges[i];
        ctx.moveTo(nodes[e.a].x, nodes[e.a].y);
        ctx.lineTo(nodes[e.b].x, nodes[e.b].y);
      }
      ctx.stroke();

      ctx.globalAlpha = 0.5 * depth;
      ctx.fillStyle = PALETTE.node;
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Travelling light along the paths: a bright core and a soft halo.
      if (!reduced) {
        for (let i = 0; i < pulses.length; i += 1) {
          const p = pulses[i];
          const e = edges[p.edge % Math.max(edges.length, 1)];
          if (!e) continue;
          p.t += p.speed * dt;
          if (p.t > 1) p.t -= 1;
          const a = nodes[e.a];
          const b = nodes[e.b];
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          const fade = Math.sin(p.t * Math.PI);

          // Soft halo.
          ctx.globalAlpha = 0.35 * fade * depth;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(x, y, 5.2, 0, Math.PI * 2);
          ctx.fill();

          // Bright core.
          ctx.globalAlpha = 0.85 * fade * depth;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      if (pointerFine && !reduced) ctx.restore();
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    layout();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onPointer = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 24;
      py = (e.clientY / window.innerHeight - 0.5) * 16;
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduced && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const observer = new ResizeObserver(() => {
      layout();
      if (reduced) draw(0);
    });
    observer.observe(canvas);

    if (pointerFine && !reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [pathname, isHome]);

  return (
    <div className="bg-field" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-field__canvas" />
    </div>
  );
}
