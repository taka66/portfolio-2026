"use client";

import { useEffect, useRef } from "react";
import { EDGES, ENTITIES, NODES, QUERY_HUES, nodeById, type QueryId } from "@/data/ontology";

interface GraphProps {
  visibleEdges: number;
  activeQuery: QueryId | null;
  /** query-first mode (mobile): nodes outside the active query disappear instead of dimming */
  hideOffQuery: boolean;
  /** chip hover/activation signal: member nodes answer with one ripple in the query's hue */
  pulse: { q: QueryId; stamp: number } | null;
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

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
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

/** nodes with a full story panel get the breathing halo */
const HAS_STORY = new Set(Object.keys(ENTITIES));

export function OntologyGraph({
  visibleEdges,
  activeQuery,
  hideOffQuery,
  pulse,
  selectedId,
  onSelect,
  onHoverChange,
}: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // live prop values readable from the single mount effect
  const propsRef = useRef({ visibleEdges, activeQuery, hideOffQuery, pulse, selectedId, onSelect, onHoverChange });
  useEffect(() => {
    propsRef.current = { visibleEdges, activeQuery, hideOffQuery, pulse, selectedId, onSelect, onHoverChange };
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

    // animation state
    const bornAt: number[] = new Array(EDGES.length).fill(-1);
    let prevVisible = 0;
    let ripple: { x: number; y: number; t0: number } | null = null;

    // label layout state (slot memory keeps labels from flickering)
    const labelSlots: Record<string, number> = {};
    let labelRects: Record<string, Rect> = {};

    // one ripple per chip touch, answered by every member node
    let pulseSeen = 0;
    let pulseAnim: { q: QueryId; t0: number } | null = null;

    // ---- query-first filtering: the visible subset re-lays itself out ----
    const hiddenByFilter = (id: string) => {
      const { hideOffQuery, activeQuery } = propsRef.current;
      return Boolean(hideOffQuery && activeQuery && id !== "fujii" && !nodeById[id].queries.includes(activeQuery));
    };
    /** per-node layout anchor (defaults to the hand-placed seed) */
    const anchors: Record<string, [number, number]> = Object.fromEntries(
      NODES.map((n) => [n.id, n.seed as [number, number]])
    );
    let filterKey = "all";
    /** on filter change: stretch the visible subset's seeds to fill the canvas */
    function syncFilter() {
      const { hideOffQuery, activeQuery } = propsRef.current;
      const key = hideOffQuery && activeQuery ? activeQuery : "all";
      if (key === filterKey) return;
      filterKey = key;
      const visible = sim.filter((s) => !hiddenByFilter(s.id));
      if (key === "all" || visible.length < 3) {
        for (const n of NODES) anchors[n.id] = n.seed as [number, number];
      } else {
        // hub in the middle, everyone else on a ring around it — the angular
        // order comes from the hand-placed seeds so neighborhoods survive;
        // larger subsets interleave two radii to keep node spacing generous
        anchors.fujii = [0.5, 0.53];
        const f = nodeById.fujii.seed;
        const ring = visible
          .filter((s) => s.id !== "fujii")
          .map((s) => ({
            id: s.id,
            ang: Math.atan2(nodeById[s.id].seed[1] - f[1], nodeById[s.id].seed[0] - f[0]),
          }))
          .sort((a, b) => a.ang - b.ang);
        ring.forEach((n, i) => {
          const ang = (ring[0]?.ang ?? 0) + (i / ring.length) * Math.PI * 2;
          const k = ring.length > 10 && i % 2 === 1 ? 0.62 : 1;
          anchors[n.id] = [0.5 + 0.4 * k * Math.cos(ang), 0.53 + 0.37 * k * Math.sin(ang)];
        });
      }
      if (seeded) alpha = Math.max(alpha, 0.6);
    }

    let seeded = false;

    function applySize() {
      const newW = canvas!.clientWidth;
      const newH = canvas!.clientHeight;
      // A canvas measured before flex layout settles (iOS Safari) reports a
      // degenerate size; seeding there piles every node onto one point and
      // the repulsion blows up. Wait for a real size instead.
      if (newW < 80 || newH < 80) return;
      if (newW === W && newH === H) return;

      if (seeded) {
        // keep the settled layout: carry positions into the new box
        for (const s of sim) {
          s.x *= newW / W;
          s.y *= newH / H;
        }
        alpha = Math.max(alpha, 0.4);
      }
      W = newW;
      H = newH;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!seeded) {
        syncFilter();
        for (const s of sim) {
          const seed = nodeById[s.id].seed;
          s.x = Math.max(40, Math.min(W - 40, seed[0] * W));
          s.y = Math.max(66, Math.min(H - 40, seed[1] * H));
          s.placed = true;
        }
        seeded = true;
        for (let i = 0; i < 260; i++) tick(1 - i / 300); // pre-settle off-screen
      }
    }

    function tick(a: number) {
      // filtered-out nodes freeze in place: the visible subset gets the
      // whole canvas and settles into its own arrangement
      const active = sim.filter((s) => !hiddenByFilter(s.id));
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          const p = active[i];
          const q = active[j];
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
        if (hiddenByFilter(e.s) || hiddenByFilter(e.o)) continue;
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
      for (const s of active) {
        const seed = anchors[s.id];
        s.vx += (seed[0] * W - s.x) * 0.02 * a;
        s.vy += (seed[1] * H - s.y) * 0.02 * a;
        // speed cap: whatever the forces do, nodes may drift but never dart
        const speed = Math.hypot(s.vx, s.vy);
        if (speed > 7) {
          s.vx *= 7 / speed;
          s.vy *= 7 / speed;
        }
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

    function draw(now: number) {
      const { visibleEdges, activeQuery, hideOffQuery, pulse, selectedId } = propsRef.current;

      if (pulse && pulse.stamp !== pulseSeen) {
        pulseSeen = pulse.stamp;
        if (!reduced) pulseAnim = { q: pulse.q, t0: now };
      }
      const pulseK = pulseAnim ? (now - pulseAnim.t0) / 700 : 1;
      if (pulseK >= 1) pulseAnim = null;

      // remember when each edge became visible (for the birth flash)
      if (visibleEdges > prevVisible) {
        for (let i = prevVisible; i < visibleEdges; i++) bornAt[i] = now;
        prevVisible = visibleEdges;
      }
      ctx!.clearRect(0, 0, W, H);
      const focus = hover || (selectedId ? simById[selectedId] : null);
      const hood = focus ? neighborhood(focus.id) : null;

      let k = 0;
      for (const e of EDGES) {
        const idx = k++;
        if (idx >= visibleEdges) break;
        const p = simById[e.s];
        const q = simById[e.o];
        const na = nodeById[e.s];
        const nb = nodeById[e.o];
        const inHood = hood && focus && (e.s === focus.id || e.o === focus.id);
        const inQuery = activeQuery && na.queries.includes(activeQuery) && nb.queries.includes(activeQuery);
        if (hideOffQuery && activeQuery && !inQuery && !inHood) continue;
        const w = e.weight ?? 1;
        // birth flash: freshly committed edges glow for a moment
        const age = bornAt[idx] >= 0 ? now - bornAt[idx] : Infinity;
        const flash = reduced ? 0 : Math.max(0, 1 - age / 700);

        const base = inHood ? 0.75 : inQuery ? 0.26 : 0.2;
        ctx!.strokeStyle =
          inHood || flash > 0
            ? `rgba(255,176,0,${Math.min(0.9, (inHood ? 0.75 : 0.15) * w + flash * 0.6)})`
            : inQuery
              ? `rgba(255,176,0,${base * w})`
              : `rgba(90,98,108,${base * w})`;
        ctx!.lineWidth = ((inHood ? 1.4 : 1) + flash * 0.8) * (w < 1 ? 0.8 : 1);
        if (w < 1) ctx!.setLineDash([3, 5]);
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(q.x, q.y);
        ctx!.stroke();
        ctx!.setLineDash([]);

        if (inHood) {
          ctx!.fillStyle = "rgba(255,176,0,0.9)";
          ctx!.font = "9px var(--font-plex-mono), ui-monospace, monospace";
          ctx!.fillText(":" + e.p, (p.x + q.x) / 2 + 6, (p.y + q.y) / 2 - 5);

          // direction pulses: subject → object, so the triple reads as a sentence
          if (!reduced) {
            const tt = (now / 1400 + idx * 0.37) % 1;
            const px = p.x + (q.x - p.x) * tt;
            const py = p.y + (q.y - p.y) * tt;
            ctx!.beginPath();
            ctx!.arc(px, py, 1.7, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(255,214,122,${0.9 * (1 - tt * 0.35)})`;
            ctx!.fill();
          }
        }
      }

      const drawn: { s: SimNode; r: number; lit: boolean; dimmed: boolean }[] = [];
      for (const s of sim) {
        if (!nodeVisible(s.id, visibleEdges)) continue;
        const n = nodeById[s.id];
        const isFocus = focus === s;
        const inHood = hood?.has(s.id);
        const inQuery = activeQuery && n.queries.includes(activeQuery);
        if (hideOffQuery && activeQuery && !inQuery && !inHood && !isFocus && s.id !== "fujii") continue;
        const lit = Boolean(isFocus || inHood || (!hood && inQuery));
        const dimmed = Boolean((hood && !inHood) || (activeQuery && !inQuery && !hood));
        const r = s.id === "fujii" ? 9 : n.cls === "hobby" ? 3 : 5.5;

        // breathing halo on story nodes: "there is something to open here"
        if (HAS_STORY.has(s.id) && !dimmed) {
          const phase = s.id.charCodeAt(0) * 1.7;
          const breath = reduced ? 0 : Math.sin(now / 900 + phase);
          const haloAlpha = (s.id === "fujii" ? 0.16 : 0.09) + (reduced ? 0 : 0.05) * (breath * 0.5 + 0.5);
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, r + 5 + (reduced ? 0 : breath * 1.4), 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(255,176,0,${haloAlpha})`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
        }

        // genre arcs: one faint segment per saved query the node belongs to
        if (!dimmed) {
          const seg = (Math.PI * 2) / n.queries.length;
          const gap = n.queries.length > 1 ? 0.3 : 0;
          const R = r + 9;
          n.queries.forEach((q, qi) => {
            ctx!.beginPath();
            ctx!.arc(s.x, s.y, R, -Math.PI / 2 + qi * seg + gap / 2, -Math.PI / 2 + (qi + 1) * seg - gap / 2);
            ctx!.strokeStyle = `rgba(${QUERY_HUES[q]},0.28)`;
            ctx!.lineWidth = 1.2;
            ctx!.stroke();
          });
        }

        // chip-touch answer: members of the asked query ripple once in its hue
        if (pulseAnim && !dimmed && n.queries.includes(pulseAnim.q)) {
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, r + 7 + pulseK * 20, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${QUERY_HUES[pulseAnim.q]},${0.5 * (1 - pulseK)})`;
          ctx!.lineWidth = 1.4;
          ctx!.stroke();
        }

        const fill = s.id === "fujii" || lit ? "#ffb000" : dimmed ? "#232a33" : "#4a525c";
        drawShape(s, r + (isFocus ? 2 : 0), fill, lit ? "#ffb000" : dimmed ? "#232a33" : "#4a525c");
        drawn.push({ s, r, lit, dimmed });
      }

      // ---- label pass with collision avoidance ----
      // every marker is an obstacle; each label tries 6 slots around its
      // node (right/left x mid/up/down) and keeps its previous slot when
      // that slot is still clean, so labels don't flicker between frames
      const obstacles: Rect[] = drawn.map((d) => ({
        x: d.s.x - d.r - 2,
        y: d.s.y - d.r - 2,
        w: (d.r + 2) * 2,
        h: (d.r + 2) * 2,
      }));
      labelRects = {};
      for (const d of drawn) {
        const n = nodeById[d.s.id];
        const isFujii = d.s.id === "fujii";
        ctx!.font = (isFujii ? "600 12px" : "10px") + " var(--font-plex-mono), ui-monospace, monospace";
        const tw = ctx!.measureText(n.label).width;
        const lh = isFujii ? 13 : 11;
        const rr = d.r + 4;
        // no left-diagonal slots: text reads left-to-right, so a long label
        // up-left of its node starts far away and looks unowned. Above/below
        // slots center on the node like a caption instead.
        const cx = Math.max(3, Math.min(W - 3 - tw, d.s.x - tw / 2));
        const slotRect = (slot: number): Rect => {
          switch (slot) {
            case 0:
              return { x: d.s.x + rr + 3, y: d.s.y - lh / 2, w: tw, h: lh }; // right
            case 1:
              return { x: d.s.x - rr - 3 - tw, y: d.s.y - lh / 2, w: tw, h: lh }; // left
            case 2:
              return { x: cx, y: d.s.y - rr - lh - 1, w: tw, h: lh }; // above, centered
            case 3:
              return { x: cx, y: d.s.y + rr + 1, w: tw, h: lh }; // below, centered
            case 4:
              return { x: d.s.x + rr + 1, y: d.s.y - rr - lh, w: tw, h: lh }; // right-up
            default:
              return { x: d.s.x + rr + 1, y: d.s.y + rr, w: tw, h: lh }; // right-down
          }
        };
        const order = [labelSlots[d.s.id] ?? 0, 0, 1, 2, 3, 4, 5].filter((v, i, a) => a.indexOf(v) === i);
        let best: Rect = slotRect(order[0]);
        let bestSlot = order[0];
        let bestScore = Infinity;
        for (const slot of order) {
          const rect = slotRect(slot);
          let score = 0;
          if (rect.x < 2) score += (2 - rect.x) * lh;
          if (rect.x + rect.w > W - 2) score += (rect.x + rect.w - W + 2) * lh;
          // top zone is reserved for the WHERE chips overlay
          if (rect.y < 56 || rect.y + rect.h > H - 2) score += 400;
          for (const o of obstacles) {
            score +=
              Math.max(0, Math.min(rect.x + rect.w, o.x + o.w) - Math.max(rect.x, o.x)) *
              Math.max(0, Math.min(rect.y + rect.h, o.y + o.h) - Math.max(rect.y, o.y));
          }
          if (score < bestScore) {
            bestScore = score;
            best = rect;
            bestSlot = slot;
          }
          if (score === 0) break;
        }
        labelSlots[d.s.id] = bestSlot;
        obstacles.push(best);
        labelRects[d.s.id] = best;
        ctx!.fillStyle = isFujii ? "#ffd67a" : d.lit ? "#e8ecf0" : d.dimmed ? "#2c333d" : "#727c87";
        ctx!.fillText(n.label, best.x, best.y + lh - 3);
      }

      // click ripple
      if (ripple) {
        const kk = (now - ripple.t0) / 520;
        if (kk >= 1) ripple = null;
        else {
          ctx!.beginPath();
          ctx!.arc(ripple.x, ripple.y, 10 + kk * 42, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(255,176,0,${0.45 * (1 - kk)})`;
          ctx!.lineWidth = 1.4;
          ctx!.stroke();
        }
      }
    }

    function loop(now: number) {
      if (seeded) {
        syncFilter();
        if (!reduced || dragging) tick(reduced ? 0.3 : Math.max(0.06, alpha));
        alpha *= 0.998;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    }

    // interactions
    const pos = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const pickable = (s: SimNode) => {
      const { visibleEdges, activeQuery, hideOffQuery, selectedId } = propsRef.current;
      if (!nodeVisible(s.id, visibleEdges)) return false;
      if (
        hideOffQuery &&
        activeQuery &&
        s.id !== "fujii" &&
        s.id !== selectedId &&
        !nodeById[s.id].queries.includes(activeQuery)
      )
        return false;
      return true;
    };
    const pick = (m: { x: number; y: number }) =>
      sim.filter(pickable).find((s) => Math.hypot(s.x - m.x, s.y - m.y) < 17);

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
      if (downNode && stationary) {
        ripple = { x: downNode.x, y: downNode.y, t0: performance.now() };
        propsRef.current.onSelect(downNode.id);
      } else if (!downNode && stationary) propsRef.current.onSelect(null);
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
    // ResizeObserver instead of window resize: it also fires when flex layout
    // finally gives the canvas its real size, and on iOS URL-bar collapse
    const ro = new ResizeObserver(() => applySize());
    ro.observe(canvas);

    // E2E / debug hooks
    (window as unknown as Record<string, unknown>).__open = (id: string) =>
      nodeById[id] && propsRef.current.onSelect(id);
    (window as unknown as Record<string, unknown>).__graph = () => ({
      w: W,
      h: H,
      nodes: sim.map((s) => ({ id: s.id, x: s.x, y: s.y, vx: s.vx, vy: s.vy, hidden: hiddenByFilter(s.id) })),
      labels: labelRects,
    });

    applySize();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} id="graph" aria-label="Knowledge graph of Takahiro Fujii. Click nodes for details." />;
}
