import type { L10n } from "@/i18n/config";

/**
 * The ontology is the single source of truth for the whole site:
 * the graph rendering, the entity detail panels, and the schema.org
 * structured data are all derived from this file.
 *
 * Two-tier model (see docs/tech-stack.md):
 * - Graph tier: ~30-40 curated NODES — entities worth clicking.
 * - Instance tier: individual talks / articles / illustrations live inside
 *   their parent entity's panel (`items`), never as graph nodes.
 */

export type NodeClass = "person" | "role" | "org" | "artifact" | "skill" | "domain" | "hobby";
export type QueryId = "career" | "craft" | "voice" | "life";

export interface OntologyNode {
  id: string;
  /** mono label rendered on the canvas, e.g. ":koiki.fm" */
  label: string;
  cls: NodeClass;
  queries: QueryId[];
  /** initial layout position, as a fraction of the field size */
  seed: [number, number];
}

export interface OntologyEdge {
  s: string;
  p: string;
  o: string;
}

export interface EntityMeta {
  p: string;
  v: string;
  href?: string;
}

export interface EntityItem {
  y: string;
  label: L10n;
  href?: string;
}

export interface EntityDetail {
  /** e.g. "a :Artifact · :Podcast" */
  type: string;
  title: L10n;
  desc: L10n;
  meta?: EntityMeta[];
  gallery?: { src: string; caption: L10n }[];
  items?: EntityItem[];
  rel?: string[];
}

export interface LogLine {
  s: string;
  p?: string;
  o?: string;
  ghosts?: string[];
  comment?: boolean;
}

// ============ graph tier ============

export const NODES: OntologyNode[] = [
  { id: "fujii", label: ":fujii", cls: "person", queries: ["career", "craft", "voice", "life"], seed: [0.44, 0.5] },
  // career
  { id: "cto", label: ":CTO", cls: "role", queries: ["career"], seed: [0.58, 0.3] },
  { id: "svp", label: ":SVP", cls: "role", queries: ["career"], seed: [0.64, 0.34] },
  { id: "vpoe", label: ":VPoE", cls: "role", queries: ["career"], seed: [0.72, 0.42] },
  { id: "engineer", label: ":Engineer", cls: "role", queries: ["career"], seed: [0.78, 0.54] },
  { id: "wealthpark", label: ":wealthpark", cls: "org", queries: ["career"], seed: [0.62, 0.16] },
  { id: "rakuten", label: ":rakuten", cls: "org", queries: ["career"], seed: [0.88, 0.62] },
  { id: "goodpatch", label: ":designers-gym", cls: "org", queries: ["career", "craft"], seed: [0.9, 0.4] },
  { id: "afc", label: ":afc", cls: "org", queries: ["career", "voice"], seed: [0.54, 0.78] },
  { id: "realestate", label: ":real-estate", cls: "domain", queries: ["career"], seed: [0.5, 0.1] },
  { id: "fintech", label: ":fintech", cls: "domain", queries: ["career"], seed: [0.74, 0.08] },
  { id: "travel", label: ":travel", cls: "domain", queries: ["career"], seed: [0.94, 0.74] },
  // craft
  { id: "uiux", label: ":ui-ux", cls: "domain", queries: ["craft"], seed: [0.28, 0.66] },
  { id: "llm", label: ":llm", cls: "skill", queries: ["craft", "voice"], seed: [0.4, 0.22] },
  { id: "typescript", label: ":typescript", cls: "skill", queries: ["craft"], seed: [0.2, 0.42] },
  { id: "go", label: ":go", cls: "skill", queries: ["craft"], seed: [0.14, 0.54] },
  { id: "python", label: ":python", cls: "skill", queries: ["craft"], seed: [0.1, 0.44] },
  { id: "java", label: ":java", cls: "skill", queries: ["craft"], seed: [0.17, 0.33] },
  { id: "react", label: ":react", cls: "skill", queries: ["craft"], seed: [0.22, 0.3] },
  { id: "aws", label: ":aws", cls: "skill", queries: ["craft"], seed: [0.12, 0.66] },
  { id: "figma", label: ":figma", cls: "skill", queries: ["craft"], seed: [0.3, 0.78] },
  { id: "budgeting", label: ":budgeting", cls: "skill", queries: ["career"], seed: [0.56, 0.64] },
  { id: "hiring", label: ":hiring", cls: "skill", queries: ["career"], seed: [0.66, 0.72] },
  { id: "illustration", label: ":illustration", cls: "artifact", queries: ["craft", "life"], seed: [0.34, 0.88] },
  // voice
  { id: "koiki", label: ":koiki.fm", cls: "artifact", queries: ["voice"], seed: [0.32, 0.12] },
  { id: "talks", label: ":talks", cls: "artifact", queries: ["voice"], seed: [0.24, 0.2] },
  { id: "seminars", label: ":ai-seminars", cls: "artifact", queries: ["voice"], seed: [0.3, 0.28] },
  { id: "reviews", label: ":book-reviews", cls: "artifact", queries: ["voice"], seed: [0.16, 0.14] },
  { id: "note", label: ":note", cls: "artifact", queries: ["voice", "life"], seed: [0.14, 0.26] },
  { id: "engmgmt", label: ":eng-management", cls: "domain", queries: ["voice", "career"], seed: [0.42, 0.34] },
  // life
  { id: "basketball", label: ":basketball", cls: "hobby", queries: ["life"], seed: [0.52, 0.9] },
  { id: "cooking", label: ":cooking", cls: "hobby", queries: ["life"], seed: [0.44, 0.94] },
  { id: "coffee", label: ":coffee", cls: "hobby", queries: ["life"], seed: [0.62, 0.92] },
];

