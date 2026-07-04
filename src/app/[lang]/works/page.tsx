import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import { WorksView } from "@/components/WorksView";
import { toLocale } from "@/i18n/config";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = toLocale((await props.params).lang);
  return {
    title: "Works",
    alternates: {
      canonical: lang === "ja" ? "/works" : "/en/works",
      languages: { ja: "/works", en: "/en/works" },
    },
  };
}

export default async function WorksPage(props: { params: Promise<{ lang: string }> }) {
  const lang = toLocale((await props.params).lang);
  return (
    <div className="qshell">
      <TopNav lang={lang} active="works" path="/works" />
      <WorksView lang={lang} />
    </div>
  );
}
