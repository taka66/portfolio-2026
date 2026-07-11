import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { EDGES, ENTITIES, LOG_LINES, NODES, STORIES } from "./ontology";
import { validateOntology } from "@/lib/jsonld";

describe("ontology integrity", () => {
  it("has no dangling references", () => {
    expect(validateOntology()).toEqual([]);
  });

  it("keeps the graph tier curated (30-46 nodes)", () => {
    expect(NODES.length).toBeGreaterThanOrEqual(30);
    // raised 45 → 46 for :vercel (2026-07: private apps deploy there — including this site)
    expect(NODES.length).toBeLessThanOrEqual(46);
  });

  it("every node is reachable from :fujii", () => {
    const adjacency = new Map<string, string[]>();
    for (const e of EDGES) {
      adjacency.set(e.s, [...(adjacency.get(e.s) ?? []), e.o]);
      adjacency.set(e.o, [...(adjacency.get(e.o) ?? []), e.s]);
    }
    const seen = new Set(["fujii"]);
    const queue = ["fujii"];
    while (queue.length) {
      for (const next of adjacency.get(queue.shift()!) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    const unreachable = NODES.filter((n) => !seen.has(n.id)).map((n) => n.id);
    expect(unreachable).toEqual([]);
  });

  it("every localized string has both ja and en", () => {
    for (const detail of Object.values(ENTITIES)) {
      expect(detail.title.ja.length).toBeGreaterThan(0);
      expect(detail.title.en.length).toBeGreaterThan(0);
      expect(detail.desc.ja.length).toBeGreaterThan(0);
      expect(detail.desc.en.length).toBeGreaterThan(0);
      for (const item of detail.items ?? []) {
        expect(item.label.ja.length).toBeGreaterThan(0);
        expect(item.label.en.length).toBeGreaterThan(0);
      }
    }
  });

  it("gallery images exist in public/", () => {
    for (const detail of Object.values(ENTITIES)) {
      for (const g of detail.gallery ?? []) {
        const file = path.join(__dirname, "../../public", g.src);
        expect(existsSync(file), `${g.src} missing`).toBe(true);
      }
    }
  });

  it("every story step replays a real edge", () => {
    for (const story of STORIES) {
      for (const st of story.steps) {
        expect(
          EDGES.some((e) => e.s === st.s && e.p === st.p && e.o === st.o),
          `${story.id}: ${st.s} ${st.p} ${st.o} is not an edge`
        ).toBe(true);
      }
    }
  });

  it("log lines reference real predicates and end with the commit comment", () => {
    const predicates = new Set(EDGES.map((e) => `:${e.p}`));
    predicates.add("a");
    for (const line of LOG_LINES) {
      if (!line.comment && line.p) expect(predicates.has(line.p), `unknown predicate ${line.p}`).toBe(true);
    }
    expect(LOG_LINES.at(-1)?.comment).toBe(true);
  });
});