export const EDGES: OntologyEdge[] = [
  { s: "fujii", p: "holdsRole", o: "cto" },
  { s: "fujii", p: "heldRole", o: "svp" },
  { s: "fujii", p: "heldRole", o: "vpoe" },
  { s: "fujii", p: "heldRole", o: "engineer" },
  { s: "cto", p: "at", o: "wealthpark" },
  { s: "svp", p: "at", o: "wealthpark" },
  { s: "vpoe", p: "at", o: "wealthpark" },
  { s: "engineer", p: "at", o: "rakuten" },
  { s: "fujii", p: "trainedAt", o: "goodpatch" },
  { s: "fujii", p: "taught", o: "afc" },
  { s: "wealthpark", p: "inDomain", o: "realestate" },
  { s: "wealthpark", p: "inDomain", o: "fintech" },
  { s: "rakuten", p: "inDomain", o: "travel" },
  { s: "afc", p: "about", o: "uiux" },
  { s: "fujii", p: "coHosts", o: "koiki" },
  { s: "koiki", p: "about", o: "engmgmt" },
  { s: "fujii", p: "speaksAt", o: "talks" },
  { s: "talks", p: "about", o: "engmgmt" },
  { s: "fujii", p: "speaksAt", o: "seminars" },
  { s: "seminars", p: "about", o: "llm" },
  { s: "seminars", p: "for", o: "realestate" },
  { s: "fujii", p: "reviewed", o: "reviews" },
  { s: "reviews", p: "about", o: "engmgmt" },
  { s: "fujii", p: "writes", o: "note" },
  { s: "fujii", p: "designs", o: "uiux" },
  { s: "uiux", p: "with", o: "figma" },
  { s: "fujii", p: "codesIn", o: "typescript" },
  { s: "fujii", p: "codesIn", o: "go" },
  { s: "fujii", p: "codesIn", o: "python" },
  { s: "fujii", p: "codesIn", o: "java" },
  { s: "fujii", p: "uses", o: "react" },
  { s: "fujii", p: "runsOn", o: "aws" },
  { s: "fujii", p: "appliesTo", o: "llm" },
  { s: "fujii", p: "practices", o: "budgeting" },
  { s: "fujii", p: "practices", o: "hiring" },
  { s: "fujii", p: "draws", o: "illustration" },
  { s: "illustration", p: "brands", o: "koiki" },
  { s: "illustration", p: "for", o: "basketball" },
  { s: "fujii", p: "plays", o: "basketball" },
  { s: "fujii", p: "cooks", o: "cooking" },
  { s: "fujii", p: "drinks", o: "coffee" },
];

