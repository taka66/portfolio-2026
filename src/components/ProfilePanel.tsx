"use client";

import { ENTITIES, PROFILE_SECTIONS, UI, nodeById } from "@/data/ontology";
import type { Locale } from "@/i18n/config";

interface ProfilePanelProps {
  open: boolean;
  lang: Locale;
  onClose: () => void;
  onOpenEntity: (id: string) => void;
}

/**
 * The linear, human-readable rendering of the whole ontology — the answer to
 * "I just landed here, who is this person?". Every entry links back into the
 * graph's entity panels.
 */
export function ProfilePanel({ open, lang, onClose, onOpenEntity }: ProfilePanelProps) {
  const fujii = ENTITIES.fujii;

  return (
    <aside className={`entity profile${open ? " open" : ""}`} aria-label={UI.profileTitle[lang]} aria-hidden={!open}>
      {open && (
        <>
          <div className="e-head">
            <div>
              <div className="e-uri">:fujii/profile</div>
              <div className="e-type">{UI.profileType[lang]}</div>
            </div>
            <button className="e-close" onClick={onClose} aria-label={UI.close[lang]}>
              ✕
            </button>
          </div>
          <div className="e-body">
            <div className="e-title hum">{fujii.title[lang]}</div>
            <p className="e-desc hum">{fujii.desc[lang]}</p>

            {PROFILE_SECTIONS.map((section) => (
              <div className="e-sec" key={section.title.en}>
                <h3>{section.title[lang]}</h3>
                {section.entityIds.map((id) => {
                  const detail = ENTITIES[id];
                  if (!detail) return null;
                  return (
                    <button key={id} className="p-entry" onClick={() => onOpenEntity(id)}>
                      <span className="p-name hum">
                        {detail.title[lang]}
                        <span className="p-uri">{nodeById[id].label}</span>
                      </span>
                      <span className="p-desc hum">{detail.desc[lang]}</span>
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="e-sec">
              <h3>{UI.headRelated[lang]}</h3>
              <div className="t-rows">
                {(fujii.meta ?? [])
                  .filter((m) => m.href)
                  .map((m) => (
                    <div className="t-row" key={m.p}>
                      <span className="tp">{m.p}</span>
                      <span className="tv">
                        <a href={m.href} target="_blank" rel="noopener noreferrer">
                          {m.v}
                        </a>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
