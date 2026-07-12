"use client";

import Image from "next/image";
import { EDGES, ENTITIES, SOURCES, UI, nodeById } from "@/data/ontology";
import type { Locale } from "@/i18n/config";

interface EntityPanelProps {
  entityId: string | null;
  lang: Locale;
  onClose: () => void;
  onOpen: (id: string) => void;
}

export function EntityPanel({ entityId, lang, onClose, onOpen }: EntityPanelProps) {
  const node = entityId ? nodeById[entityId] : null;
  const detail = entityId ? ENTITIES[entityId] : null;
  // internal hrefs stay in-tab (locale-prefixed); external ones open a new tab
  const linkProps = (href: string) =>
    href.startsWith("/")
      ? { href: lang === "en" ? `/en${href}` : href }
      : { href, target: "_blank", rel: "noopener noreferrer" };

  // provenance: the public sources behind every claim touching this node
  const sourceIds = node
    ? [...new Set(EDGES.filter((e) => (e.s === node.id || e.o === node.id) && e.src).flatMap((e) => e.src!))]
    : [];

  return (
    <aside className={`entity${node ? " open" : ""}`} aria-label="entity detail" aria-hidden={!node}>
      {node && (
        <>
          <div className="e-head">
            <div>
              <div className="e-uri">{node.label}</div>
              <div className="e-type">{detail?.type ?? `a :${node.cls.charAt(0).toUpperCase()}${node.cls.slice(1)}`}</div>
            </div>
            <button className="e-close" onClick={onClose} aria-label={UI.close[lang]}>
              ✕
            </button>
          </div>
          <div className="e-body">
            {detail ? (
              <>
                <div className="e-title hum">{detail.title[lang]}</div>
                <p className="e-desc hum">{detail.desc[lang]}</p>
                {detail.meta && (
                  <div className="e-sec">
                    <h3>{UI.headTriples[lang]}</h3>
                    {detail.meta.map((m) => (
                      <div className="t-row" key={m.p + m.v}>
                        <span className="tp">{m.p}</span>
                        <span className="tv">
                          {m.href ? (
                            <a href={m.href} target="_blank" rel="noopener noreferrer">
                              {m.v}
                            </a>
                          ) : (
                            m.v
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {detail.gallery && (
                  <div className="e-sec">
                    <h3>{UI.headGallery[lang]}</h3>
                    <div className="gallery">
                      {detail.gallery.map((g) => (
                        <figure key={g.src}>
                          <Image src={g.src} alt={g.caption[lang]} width={200} height={200} />
                          <figcaption>{g.caption[lang]}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                )}
                {detail.items && (
                  <div className="e-sec">
                    <h3>{UI.headInstances[lang]} ({detail.items.length})</h3>
                    {detail.items.map((item, i) => (
                      <div className="i-row" key={i}>
                        <span className="iy">{item.y}</span>
                        <span className="it hum">
                          {item.href ? <a {...linkProps(item.href)}>{item.label[lang]}</a> : item.label[lang]}
                        </span>
                        {item.href && (
                          <a className="ix" {...linkProps(item.href)} aria-label="open link">
                            ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {detail.rel && (
                  <div className="e-sec">
                    <h3>{UI.headRelated[lang]}</h3>
                    <div className="chips">
                      {detail.rel.map((id) => (
                        <button key={id} onClick={() => onOpen(id)}>
                          {nodeById[id].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {sourceIds.length > 0 && (
                  <div className="e-sec e-src">
                    <h3>{UI.headSources[lang]}</h3>
                    {sourceIds.map((id) => {
                      const s = SOURCES[id];
                      return (
                        <div className="s-row" key={id}>
                          {s.href ? <a {...linkProps(s.href)}>{s.label} ↗</a> : s.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="e-title hum">{node.label.slice(1)}</div>
                <div className="e-sec">
                  <h3>{UI.headTriples[lang]}</h3>
                  {EDGES.filter((e) => e.s === node.id || e.o === node.id)
                    .slice(0, 6)
                    .map((e, i) => (
                      <div className="t-row" key={i}>
                        <span className="tp">:{e.p}</span>
                        <span className="tv">{e.s === node.id ? nodeById[e.o].label : `${nodeById[e.s].label} →`}</span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