// ============ instance tier (detail panels) ============

export const ENTITIES: Record<string, EntityDetail> = {
  fujii: {
    type: "a foaf:Person · :ProductEngineer",
    title: { ja: "藤井 貴浩", en: "Takahiro Fujii" },
    desc: {
      ja: "プロダクトエンジニア、デザイナー、CTO。設計と実装、組織とロードマップ。すべての辺はこのノードから始まります。",
      en: "Product engineer, designer, CTO. Architecture and implementation, organizations and roadmaps. Every edge starts here.",
    },
    meta: [
      { p: ":base", v: "Tokyo, JP" },
      { p: ":x", v: "x.com/taka_ft ↗", href: "https://x.com/taka_ft" },
      { p: ":linkedin", v: "linkedin ↗", href: "https://www.linkedin.com/in/takahiro-fujii-221a7461/" },
      { p: ":note", v: "note.com/takahirofujii ↗", href: "https://note.com/takahirofujii" },
    ],
    rel: ["cto", "koiki", "illustration", "note"],
  },
  wealthpark: {
    type: "a :Organization",
    title: { ja: "WealthPark", en: "WealthPark" },
    desc: {
      ja: "不動産×FinTech。2020年4月にVPoEとしてジョインし、SVPを経て2024年4月からCTO。プロダクト開発、PdM、SRE、セキュリティ、QA、PMOを含む多国籍エンジニアリング組織を構築。",
      en: "Real estate × fintech. Joined April 2020 as VPoE, then SVP, CTO since April 2024. Built a multinational engineering org covering product, PdM, SRE, security, QA and PMO.",
    },
    meta: [
      { p: ":since", v: "2020.04" },
      { p: ":domain", v: ":real-estate, :fintech" },
      { p: ":roles", v: ":VPoE → :SVP → :CTO" },
    ],
    items: [
      { y: "2023", label: { ja: "WealthPark Engineering Blog 開設", en: "Launched WealthPark Engineering Blog" }, href: "https://medium.com/wealthpark-engineering" },
      { y: "2022", label: { ja: "Remote Trust — RSGT2022(Matteo Carellaと共同登壇)", en: "Remote Trust — RSGT2022 (with Matteo Carella)" } },
      { y: "2021", label: { ja: "VPが語る、WealthParkのプロダクト、技術、組織(Wantedly)", en: "WealthPark's Product VPs talk (Wantedly)" } },
    ],
    rel: ["cto", "svp", "vpoe", "realestate", "fintech"],
  },
  rakuten: {
    type: "a :Organization",
    title: { ja: "楽天(楽天トラベル)", en: "Rakuten (Travel)" },
    desc: {
      ja: "キャリアの起点。海外ホテル予約システム、管理画面、会計システム、外部連携の開発。20名超のフロントエンド組織でreactの大規模プロダクトをリード。",
      en: "Where it started: booking systems, admin tools, accounting, integrations. Led a 20+ engineer React frontend at scale.",
    },
    meta: [
      { p: ":period", v: "—2020" },
      { p: ":domain", v: ":travel" },
    ],
    items: [
      { y: "2019", label: { ja: "Large react product with 20+ FE engineers(React Tokyo Plus)", en: "Large react product with 20+ FE engineers (React Tokyo Plus)" } },
      { y: "2019", label: { ja: "楽天トラベルのフロントエンドについて(React Meetup)", en: "Rakuten Travel frontend (React Meetup)" } },
      { y: "2017", label: { ja: "FrontEndからみるmicroservice(Microservice Meetup Vol.6)", en: "Microservice from the frontend (Microservice Meetup Vol.6)" } },
      { y: "2016", label: { ja: "楽天トラベルとSpring(Spring Day 2016)", en: "Rakuten Travel and Spring (Spring Day 2016)" } },
    ],
    rel: ["engineer", "travel", "react"],
  },
  goodpatch: {
    type: "a :Organization · :School",
    title: { ja: "Designers Gym(Goodpatch)", en: "Designers Gym (Goodpatch)" },
    desc: {
      ja: "デザインの体系的なトレーニング。エンジニアが「デザイナー」を名乗れるようになった場所のひとつ。",
      en: 'Formal design training — one of the places where an engineer earned the right to say "designer".',
    },
    meta: [
      { p: ":kind", v: "design program" },
      { p: ":period", v: "2019.04 – 2019.09" },
    ],
    rel: ["uiux", "illustration"],
  },
  afc: {
    type: "a :Organization · :College",
    title: { ja: "青山ファッションカレッジ", en: "Aoyama Fashion College" },
    desc: {
      ja: "Web制作の講師(2023年度)。ファッションを学ぶ学生に、デザインとテクノロジーの交差点を教えました。",
      en: "Taught web production (AY2023) — where design meets technology, for fashion students.",
    },
    meta: [
      { p: ":subject", v: "Web制作 / web production" },
      { p: ":year", v: "AY2023" },
    ],
    rel: ["uiux", "illustration"],
  },
  koiki: {
    type: "a :Artifact · :Podcast",
    title: { ja: "小粋fm(Koiki.fm)", en: "Koiki.fm" },
    desc: {
      ja: "エンジニアリングマネージャーのためのポッドキャスト。キャリア、組織、マネジメントの機微を話す。ロゴも自作(→ :illustration)。",
      en: "A podcast for engineering managers — careers, orgs, and the craft. Logo drawn by the host (→ :illustration).",
    },
    meta: [
      { p: ":since", v: "2020" },
      { p: ":co-host", v: ":fujii" },
      { p: ":listen", v: "koiki.fm ↗", href: "https://koiki.fm" },
    ],
    items: [{ y: "—", label: { ja: "note マガジン「小粋fm」(7本)", en: 'note magazine "Koiki fm" (7 posts)' } }],
    rel: ["engmgmt", "illustration", "note"],
  },
  talks: {
    type: "a :Artifact · :TalkSeries",
    title: { ja: "講演・登壇", en: "Talks" },
    desc: {
      ja: "カンファレンス、meetup、大学講義まで。組織、フロントエンド、アジャイル、キャリア。",
      en: "Conferences, meetups, university lectures — orgs, frontend, agile, careers.",
    },
    meta: [
      { p: ":count", v: "10+" },
      { p: ":languages", v: "ja / en" },
    ],
    items: [
      { y: "2022", label: { ja: "Remote Trust — RSGT2022(w/ Matteo Carella)", en: "Remote Trust — RSGT2022 (w/ Matteo Carella)" } },
      { y: "2022", label: { ja: "What do we want to know through coding assessment", en: "What do we want to know through coding assessment" } },
      { y: "2021", label: { ja: "SquadにおけるPO/PdMとエンジニアの協業", en: "PO/PdM × engineer collaboration in Squads" } },
      { y: "2019", label: { ja: "Large react product with 20+ FE engineers(React Tokyo Plus)", en: "Large react product with 20+ FE engineers" } },
      { y: "2019", label: { ja: "楽天トラベルのフロントエンド(React Meetup)", en: "Rakuten Travel frontend (React Meetup)" } },
      { y: "2018", label: { ja: "東京理科大学 講演「グローバルな環境におけるエンジニアのキャリア形成」", en: "Tokyo Univ. of Science — engineering careers in global orgs" } },
      { y: "2018", label: { ja: "東京理科大学 寄稿「好きなことを仕事にする」(科学フォーラム)", en: 'TUS essay: "Making what you love your work"' } },
      { y: "2017", label: { ja: "Microservice Meetup Vol.6", en: "Microservice Meetup Vol.6" } },
      { y: "2016", label: { ja: "楽天トラベルとSpring(Spring Day 2016)", en: "Rakuten Travel and Spring (Spring Day 2016)" } },
      { y: "2016", label: { ja: "Spring Rest Docsの活用(JSUG)", en: "Spring REST Docs (JSUG)" } },
    ],
    rel: ["engmgmt", "react", "rakuten", "wealthpark"],
  },
  seminars: {
    type: "a :Artifact · :SeminarSeries",
    title: { ja: "AIセミナー", en: "AI Seminars" },
    desc: {
      ja: "「AIは難しくない」— 不動産事業者・ビジネス職向けのLLM入門。仕組み、使い方、セキュリティまで。",
      en: '"AI is not difficult" — LLM intros for real-estate operators and business teams: how it works, how to use it, how to keep it safe.',
    },
    meta: [
      { p: ":since", v: "2023" },
      { p: ":audience", v: ":real-estate, business" },
    ],
    items: [
      { y: "2025", label: { ja: "生成AIを活用した不動産業務の効率化(IT・シェアリング促進事業者協会)", en: "GenAI for real-estate ops efficiency" } },
      { y: "2023", label: { ja: "ベネフィット・ステーション利用者向けChatGPT入門", en: "Intro to ChatGPT for Benefit Station users" } },
      { y: "2023", label: { ja: "ChatGPT入門!仕組み・使い方・セキュリティ", en: "ChatGPT: mechanics, usage, security" } },
    ],
    rel: ["llm", "realestate"],
  },
  reviews: {
    type: "a :Artifact · :ReviewWork",
    title: { ja: "技術書 翻訳レビュー", en: "Book Translation Reviews" },
    desc: {
      ja: "技術書の翻訳レビューに参加。読み手として最初に「日本語で読める」を検品する仕事。",
      en: "Reviewing Japanese translations of engineering books — the first reader who checks it truly reads.",
    },
    meta: [{ p: ":year", v: "2024" }],
    items: [
      { y: "2024", label: { ja: "『スタッフエンジニアの道』", en: "The Staff Engineer's Path" } },
      { y: "2024", label: { ja: "『ソフトウェアアーキテクトのための意思決定術』", en: "Software Architecture and Decision-Making" } },
    ],
    rel: ["engmgmt", "note"],
  },
  note: {
    type: "a :Artifact · :Blog",
    title: { ja: "note", en: "note (blog)" },
    desc: {
      ja: "キャリア、組織、本、そして「ご機嫌でいる技術」。文章での発信のアーカイブ。",
      en: 'Careers, orgs, books, and "the art of staying in a good mood". The written archive.',
    },
    meta: [{ p: ":url", v: "note.com/takahirofujii ↗", href: "https://note.com/takahirofujii" }],
    items: [
      { y: "2024", label: { ja: "STARTUP CTO NIGHT & DAY 2025に参加して", en: "STARTUP CTO NIGHT & DAY 2025" } },
      { y: "2024", label: { ja: "ポートフォリオサイトをCursorで作り直してみた所感", en: "Rebuilding this site with Cursor" } },
      { y: "2024", label: { ja: "ご機嫌でいる技術", en: "The art of staying in a good mood" } },
      { y: "2023", label: { ja: "WealthPark CTO就任によせて", en: "On becoming CTO of WealthPark" } },
      { y: "2023", label: { ja: "教養としての「会計」入門", en: "Accounting as a liberal art" } },
      { y: "—", label: { ja: "旧ブログ: Spotify Modelの虚像と実像 / VPoEとしての最初の取組 ほか", en: "Older: Spotify Model myths / First moves as VPoE, etc." } },
    ],
    rel: ["engmgmt", "koiki"],
  },
  illustration: {
    type: "a :Artifact · :DesignWork",
    title: { ja: "イラスト & デザインワーク", en: "Illustration & Design Works" },
    desc: {
      ja: "自画像、あじさい、富士山。小粋fmのロゴ、Lineスタンプ、名刺、バスケットボールのユニフォームまで。描くことはデザインの目の筋トレ。",
      en: "Self-portraits, hydrangeas, Mt. Fuji. The Koiki.fm logo, Line stickers, business cards, basketball uniforms. Drawing keeps the design eye sharp.",
    },
    meta: [
      { p: ":tool", v: "iPad, Figma" },
      { p: ":count", v: "16" },
    ],
    gallery: [
      { src: "/design/fuji.webp", caption: { ja: "富士山 — 名前にも入っているFuji", en: "Mt. Fuji — it is in the name" } },
      { src: "/design/koikifm.webp", caption: { ja: "小粋fm ロゴ", en: "Koiki.fm logo" } },
      { src: "/design/fujii.webp", caption: { ja: "自画像", en: "Self-portrait" } },
      { src: "/design/hydrangea.webp", caption: { ja: "あじさい", en: "Hydrangea" } },
      { src: "/design/hydrangea_border.webp", caption: { ja: "あじさい(縁)", en: "Hydrangea (border)" } },
      { src: "/design/dan.webp", caption: { ja: "タコスボーイ", en: "Taco boy" } },
      { src: "/design/boss.webp", caption: { ja: "Boss", en: "Boss" } },
      { src: "/design/engineer.webp", caption: { ja: "とあるエンジニア", en: "A certain engineer" } },
      { src: "/design/lady.webp", caption: { ja: "Lady", en: "Lady" } },
      { src: "/design/movie_director.webp", caption: { ja: "映画監督", en: "A film director" } },
      { src: "/design/nabnab.png", caption: { ja: "Lineスタンプ(Web Engineer)", en: "Line stickers for web engineers" } },
      { src: "/design/tokyoflower.png", caption: { ja: "東京笑花 ロゴ", en: "Tokyo-Shoka logo" } },
      { src: "/design/webhack.png", caption: { ja: "Speaker Card", en: "Speaker card" } },
      { src: "/design/winx.png", caption: { ja: "バスケユニフォーム(WINX)", en: "Basketball uniform (WINX)" } },
      { src: "/design/superpoints.png", caption: { ja: "バスケユニフォーム(SUPERPOINTS)", en: "Basketball uniform (SUPERPOINTS)" } },
      { src: "/design/business-card.png", caption: { ja: "名刺", en: "Business cards" } },
    ],
    rel: ["koiki", "basketball", "uiux"],
  },
  uiux: {
    type: "a :Domain",
    title: { ja: "UI / UX", en: "UI / UX" },
    desc: {
      ja: "2017年からの専門領域。エンジニアであり、デザイナーでもある理由。青山ファッションカレッジで教えたテーマ。",
      en: 'The specialty since 2017 — why both "engineer" and "designer" are true. Also what got taught at AFC.',
    },
    meta: [{ p: ":since", v: "2017" }],
    rel: ["figma", "afc", "goodpatch"],
  },
  llm: {
    type: "a :Skill",
    title: { ja: "LLM", en: "LLM" },
    desc: {
      ja: "プロダクトにも、組織にも、セミナーにも。現在の主戦場。(最新の取り組みはこのオントロジーに追記予定)",
      en: "In the product, in the org, on stage. The current frontier. (Latest work to be appended to this ontology.)",
    },
    meta: [{ p: ":status", v: "active" }],
    rel: ["seminars", "wealthpark"],
  },
  basketball: {
    type: "a :Hobby",
    title: { ja: "バスケットボール", en: "Basketball" },
    desc: {
      ja: "コートの上では肩書きは消えます。チームのユニフォームは自分でデザイン(→ :illustration)。",
      en: "Titles disappear on the court. Team uniforms: designed by the player (→ :illustration).",
    },
    rel: ["illustration"],
  },
  cooking: {
    type: "a :Hobby",
    title: { ja: "料理", en: "Cooking" },
    desc: {
      ja: "日本酒とコーヒーと料理。設計と同じで、素材と手順がすべて。",
      en: "Sake, coffee, cooking. Like engineering: ingredients and process.",
    },
    rel: ["coffee"],
  },
};

