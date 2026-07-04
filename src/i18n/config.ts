export const i18n = {
  defaultLocale: "ja",
  locales: ["ja", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

/** Next's typed routes hand params over as plain strings — narrow safely. */
export function toLocale(value: string): Locale {
  return (i18n.locales as readonly string[]).includes(value) ? (value as Locale) : i18n.defaultLocale;
}

export interface L10n {
  ja: string;
  en: string;
}
