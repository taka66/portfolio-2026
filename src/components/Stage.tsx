"use client";

import { useCallback, useEffect, useState } from "react";
import { OntologyGraph } from "@/components/OntologyGraph";
import { ParseLog } from "@/components/ParseLog";
import { EntityPanel } from "@/components/EntityPanel";
import { DEFAULT_FOCUS, ENTITIES, NODES, SENTENCES, type QueryId } from "@/data/ontology";
import type { Locale } from "@/i18n/config";

const QUERIES: QueryId[] = ["career", "craft", "voice", "life"];

export function Stage({ lang }: { lang: Locale }) {
  const [visibleEdges, setVisibleEdges] = useState(0);
  const [activeQuery, setActiveQuery] = useState<QueryId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [triples, setTriples] = useState(0);

  const onCommit = useCallback((count: number) => {
    setVisibleEdges(count);
    setTriples(count);
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

  return (
    <main className="stage">
      <aside className="rail">
        <div className="head">
          takahirofujii.dev — <b>ontology.ttl</b>
          <br />
          <span className="who">:fujii</span> · 藤井 貴浩 · product engineer / cto
          <br />
          triples <span className="stat" data-testid="triples">{triples}</span> · nodes{" "}
          <span className="stat">{NODES.length}</span> · lang <span className="stat">{lang}</span>
        </div>
        <ParseLog onCommit={onCommit} />
        <div className="focus">
          <div className="fp">FOCUS</div>
          {/* sentences are hand-authored in src/data/ontology.ts, not user input */}
          <div className="ft hum" dangerouslySetInnerHTML={{ __html: focusHtml }} />
        </div>
      </aside>

      <section className="field">
        <OntologyGraph
          visibleEdges={visibleEdges}
          activeQuery={activeQuery}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onHoverChange={setHoverId}
        />
        <nav className="queries" aria-label="saved queries">
          {QUERIES.map((q) => (
            <button
              key={q}
              className={activeQuery === q ? "on" : ""}
              onClick={() => setActiveQuery(activeQuery === q ? null : q)}
            >
              ?{q}
            </button>
          ))}
        </nav>
        <div className="topbar">
          <span className="tempnote">temp 0.0 · deterministic</span>
          <span className="lang">
            {/* Deliberately plain <a>, not <Link>: locale switching must be a
                full page load so the router cache and prefetch never serve a
                stale-locale redirect (portfolio-2025 commit 917623b). */}
            {/* eslint-disable @next/next/no-html-link-for-pages */}
            {lang === "ja" ? <a className="on">あ</a> : <a href="/" hrefLang="ja" lang="ja">あ</a>}
            {" / "}
            {lang === "en" ? <a className="on">A</a> : <a href="/en" hrefLang="en" lang="en">A</a>}
            {/* eslint-enable @next/next/no-html-link-for-pages */}
          </span>
        </div>
        <div className="legend">
          <i>●</i> person / role &nbsp; <i>■</i> org &nbsp; <i>▲</i> artifact
          <br />
          <i>◆</i> skill &nbsp; <i>○</i> domain &nbsp; <i>·</i> hobby
        </div>

        <EntityPanel entityId={selectedId} lang={lang} onClose={() => setSelectedId(null)} onOpen={setSelectedId} />
      </section>
    </main>
  );
}
