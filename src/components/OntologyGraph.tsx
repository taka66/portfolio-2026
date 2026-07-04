"use client";

import { useEffect, useRef } from "react";
import { NODES, EDGES, nodeById, type QueryId } from "@/data/ontology";

interface GraphProps {
  visibleEdges: number;
  activeQuery: QueryId | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onHoverChange: (id: string | null) => void;
}

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  placed: boolean;
}

const SHAPES: Record<string, string> = {
  person: "disc",
  role: "disc",
  org: "square",
  artifact: "tri",
  skill: "diamond",
  domain: "ring",
  hobby: "dot",
};

export function OntologyGraph({ visibleEdges, activeQuery, selectedId, onSelect, onHoverChange }: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // live prop values readable from the single mount effect
  const propsRef = useRef({ visibleEdges, activeQuery, selectedId, onSelect, onHoverChange });
  useEffect(() => {
    propsRef.current = { visibleEdges, activeQuery, selectedId, onSelect, onHoverChange };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    const sim: SimNode[] = NODES.map((n) => ({ id: n.id, x: 0, y: 0, vx: 0, vy: 0, placed: false }));
    const simById = Object.fromEntries(sim.map((s) => [s.id, s]));
    let hover: SimNode | null = null;
    let dragging: SimNode | null = null;
    let alpha = 1;
    let raf = 0;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sim.forEach((s) => {
        if (!s.placed) {
          const seed = nodeById[s.id].seed;
          s.x = seed[0] * W;
          s.y = seed[1] * H;
          s.placed = true;
        }
      });
    }

    function tick(a: number) {
      for (let i = 0; i < sim.length; i++) {
        for (let j = i + 1; j < sim.length; j++) {
          const p = sim[i];
          const q = sim[j];
          let dx = q.x - p.x;
          let dy = q.y - p.y;
          const d2 = dx * dx + dy * dy || 1;
          if (d2 < 190 * 190) {
            const f = (2400 / d2) * a;
            const d = Math.sqrt(d2);
            dx /= d;
            dy /= d;
            p.vx -= dx * f;
            p.vy -= dy * f;
            q.vx += dx * f;
            q.vy += dy * f;
          }
        }
      }
      for (const e of EDGES) {
        const p = simById[e.s];
        const q = simById[e.o];
        const dx = q.x - p.x;
        const dy = q.y - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const target = e.s === "fujii" || e.o === "fujii" ? 150 : 92;
        const f = (d - target) * 0.06 * a;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
        q.vx -= (dx / d) * f;
        q.vy -= (dy / d) * f;
      }
      for (const s of sim) {
        const seed = nodeById[s.id].seed;
        s.vx += (seed[0] * W - s.x) * 0.02 * a;
        s.vy += (seed[1] * H - s.y) * 0.02 * a;
        if (s !== dragging) {
          s.x += s.vx;
          s.y += s.vy;
        }
        s.vx *= 0.86;
        s.vy *= 0.86;
        const m = 40;
        s.x = Math.max(m, Math.min(W - m, s.x));
        s.y = Math.max(m + 26, Math.min(H - m, s.y));
      }
    }

    const neighborhood = (id: string) => {
      const set = new Set([id]);
      for (const e of EDGES) {
        if (e.s === id) set.add(e.o);
        if (e.o === id) set.add(e.s);
      }
      return set;
    };

    const nodeVisible = (id: string, count: number) => {
      if (id === "fujii") return true;
      let k = 0;
      for (const e of EDGES) {
        if (k++ < count && (e.s === id || e.o === id)) return true;
      }
      return false;
    };

    function drawShape(s: SimNode, r: number, fill: string, stroke: string) {
      const cls = nodeById[s.id].cls;
      const shape = SHAPES[cls];
      ctx!.beginPath();
      if (shape === "disc" || shape === "dot") ctx!.arc(s.x, s.y, r, 0, Math.PI * 2);
      else if (shape === "ring") {
        ctx!.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx!.strokeStyle = stroke;
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
        return;
      } else if (shape === "square") ctx!.rect(s.x - r, s.y - r, r * 2, r * 2);
      else if (shape === "tri") {
        ctx!.moveTo(s.x, s.y - r * 1.2);
        ctx!.lineTo(s.x + r * 1.1, s.y + r * 0.9);
        ctx!.lineTo(s.x - r * 1.1, s.y + r * 0.9);
        ctx!.closePath();
      } else {
        ctx!.moveTo(s.x, s.y - r * 1.2);
        ctx!.lineTo(s.x + r * 1.1, s.y);
        ctx!.lineTo(s.x, s.y + r * 1.2);
        ctx!.lineTo(s.x - r * 1.1, s.y);
        ctx!.closePath();
      }
      ctx!.fillStyle = fill;
      ctx!.fill();
    }

    function draw() {
      const { visibleEdges, activeQuery, selectedId } = propsRef.current;
      ctx!.clearRect(0, 0, W, H);
      const focus = hover || (selectedId ? simById[selectedId] : null);
      const hood = focus ? neighborhood(focus.id) : null;

      let k = 0;
      for (const e of EDGES) {
        if (k++ >= visibleEdges) break;
        const p = simById[e.s];
        const q = simById[e.o];
        const na = nodeById[e.s];
        const nb = nodeById[e.o];
        const inHood = hood && focus && (e.s === focus.id || e.o === focus.id);
        const inQuery = activeQuery && na.queries.includes(activeQuery) && nb.queries.includes(activeQuery);
        ctx!.strokeStyle = inHood ? "rgba(255,176,0,0.75)" : inQuery ? "rgba(255,176,0,0.26)" : "rgba(90,98,108,0.20)";
        ctx!.lineWidth = inHood ? 1.4 : 1;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(q.x, q.y);
        ctx!.stroke();
        if (inHood) {
          ctx!.fillStyle = "rgba(255,176,0,0.9)";
          ctx!.font = "9px var(--font-plex-mono), ui-monospace, monospace";
          ctx!.fillText(":" + e.p, (p.x + q.x) / 2 + 6, (p.y + q.y) / 2 - 5);
        }
      }
      for (const s of sim) {
        if (!nodeVisible(s.id, visibleEdges)) continue;
        const n = nodeById[s.id];
        const isFocus = focus === s;
        const inHood = hood?.has(s.id);
        const inQuery = activeQuery && n.queries.includes(activeQuery);
        const lit = isFocus || inHood || (!hood && inQuery);
        const dimmed = (hood && !inHood) || (activeQuery && !inQuery && !hood);
        const r = s.id === "fujii" ? 9 : n.cls === "hobby" ? 3 : 5.5;
        const fill = s.id === "fujii" || lit ? "#ffb000" : dimmed ? "#232a33" : "#4a525c";
        drawShape(s, r + (isFocus ? 2 : 0), fill, lit ? "#ffb000" : dimmed ? "#232a33" : "#4a525c");
        ctx!.fillStyle = s.id === "fujii" ? "#ffd67a" : lit ? "#e8ecf0" : dimmed ? "#2c333d" : "#727c87";
        ctx!.font = (s.id === "fujii" ? "600 12px" : "10px") + " var(--font-plex-mono), ui-monospace, monospace";
        ctx!.fillText(n.label, s.x + r + 6, s.y + 3);
      }
    }

    function loop() {
      if (!reduced || dragging) tick(reduced ? 0.3 : Math.max(0.06, alpha));
      alpha *= 0.998;
      draw();
      raf = requestAnimationFrame(loop);
    }

    // interactions
    const pos = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const pick = (m: { x: number; y: number }) =>
      sim.filter((s) => nodeVisible(s.id, propsRef.current.visibleEdges)).find((s) => Math.hypot(s.x - m.x, s.y - m.y) < 17);

    let downAt: { x: number; y: number } | null = null;
    let downNode: SimNode | null = null;

    const onMove = (e: PointerEvent) => {
      const m = pos(e);
      if (dragging) {
        dragging.x = m.x;
        dragging.y = m.y;
        dragging.vx = dragging.vy = 0;
        return;
      }
      const n = pick(m) || null;
      if (n !== hover) {
        hover = n;
        canvas!.style.cursor = hover ? "pointer" : "grab";
        propsRef.current.onHoverChange(hover ? hover.id : null);
      }
    };
    const onDown = (e: PointerEvent) => {
      const m = pos(e);
      downAt = m;
      downNode = pick(m) || null;
      if (downNode) {
        dragging = downNode;
        canvas!.setPointerCapture(e.pointerId);
      }
    };
    const onUp = (e: PointerEvent) => {
      const m = pos(e);
      const stationary = downAt && Math.hypot(m.x - downAt.x, m.y - downAt.y) < 6;
      if (downNode && stationary) propsRef.current.onSelect(downNode.id);
      else if (!downNode && stationary) propsRef.current.onSelect(null);
      dragging = null;
      downNode = null;
      downAt = null;
    };
    const onLeave = () => {
      hover = null;
      propsRef.current.onHoverChange(null);
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    addEventListener("resize", resize);

    // E2E / debug hook
    (window as unknown as Record<string, unknown>).__open = (id: string) =>
      nodeById[id] && propsRef.current.onSelect(id);

    resize();
    for (let i = 0; i < 260; i++) tick(1 - i / 300); // pre-settle
    loop();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="graph" aria-label="Knowledge graph of Takahiro Fujii. Click nodes for details." />;
}
