"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OntologyGraph } from "@/components/OntologyGraph";
import { ParseLog } from "@/components/ParseLog";
import { EntityPanel } from "@/components/EntityPanel";
import { DEFAULT_FOCUS, ENTITIES, NODES, QUERY_HUES, SENTENCES, UI, nodeById, type QueryId } from "@/data/ontology";
import type { Locale } from "@/i18n/config";

const QUERIES: QueryId[] = ["career", "craft", "voice", "life"];

export function Stage({ lang }: { lang: Locale }) {
  const [visibleEdges, setVisibleEdges] = useState(0);
  const [activeQuery, setActiveQuery] = useState<QueryId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [triples, setTriples] = useState(0);
  const [queryFirst, setQueryFirst] = useState(false);
  // chip hover/activation asks the graph "which nodes are you?" — members
  // answer with one gentle ripple in the query's hue
  const [pulse, setPulse] = useState<{ q: QueryId; stamp: number } | null>(null);
  const pulseCount = useRef(0);
  const firePulse = useCallback((q: QueryId) => {
    pulseCount.current += 1;
    setPulse({ q, stamp: pulseCount.current });
  }, []);

  // On a phone, 45 nodes are noise: start filtered to one saved query and
  // hide everything outside it (chips switch, tapping the active chip = all).
  useEffect(() => {
    if (!matchMedia("(max-width: 860px)").matches) return;
    const timer = setTimeout(() => {
      setQueryFirst(true);
      setActiveQuery((q) => q ?? "career");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const onCommit = useCallback((count: number) => {
    setVisibleEdges(count);
    setTriples(count);
  }, []);

  const openEntity = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  useEffect(() => {
    const focus = new URLSearchParams(location.search).get("e");
    if (!focus || !nodeById[focus]) return;
    const timer = setTimeout(() => setSelectedId(focus), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const focusHtml = hoverId
    ? (ENTITIES[hoverId]?.desc[lang] ?? SENTENCES[hoverId]?.[lang] ?? DEFAULT_FOCUS[lang])
    : DEFAULT_FOCUS[lang];

  const [legendLine1, legendLine2] = UI.legend[lang].split("|");

  return (
    <main className="stage">
      <aside className="rail">
        <div className="head">
          <span className="who">:fujii</span> · {ENTITIES.fujii.title[lang]} · {UI.rolesLine[lang]}
          <br />
          triples <span className="stat" data-testid="triples">{triples}</span> · nodes{" "}
          <span className="stat">{NODES.length}</span> · lang <span className="stat">{lang}</span>
        </div>
        <div className="head-links">
          {(ENTITIES.fujii.meta ?? [])
            .filter((m) => m.href && [":github", ":x", ":note"].includes(m.p))
            .map((m) => (
              <a key={m.p} href={m.href} target="_blank" rel="noopener noreferrer">
                {m.p} ↗
              </a>
            ))}
        </div>
        <ParseLog onCommit={onCommit} />
        <div className="focus">
          <div className="fp">{UI.focusLabel[lang]}</div>
          {/* sentences are hand-authored in src/data/ontology.ts, not user input */}
          <div className="ft hum" dangerouslySetInnerHTML={{ __html: focusHtml }} />
        </div>
      </aside>

      <section className="field">
        <OntologyGraph
          visibleEdges={visibleEdges}
          activeQuery={activeQuery}
          hideOffQuery={queryFirst}
          pulse={pulse}
          heartbeat={queryFirst}
          selectedId={selectedId}
          onSelect={openEntity}
          onHoverChange={setHoverId}
        />
        <nav className="queries" aria-label="saved queries">
          <span className="wlabel">WHERE</span>
          {QUERIES.map((q) => (
            <button
              key={q}
              className={activeQuery === q ? "on" : ""}
              style={{ "--qc": `rgb(${QUERY_HUES[q]})` } as React.CSSProperties}
              onPointerEnter={(e) => e.pointerType === "mouse" && firePulse(q)}
              onClick={() => {
                setActiveQuery(activeQuery === q ? null : q);
                firePulse(q);
              }}
            >
              ?{q}
            </button>
          ))}
        </nav>
        <div className="topbar">
          <span className="tempnote">temp 0.0 · deterministic</span>
        </div>
        <div className="legend">
          {legendLine1}
          <br />
          {legendLine2}
        </div>

        <EntityPanel entityId={selectedId} lang={lang} onClose={() => setSelectedId(null)} onOpen={openEntity} />
      </section>
    </main>
  );
}
