import { ENTITIES, type EntityItem } from "@/data/ontology";

/**
 * "Saved queries" — the derivations behind /works and /design.
 * Pages are views over the ontology; nothing here is hand-maintained.
 */

export const WORK_SOURCES = ["talks", "seminars", "reviews", "note", "koiki", "wealthpark"] as const;
export type WorkSource = (typeof WORK_SOURCES)[number];

export interface WorkRow extends EntityItem {
  source: WorkSource;
}

/** flatten every artifact's instances, newest first (undated rows sink) */
export function worksRows(): WorkRow[] {
  const rows: WorkRow[] = [];
  for (const source of WORK_SOURCES) {
    for (const item of ENTITIES[source].items ?? []) {
      rows.push({ ...item, source });
    }
  }
  const key = (y: string) => (y === "—" ? "0000" : y);
  return rows.sort((a, b) => key(b.y).localeCompare(key(a.y)));
}

export function designGallery() {
  return ENTITIES.illustration.gallery ?? [];
}
