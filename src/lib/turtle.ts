import { CLASS_EQUIV, EDGES, ENTITIES, NODES, VOCAB } from "@/data/ontology";

/**
 * The header has said "ontology.ttl" since day one — this makes it true.
 * The same single source that drives the graph serializes to real Turtle:
 * classes and predicates declared with their mappings into schema.org and
 * FOAF, then every individual and triple.
 */
export function buildTurtle(): string {
  const lines: string[] = [
    "# takahirofujii.dev — ontology.ttl",
    "# temp 0.0 · deterministic — generated from the same data that draws the graph",
    "",
    "@prefix : <https://takahirofujii.dev/ontology#> .",
    "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .",
    "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .",
    "@prefix owl: <http://www.w3.org/2002/07/owl#> .",
    "@prefix schema: <https://schema.org/> .",
    "@prefix foaf: <http://xmlns.com/foaf/0.1/> .",
    "",
    "# ---- classes ----",
  ];

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  for (const [cls, equiv] of Object.entries(CLASS_EQUIV)) {
    lines.push(`:${cap(cls)} a rdfs:Class${equiv.length ? ` ; owl:equivalentClass ${equiv.join(", ")}` : ""} .`);
  }

  lines.push("", "# ---- properties ----");
  for (const [p, def] of Object.entries(VOCAB)) {
    const parts = [`:${p} a rdf:Property`];
    if (def.equiv) parts.push(`rdfs:subPropertyOf ${def.equiv}`);
    if (def.inverseOf) parts.push(`owl:inverseOf ${def.inverseOf}`);
    parts.push(`rdfs:comment "${def.comment}"@en`);
    lines.push(parts.join(" ;\n  ") + " .");
  }

  lines.push("", "# ---- individuals ----");
  for (const n of NODES) {
    const detail = ENTITIES[n.id];
    const labels = detail
      ? `rdfs:label "${detail.title.ja}"@ja, "${detail.title.en}"@en`
      : `rdfs:label "${n.label.slice(1)}"`;
    lines.push(`:${n.id} a :${cap(n.cls)} ; ${labels} .`);
  }

  lines.push("", "# ---- triples ----");
  for (const e of EDGES) {
    const notes = [
      ...(e.weight !== undefined ? [`weight ${e.weight}`] : []),
      ...(e.src ? [`src: ${e.src.join(", ")}`] : []),
    ];
    lines.push(`:${e.s} :${e.p} :${e.o} .${notes.length ? ` # ${notes.join(" · ")}` : ""}`);
  }

  lines.push("", "# graph committed");
  return lines.join("\n") + "\n";
}
