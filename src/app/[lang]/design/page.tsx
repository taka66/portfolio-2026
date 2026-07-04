import type { Metadata } from "next";
import Image from "next/image";
import { TopNav } from "@/components/TopNav";
import { ENTITIES, UI } from "@/data/ontology";
import { designGallery } from "@/lib/queries";
import { toLocale } from "@/i18n/config";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = toLocale((await props.params).lang);
  return {
    title: "Design",
    alternates: {
      canonical: lang === "ja" ? "/design" : "/en/design",
      languages: { ja: "/design", en: "/en/design" },
    },
  };
}

export default async function DesignPage(props: { params: Promise<{ lang: string }> }) {
  const lang = toLocale((await props.params).lang);
  const gallery = designGallery();
  const tool = ENTITIES.illustration.meta?.find((m) => m.p === ":tool")?.v ?? "";

  return (
    <div className="qshell">
      <TopNav lang={lang} active="design" path="/design" />
      <main className="qpage">
        <div className="qhead">
          <div>
            <span className="c"># saved query</span>
          </div>
          <div>
            <span className="q">?design</span> = SELECT ?work WHERE {"{"} :fujii <span className="q">:draws</span>{" "}
            :illustration . ?work <span className="q">:partOf</span> :illustration . {"}"}
          </div>
          <div className="qresult">
            → <b data-testid="design-count">{gallery.length}</b> works · :tool <span className="v">{tool}</span>
          </div>
        </div>

        <h1 className="qtitle hum">Design</h1>
        <p className="qsub hum">{UI.designSub[lang]}</p>

        <div className="qgrid">
          {gallery.map((g) => (
            <figure key={g.src}>
              <Image src={g.src} alt={g.caption[lang]} width={400} height={400} />
              <figcaption>
                {g.caption[lang]}
                <span className="u">:partOf :illustration</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
    </div>
  );
}
