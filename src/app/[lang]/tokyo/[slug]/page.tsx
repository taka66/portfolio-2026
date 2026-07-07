import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { TOKYO_ARTICLES, tokyoArticleBySlug } from "@/data/tokyo";
import { i18n, toLocale } from "@/i18n/config";

/**
 * Hidden feature: the three "tokyo as a local" articles (2016), reachable
 * only from the :tokyo-as-a-local entity panel. Not in the nav, not in the
 * sitemap, and noindex — a quiet back room of the site.
 */

export function generateStaticParams() {
  return i18n.locales.flatMap((lang) => TOKYO_ARTICLES.map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata(props: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const article = tokyoArticleBySlug[slug];
  return {
    title: article ? `${article.title} | tokyo as a local` : "tokyo as a local",
    robots: { index: false, follow: false },
  };
}

export default async function TokyoArticlePage(props: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await props.params;
  const lang = toLocale(rawLang);
  const article = tokyoArticleBySlug[slug];
  if (!article) notFound();

  const prefix = lang === "ja" ? "" : "/en";
  const others = TOKYO_ARTICLES.filter((a) => a.slug !== slug);

  return (
    <div className="qshell">
      <TopNav lang={lang} path={`/tokyo/${slug}`} />
      <main className="qpage taal">
        <div className="qhead">
          <div>
            <span className="c"># archived page · tokyo as a local (2016) · :lang en</span>
          </div>
          {lang === "ja" && (
            <div>
              <span className="c"># 原文は英語です。この日本語はAIによる自動翻訳です</span>
            </div>
          )}
          <div>
            :fujii <span className="q">:made</span> :tokyo-as-a-local . :article-{article.no}{" "}
            <span className="q">:partOf</span> :tokyo-as-a-local .
          </div>
        </div>

        <div className="taal-kind">{article.kind[lang]}</div>
        <h1 className="qtitle">{article.title}</h1>
        <div className="taal-area">{article.area} · TOKYO</div>

        <div className="taal-meta">
          {article.meta.map((m) => (
            <div className="t-row" key={m.p}>
              <span className="tp">{m.p}</span>
              <span className="tv">
                {m.href ? (
                  <a href={m.href} target="_blank" rel="noopener noreferrer">
                    {m.v[lang]}
                  </a>
                ) : (
                  m.v[lang]
                )}
              </span>
            </div>
          ))}
        </div>

        <article className="taal-body hum">
          {article.blocks.map((b, i) =>
            "img" in b ? (
              <figure key={i}>
                <Image src={b.img} alt={b.alt} width={1200} height={800} />
              </figure>
            ) : "h" in b ? (
              <h2 key={i}>{b.h[lang]}</h2>
            ) : (
              <p key={i}>{b.text[lang]}</p>
            )
          )}

          {article.notes && (
            <div className="taal-notes">
              {article.notes.map((n) => (
                <p key={n.en}>(NOTE) {n[lang]}</p>
              ))}
            </div>
          )}

          <p className="taal-sign">TAKA.</p>
        </article>

        <div className="taal-foot">
          <div className="c"># all photos taken by :fujii</div>
          <div className="taal-others">
            {others.map((a) => (
              <Link key={a.slug} href={`${prefix}/tokyo/${a.slug}`}>
                :article-{a.no} {a.title} →
              </Link>
            ))}
            <Link href={`${prefix || "/"}?e=tokyolocal`}>
              {lang === "ja" ? ":tokyo-as-a-local をグラフで開く ↗" : "open :tokyo-as-a-local in the graph ↗"}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
