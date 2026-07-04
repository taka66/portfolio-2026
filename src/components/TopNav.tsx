import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface TopNavProps {
  lang: Locale;
  active: "works" | "design";
  /** locale-less path of the current page, e.g. "/works" */
  path: string;
}

export function TopNav({ lang, active, path }: TopNavProps) {
  const prefix = lang === "ja" ? "" : "/en";

  return (
    <div className="top">
      <span className="brand">
        takahirofujii.dev — <b>ontology.ttl</b>
      </span>
      <nav>
        <Link href={prefix || "/"}>:fujii</Link>
        <Link href={`${prefix}/works`} className={active === "works" ? "on" : ""}>
          ?works
        </Link>
        <Link href={`${prefix}/design`} className={active === "design" ? "on" : ""}>
          ?design
        </Link>
      </nav>
      <span className="lang">
        {/* Plain <a>: locale switching must be a full page load (see Stage.tsx) */}
        {lang === "ja" ? <a className="on">あ</a> : <a href={path} hrefLang="ja" lang="ja">あ</a>}
        {" / "}
        {lang === "en" ? <a className="on">A</a> : <a href={`/en${path}`} hrefLang="en" lang="en">A</a>}
      </span>
    </div>
  );
}
