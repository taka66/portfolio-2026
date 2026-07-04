"use client";

import { useCallback, useEffect, useState } from "react";
import { OntologyGraph } from "@/components/OntologyGraph";
import { ParseLog } from "@/components/ParseLog";
import { EntityPanel } from "@/components/EntityPanel";
import { ProfilePanel } from "@/components/ProfilePanel";
import { DEFAULT_FOCUS, ENTITIES, NODES, SENTENCES, UI, type QueryId } from "@/data/ontology";
import type { Locale } from "@/i18n/config";

const QUERIES: QueryId[] = ["career", "craft", "voice", "life"];

export function Stage({ lang }: { lang: Locale }) {
  const [visibleEdges, setVisibleEdges] = useState(0);
  const [activeQuery, setActiveQuery] = useState<QueryId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [triples, setTriples] = useState(0);

  const onCommit = useCallback((count: number) => {
    setVisibleEdges(count);
    setTriples(count);
  }, []);

  const openEntity = useCallback((id: string | null) => {
    setProfileOpen(false);
    setSelectedId(id);
  }, []);

  const openProfile = useCallback(() => {
    setSelectedId(null);
    setProfileOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setProfileOpen(false);
      }
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
          takahirofujii.dev — <b>ontology.ttl</b>
          <br />
          <span className="who">:fujii</span> · 藤井 貴浩 · {UI.rolesLine[lang]}
          <br />
          triples <span className="stat" data-testid="triples">{triples}</span> · nodes{" "}
          <span className="stat">{NODES.length}</span> · lang <span className="stat">{lang}</span>
        </div>
        <button className="profile-cta" onClick={openProfile} data-testid="profile-cta">
          {UI.profileButton[lang]} <span aria-hidden="true">▸</span>
        </button>
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
          selectedId={selectedId}
          onSelect={openEntity}
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
          {legendLine1}
          <br />
          {legendLine2}
        </div>

        <EntityPanel entityId={selectedId} lang={lang} onClose={() => setSelectedId(null)} onOpen={openEntity} />
        <ProfilePanel open={profileOpen} lang={lang} onClose={() => setProfileOpen(false)} onOpenEntity={openEntity} />
      </section>
    </main>
  );
}