/** short hover sentences for nodes without a full panel */
export const SENTENCES: Record<string, L10n> = {
  cto: { ja: "2024年4月からWealthParkの<b>CTO</b>。", en: "<b>CTO</b> at WealthPark since April 2024." },
  svp: { ja: "<b>SVP</b>(2023.03–2024.04)— VPoEとCTOの間の一年。", en: "<b>SVP</b> (2023.03–2024.04) — the year between VPoE and CTO." },
  vpoe: { ja: "<b>VPoE</b>(2020.04–2023.03)として多国籍組織を構築。", en: "Built a multinational org as <b>VPoE</b> (2020.04–2023.03)." },
  engineer: { ja: "起点はフルスタック<b>エンジニア</b>(楽天トラベル)。", en: "Started as a full-stack <b>engineer</b> at Rakuten Travel." },
};

export const DEFAULT_FOCUS: L10n = {
  ja: "ノードに触れると翻訳、クリックで詳細。全体像は「プロフィール全文」からどうぞ。",
  en: "Hover to translate a triple; click for details — or read the full profile.",
};

/** localized UI strings (everything visible outside the ontology data itself) */
export const UI = {
  rolesLine: { ja: "プロダクトエンジニア / CTO", en: "product engineer / cto" },
  profileButton: { ja: "プロフィール全文を読む", en: "Read the full profile" },
  profileTitle: { ja: "プロフィール", en: "Profile" },
  profileType: { ja: "オントロジーから生成", en: "derived from the ontology" },
  focusLabel: { ja: "FOCUS", en: "FOCUS" },
  headTriples: { ja: "トリプル", en: "TRIPLES" },
  headGallery: { ja: "ギャラリー", en: "GALLERY" },
  headInstances: { ja: "インスタンス", en: "INSTANCES" },
  headRelated: { ja: "関連", en: "RELATED" },
  legend: {
    ja: "● 人物 / 役職 ■ 組織 ▲ 制作物|◆ スキル ○ 領域 · 趣味",
    en: "● person / role ■ org ▲ artifact|◆ skill ○ domain · hobby",
  },
  close: { ja: "閉じる", en: "close" },
} satisfies Record<string, L10n>;

