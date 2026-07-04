"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UI, nodeById } from "@/data/ontology";
import { WORK_SOURCES, worksRows, type WorkSource } from "@/lib/queries";
import type { Locale } from "@/i18n/config";

export function WorksView({ lang }: { lang: Locale }) {
  const [filter, setFilter] = useState<WorkSource | "all">("all");
  const all = useMemo(() => worksRows(), []);
  const rows = filter === "all" ? all : all.filter((r) => r.source === filter);
  const prefix = lang === "ja" ? "" : "/en";
  const artifactCount = new Set(all.map((r) => r.source)).size;

  return (
    <main className="qpage">
      <div className="qhead">
        <div>
          <span className="c"># saved query</span>
        </div>
        <div>
          <span className="q">?works</span> = SELECT ?instance WHERE {"{"}
        </div>
        <div>
          &nbsp;&nbsp;:fujii <span className="q">:speaksAt</span>|<span className="q">:coHosts</span>|
          <span className="q">:reviewed</span>|<span className="q">:writes</span> ?artifact .
        </div>
        <div>
          &nbsp;&nbsp;?instance <span className="q">:partOf</span> ?artifact . {"}"} ORDER BY DESC(
          <span className="v">?year</span>)
        </div>
        <div className="qresult">
          → <b data-testid="works-count">{rows.length}</b> instances · {artifactCount} artifacts · 0.0ms{" "}
          <span className="c">(precomputed at build)</span>
        </div>
      </div>

      <h1 className="qtitle hum">Works</h1>
      <p className="qsub hum">{UI.worksSub[lang]}</p>

      <div className="where" role="group" aria-label="WHERE">
        <span className="wlabel">WHERE</span>
        <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
          ALL
        </button>
        {WORK_SOURCES.map((source) => (
          <button key={source} className={filter === source ? "on" : ""} onClick={() => setFilter(source)}>
            {nodeById[source].label}
          </button>
        ))}
      </div>

      <div className="qrows">
        {rows.map((row, i) => (
          <div className="qrow" key={`${row.source}-${i}`}>
            <span className="y">{row.y}</span>
            <span className="t hum">
              {row.href ? (
                <a href={row.href} target="_blank" rel="noopener noreferrer">
                  {row.label[lang]}
                </a>
              ) : (
                row.label[lang]
              )}
            </span>
            <Link className="src" href={`${prefix || "/"}?e=${row.source}`}>
              {nodeById[row.source].label}
            </Link>
            {row.href && <span className="x">↗</span>}
          </div>
        ))}
      </div>
    </main>
  );
}
