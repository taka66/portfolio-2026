import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { i18n, toLocale } from "@/i18n/config";
import { buildPersonJsonLd } from "@/lib/jsonld";
import "../globals.css";

const plexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = toLocale((await props.params).lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Takahiro Fujii",
      template: "%s | Takahiro Fujii",
    },
    description:
      lang === "ja"
        ? "藤井貴浩 — プロダクトエンジニア / デザイナー / CTO。知識グラフとして表現したポートフォリオ。"
        : "Takahiro Fujii — product engineer / designer / CTO. A portfolio expressed as a knowledge graph.",
    alternates: {
      canonical: lang === "ja" ? "/" : `/${lang}`,
      languages: { ja: "/", en: "/en" },
    },
    openGraph: {
      title: "Takahiro Fujii",
      siteName: "Takahiro Fujii",
      locale: lang === "ja" ? "ja_JP" : "en_US",
      alternateLocale: lang === "ja" ? "en_US" : "ja_JP",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const lang = toLocale((await params).lang);
  const jsonLd = buildPersonJsonLd(lang, SITE_URL);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${plexMono.variable} ${inter.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