/** the full-profile document: a curated linear walk through the graph */
export const PROFILE_SECTIONS: { title: L10n; entityIds: string[] }[] = [
  { title: { ja: "経歴", en: "Career" }, entityIds: ["wealthpark", "rakuten", "goodpatch", "afc"] },
  { title: { ja: "発信", en: "Voice" }, entityIds: ["koiki", "talks", "seminars", "reviews", "note"] },
  { title: { ja: "制作", en: "Craft" }, entityIds: ["uiux", "illustration", "llm"] },
  { title: { ja: "生活", en: "Life" }, entityIds: ["basketball", "cooking"] },
];

// ============ opening parse log ============

export const LOG_LINES: LogLine[] = [
  { s: ":fujii", p: "a", o: "foaf:Person, :ProductEngineer", ghosts: [":Designer", ":CTO"] },
  { s: ":fujii", p: ":holdsRole", o: ":CTO", ghosts: [":SVP", ":VPoE"] },
  { s: ":CTO", p: ":at", o: ":wealthpark" },
  { s: ":fujii", p: ":taught", o: ":afc", ghosts: [":web制作"] },
  { s: ":fujii", p: ":coHosts", o: ":koiki.fm", ghosts: [":podcast"] },
  { s: ":fujii", p: ":speaksAt", o: ":talks, :ai-seminars", ghosts: [":rsgt2022"] },
  { s: ":fujii", p: ":reviewed", o: ":book-reviews", ghosts: [":staff-eng-path"] },
  { s: ":fujii", p: ":writes", o: ":note", ghosts: [":ご機嫌でいる技術"] },
  { s: ":fujii", p: ":draws", o: ":illustration", ghosts: [":mt-fuji"] },
  { s: ":illustration", p: ":brands", o: ":koiki.fm" },
  { s: ":illustration", p: ":for", o: ":basketball", ghosts: [":uniforms"] },
  { s: ":fujii", p: ":codesIn", o: ":typescript, :go, :python, :java" },
  { s: "# graph committed", comment: true },
];

export const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
