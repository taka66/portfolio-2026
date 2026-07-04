import { EDGES, ENTITIES, NODES, nodeById } from "@/data/ontology";
import type { Locale } from "@/i18n/config";

/**
 * The public face of the ontology: the same data that drives the graph is
 * emitted as schema.org structured data. One source of truth, two audiences
 * (visitors and crawlers).
 */
export function buildPersonJsonLd(lang: Locale, siteUrl: string) {
  const skills = NODES.filter((n) => n.cls === "skill").map((n) => n.label.slice(1));
  const fujii = ENTITIES.fujii;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fujii.title[lang],
    alternateName: lang === "ja" ? "Takahiro Fujii" : "藤井 貴浩",
    url: siteUrl,
    jobTitle: "CTO / Product Engineer",
    worksFor: {
      "@type": "Organization",
      name: "WealthPark",
    },
    knowsAbout: skills,
    sameAs: (fujii.meta ?? []).filter((m) => m.href).map((m) => m.href),
    // the full ontology, for the curious
    disambiguatingDescription: `${NODES.length} nodes, ${EDGES.length} triples`,
  };
}

/** referential integrity guard used by unit tests */
export function validateOntology(): string[] {
  const problems: string[] = [];
  for (const e of EDGES) {
    if (!nodeById[e.s]) problems.push(`edge subject missing: ${e.s}`);
    if (!nodeById[e.o]) problems.push(`edge object missing: ${e.o}`);
  }
  for (const [id, detail] of Object.entries(ENTITIES)) {
    if (!nodeById[id]) problems.push(`entity without node: ${id}`);
    for (const rel of detail.rel ?? []) {
      if (!nodeById[rel]) problems.push(`entity ${id} rel missing: ${rel}`);
    }
  }
  const ids = new Set<string>();
  for (const n of NODES) {
    if (ids.has(n.id)) problems.push(`duplicate node id: ${n.id}`);
    ids.add(n.id);
  }
  return problems;
}
