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
  /** 0-1; weak/tentative relations render thin and dashed (default 1) */
  weight?: number;
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
  { id: "english", label: ":english", cls: "skill", queries: ["career", "voice"], seed: [0.6, 0.52] },
  { id: "budgeting", label: ":budgeting", cls: "skill", queries: ["career"], seed: [0.56, 0.64] },
  { id: "hiring", label: ":hiring", cls: "skill", queries: ["career"], seed: [0.66, 0.72] },
  { id: "illustration", label: ":illustration", cls: "artifact", queries: ["craft", "life"], seed: [0.34, 0.88] },
  // voice
  { id: "koiki", label: ":koiki.fm", cls: "artifact", queries: ["voice"], seed: [0.32, 0.12] },
  { id: "talks", label: ":talks", cls: "artifact", queries: ["voice"], seed: [0.24, 0.2] },
  { id: "seminars", label: ":ai-seminars", cls: "artifact", queries: ["voice"], seed: [0.3, 0.28] },
  { id: "reviews", label: ":book-reviews", cls: "artifact", queries: ["voice"], seed: [0.16, 0.14] },
  { id: "note", label: ":note", cls: "artifact", queries: ["voice", "life"], seed: [0.14, 0.26] },
  { id: "designeer", label: ":desi-gneer", cls: "artifact", queries: ["voice", "craft"], seed: [0.06, 0.36] },
  { id: "engmgmt", label: ":eng-management", cls: "domain", queries: ["voice", "career"], seed: [0.42, 0.34] },
  // life
  { id: "tokyo", label: ":tokyo", cls: "domain", queries: ["life"], seed: [0.58, 0.8] },
  { id: "origins", label: ":origins", cls: "domain", queries: ["life", "craft"], seed: [0.8, 0.94] },
  { id: "tokyolocal", label: ":tokyo-as-a-local", cls: "artifact", queries: ["life", "craft"], seed: [0.72, 0.84] },
  { id: "koikiteam", label: ":koiki-team", cls: "org", queries: ["craft", "life"], seed: [0.22, 0.08] },
  { id: "basketball", label: ":basketball", cls: "hobby", queries: ["life"], seed: [0.52, 0.9] },
  { id: "cooking", label: ":cooking", cls: "hobby", queries: ["life"], seed: [0.44, 0.94] },
  { id: "sake", label: ":sake", cls: "hobby", queries: ["life"], seed: [0.48, 0.86] },
  { id: "washoku", label: ":washoku", cls: "hobby", queries: ["life"], seed: [0.38, 0.84] },
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
  { s: "fujii", p: "wrote", o: "designeer" },
  { s: "designeer", p: "about", o: "java" },
  { s: "designeer", p: "about", o: "travel", weight: 0.35 },
  { s: "fujii", p: "designs", o: "uiux" },
  { s: "uiux", p: "with", o: "figma" },
  { s: "fujii", p: "codesIn", o: "typescript" },
  { s: "fujii", p: "codesIn", o: "go" },
  { s: "fujii", p: "codesIn", o: "python" },
  { s: "fujii", p: "codesIn", o: "java" },
  { s: "fujii", p: "uses", o: "react" },
  { s: "fujii", p: "runsOn", o: "aws" },
  { s: "fujii", p: "appliesTo", o: "llm" },
  { s: "fujii", p: "speaks", o: "english" },
  { s: "english", p: "fueled", o: "vpoe", weight: 0.7 },
  { s: "fujii", p: "practices", o: "budgeting" },
  { s: "fujii", p: "practices", o: "hiring" },
  { s: "fujii", p: "draws", o: "illustration" },
  { s: "illustration", p: "brands", o: "koiki" },
  { s: "illustration", p: "for", o: "basketball" },
  { s: "fujii", p: "livesIn", o: "tokyo" },
  { s: "fujii", p: "made", o: "tokyolocal" },
  { s: "tokyolocal", p: "about", o: "tokyo" },
  { s: "fujii", p: "coFounded", o: "koikiteam" },
  { s: "koiki", p: "namedAfter", o: "koikiteam" },
  { s: "fujii", p: "plays", o: "basketball" },
  { s: "fujii", p: "cooks", o: "cooking" },
  { s: "fujii", p: "drinks", o: "coffee" },
  { s: "fujii", p: "drinks", o: "sake" },
  { s: "sake", p: "pairsWith", o: "cooking" },
  { s: "fujii", p: "eats", o: "washoku" },
  { s: "coffee", p: "fueled", o: "engineer" },
  { s: "fujii", p: "rootedIn", o: "origins" },
  { s: "origins", p: "fueled", o: "engineer" },
  { s: "origins", p: "fueled", o: "uiux" },
  { s: "illustration", p: "rootedIn", o: "origins", weight: 0.5 },
  { s: "basketball", p: "at", o: "rakuten", weight: 0.6 },
];

// ============ instance tier (detail panels) ============

export const ENTITIES: Record<string, EntityDetail> = {
  fujii: {
    type: "a foaf:Person · :ProductEngineer",
    title: { ja: "藤井 貴浩", en: "Takahiro Fujii" },
    desc: {
      ja: "WealthPark株式会社にてCTOとしてプロダクト開発を牽引。その側、LLMを駆使してエンジニアとしてプロダクト開発・UI/UXデザイン設計も行っています。このグラフの辺は、すべてここから伸びています。",
      en: "Leading product development as CTO at WealthPark Inc., and still building products and UI/UX design hands-on with LLMs. Every edge in this graph starts here.",
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
      ja: "不動産管理会社、不動産オーナー向けプロダクト、オルタナティブ投資のデジタルプラットフォームの開発及び運用を行っています。2020年にWealthParkへ参画し、フロントエンドの開発リード、VPoE、SVPを経て、2024年より現職であるCTOに就任しました。",
      en: "Developing and operating products for real estate management companies and property owners, as well as a digital platform for alternative investments. Joined in 2020; frontend development lead, VPoE and SVP before being appointed CTO in 2024.",
    },
    meta: [
      { p: ":since", v: "2020.04" },
      { p: ":domain", v: ":real-estate, :fintech" },
      { p: ":roles", v: ":VPoE → :SVP → :CTO" },
      { p: ":web", v: "wealth-park.com ↗", href: "https://wealth-park.com/ja/" },
    ],
    items: [
      { y: "2023", label: { ja: "WealthPark Engineering Blog 開設", en: "Launched WealthPark Engineering Blog" }, href: "https://medium.com/wealthpark-engineering/on-starting-a-tech-blog-at-wealthpark-3bd84c46336" },
      { y: "2022", label: { ja: "Remote Trust — RSGT2022(Matteo Carellaと共同登壇)", en: "Remote Trust — RSGT2022 (with Matteo Carella)" } },
      { y: "2021", label: { ja: "グローバルなエンジニア組織を率いるVPoEの挑戦(Wantedly)", en: "Challenges of a VP of Engineering leading a global org (Wantedly)" }, href: "https://www.wantedly.com/companies/wealth-park/post_articles/364562" },
      { y: "2020", label: { ja: "VPが語る、WealthParkのプロダクト、技術、組織(Wantedly)", en: "WealthPark's Product VPs talk about products, technologies, and organization (Wantedly)" }, href: "https://www.wantedly.com/companies/wealth-park/post_articles/283428" },
    ],
    rel: ["cto", "svp", "vpoe", "realestate", "fintech"],
  },
  rakuten: {
    type: "a :Organization",
    title: { ja: "楽天(楽天トラベル)", en: "Rakuten (Travel)" },
    desc: {
      ja: "フルスタックエンジニア、エンジニアリングマネージャとして楽天トラベルの開発業務に従事。国際業務チームにて、海外ホテルの予約システムや管理画面、経理システム、インバウンドサイト、外部システム連携など、複数の新規サービスの立ち上げおよび開発に携わりました。",
      en: "Full-stack engineer and engineering manager at Rakuten Travel. In the international business team, launched and developed multiple new services: booking systems for overseas hotels, management screens, accounting systems, inbound sites and external integrations.",
    },
    meta: [
      { p: ":period", v: "2010 – 2019" },
      { p: ":domain", v: ":travel" },
    ],
    items: [
      { y: "2019", label: { ja: "Large react product with 20+ FE engineers(React Tokyo Plus)", en: "Large react product with 20+ FE engineers (React Tokyo Plus)" }, href: "https://speakerdeck.com/taka66/large-react-product-with-20-plus-frontend-engineers-in-rakuten-travel" },
      { y: "2019", label: { ja: "楽天トラベルのフロントエンドについて(React Meetup)", en: "Rakuten Travel frontend (React Meetup)" }, href: "https://speakerdeck.com/taka66/le-tian-toraberufalsehurontoendonituite-react-meetup" },
      { y: "2017", label: { ja: "FrontEndからみるmicroservice(Microservice Meetup Vol.6)", en: "Microservice from the frontend (Microservice Meetup Vol.6)" }, href: "https://speakerdeck.com/taka66/microservices-at-microservice-meetup-vol-dot-6" },
      { y: "2016", label: { ja: "楽天トラベルとSpring(Spring Day 2016)", en: "Rakuten Travel and Spring (Spring Day 2016)" }, href: "https://www.slideshare.net/slideshow/springspring-day-2016/69327034" },
    ],
    rel: ["engineer", "travel", "react"],
  },
  goodpatch: {
    type: "a :Organization · :School",
    title: { ja: "Designers Gym(Goodpatch)", en: "Designers Gym (Goodpatch)" },
    desc: {
      ja: "2019年の半年間、デザインを基礎から習い直した場所です。エンジニアの自分がデザイナーを名乗る根拠のひとつになっています。",
      en: 'Formal design training — one of the places where an engineer earned the right to say "designer".',
    },
    meta: [
      { p: ":kind", v: "design program" },
      { p: ":period", v: "2019.04 – 2019.09" },
    ],
    rel: ["uiux", "illustration", "designeer"],
  },
  afc: {
    type: "a :Organization · :College",
    title: { ja: "青山ファッションカレッジ", en: "Aoyama Fashion College" },
    desc: {
      ja: "青山ファッションカレッジにて、ファッションテック科のWeb制作のシラバス制作と講義を担当しました(2023年度)。",
      en: "Created the syllabus and taught web production for the Fashion Tech Department at Aoyama Fashion College (AY2023).",
    },
    meta: [
      { p: ":subject", v: "ファッションテック科 Web制作" },
      { p: ":year", v: "AY2023" },
    ],
    rel: ["uiux", "illustration"],
  },
  koiki: {
    type: "a :Artifact · :Podcast",
    title: { ja: "小粋fm(Koiki.fm)", en: "Koiki.fm" },
    desc: {
      ja: "Engineering Manager向けのPodcastを2名で運営しています(2020-現在)。ロゴは自作です(→ :illustration)。",
      en: "Co-hosting a podcast for Engineering Managers (2020-present). Logo drawn by the host (→ :illustration).",
    },
    meta: [
      { p: ":since", v: "2020" },
      { p: ":co-host", v: ":fujii" },
      { p: ":listen", v: "Spotify ↗", href: "https://creators.spotify.com/pod/profile/koikifm/" },
    ],
    items: [
      { y: "2020", label: { ja: "小粋fm(Koiki.fm)を開始", en: "Koiki.fm launched" }, href: "https://creators.spotify.com/pod/profile/koikifm/" },
      { y: "—", label: { ja: "note マガジン「小粋fm」(7本)", en: 'note magazine "Koiki fm" (7 posts)' } },
    ],
    rel: ["engmgmt", "illustration", "note", "koikiteam"],
  },
  talks: {
    type: "a :Artifact · :TalkSeries",
    title: { ja: "講演・登壇", en: "Talks" },
    desc: {
      ja: "カンファレンスからmeetup、大学の講義まで。テーマは組織、フロントエンド、アジャイル、キャリアと幅広いですが、根は同じで、人がソフトウェアを作る話をしています。",
      en: "Conferences, meetups, university lectures — orgs, frontend, agile, careers.",
    },
    meta: [
      { p: ":count", v: "10+" },
      { p: ":languages", v: "ja / en" },
    ],
    items: [
      { y: "2023", label: { ja: "日本にいながら多国籍チームで働けるスタートアップエンジニアトーク!!", en: "Startup engineer talk: working in multinational teams while in Japan" }, href: "https://www.youtube.com/watch?v=OgXqEF6VfzY" },
      { y: "2022", label: { ja: "Remote Trust - RSGT2022(Matteo Carella氏と共同発表)", en: "Remote Trust - RSGT2022 (with Matteo Carella)" }, href: "https://speakerdeck.com/taka66/remote-trust-rsgt2022-by-takahiro-fujii-matteo-carella" },
      { y: "2022", label: { ja: "What do we want to know through coding assessment", en: "What do we want to know through coding assessment" }, href: "https://speakerdeck.com/taka66/what-do-we-want-to-know-through-coding-assessment" },
      { y: "2021", label: { ja: "SquadにおけるPO/PdMとエンジニアの協業", en: "PO/PdM × engineer collaboration in Squads" }, href: "https://speakerdeck.com/taka66/pdmtoenziniafalsexie-ye-purodakutoonaji-ri2021-spring-poji-ri2021spring" },
      { y: "2019", label: { ja: "Large react product with 20+ FE engineers(React Tokyo Plus)", en: "Large react product with 20+ FE engineers" }, href: "https://speakerdeck.com/taka66/large-react-product-with-20-plus-frontend-engineers-in-rakuten-travel" },
      { y: "2019", label: { ja: "楽天トラベルのフロントエンド(React Meetup)", en: "Rakuten Travel frontend (React Meetup)" }, href: "https://speakerdeck.com/taka66/le-tian-toraberufalsehurontoendonituite-react-meetup" },
      { y: "2017", label: { ja: "東京理科大学 講演「グローバルな環境におけるエンジニアのキャリア形成」", en: "Tokyo University of Science lecture: career development for engineers in a global environment" } },
      { y: "2017", label: { ja: "東京理科大学 寄稿「好きなことを仕事にする」(科学フォーラム)", en: "Tokyo University of Science journal essay: turning what you love into a job" } },
      { y: "2018", label: { ja: "Microservice Meetup Vol.6", en: "Microservice Meetup Vol.6" }, href: "https://speakerdeck.com/taka66/microservices-at-microservice-meetup-vol-dot-6" },
      { y: "2016", label: { ja: "楽天トラベルとSpring(Spring Day 2016)", en: "Rakuten Travel and Spring (Spring Day 2016)" }, href: "https://www.slideshare.net/slideshow/springspring-day-2016/69327034" },
      { y: "2015", label: { ja: "Spring Rest Docsの活用について(JSUG)", en: "Using Spring REST Docs (JSUG)" }, href: "https://www.slideshare.net/slideshow/spring-onewebdocument/55886107" },
    ],
    rel: ["engmgmt", "react", "rakuten", "wealthpark"],
  },
  seminars: {
    type: "a :Artifact · :SeminarSeries",
    title: { ja: "AIセミナー", en: "AI Seminars" },
    desc: {
      ja: "不動産会社やビジネス職向けに、AI・ChatGPT入門のセミナー登壇やパネルディスカッションを行っています。テーマは『AIは難しくない!不動産会社のためのAI超入門』など。",
      en: "AI and ChatGPT intro seminars and panel discussions for real-estate companies and business teams, including 'AI is Not Difficult! AI Super Introduction for Real Estate Companies'.",
    },
    meta: [
      { p: ":since", v: "2023" },
      { p: ":audience", v: ":real-estate, business" },
    ],
    items: [
      { y: "2025", label: { ja: "生成AIを活用した不動産業務の効率化(IT・シェアリング促進事業者協会)", en: "GenAI for real-estate ops efficiency" }, href: "https://drive.google.com/file/d/1wHV_WKkPfRD-9FE-A3RmORJGtmkg5SU0/view" },
      { y: "2023", label: { ja: "ベネフィット・ステーション利用者向けChatGPT入門", en: "Intro to ChatGPT for Benefit Station users" }, href: "https://prtimes.jp/main/html/rd/p/000000108.000040576.html" },
      { y: "2023", label: { ja: "ChatGPT入門!仕組み・使い方・セキュリティ", en: "ChatGPT: mechanics, usage, security" }, href: "https://www.youtube.com/watch?v=HHVMBkJwRH8" },
    ],
    rel: ["llm", "realestate"],
  },
  reviews: {
    type: "a :Artifact · :ReviewWork",
    title: { ja: "技術書 翻訳レビュー", en: "Book Translation Reviews" },
    desc: {
      ja: "『スタッフエンジニアの道』『ソフトウェアアーキテクトのための意思決定術』の翻訳レビューを行いました(2024)。",
      en: "Performed translation reviews of The Staff Engineer's Path and Software Architecture and Decision-Making (2024).",
    },
    meta: [{ p: ":year", v: "2024" }],
    items: [
      { y: "2024", label: { ja: "『スタッフエンジニアの道』", en: "The Staff Engineer's Path" }, href: "https://note.com/takahirofujii/n/n73fc62d43a0f" },
      { y: "2024", label: { ja: "『ソフトウェアアーキテクトのための意思決定術』", en: "Software Architecture and Decision-Making" } },
    ],
    rel: ["engmgmt", "note"],
  },
  note: {
    type: "a :Artifact · :Blog",
    title: { ja: "note", en: "note (blog)" },
    desc: {
      ja: "キャリアや組織の話から、ご機嫌でいる技術(という記事)まで。書いたものはだいたいここにあります。",
      en: 'Careers, orgs, books, and "the art of staying in a good mood". The written archive.',
    },
    meta: [{ p: ":url", v: "note.com/takahirofujii ↗", href: "https://note.com/takahirofujii" }],
    items: [
      { y: "2025", label: { ja: "STARTUP CTO NIGHT & DAY 2025に参加して", en: "STARTUP CTO NIGHT & DAY 2025" }, href: "https://note.com/takahirofujii/n/n6c191fd6dac3" },
      { y: "2025", label: { ja: "ポートフォリオサイトをCursorで作り直してみた所感", en: "Rebuilding this site with Cursor" }, href: "https://note.com/takahirofujii/n/n6b9ab7b45c6b" },
      { y: "2025", label: { ja: "ご機嫌でいる技術", en: "The art of staying in a good mood" }, href: "https://note.com/takahirofujii/n/n47864bb73c6b" },
      { y: "2024", label: { ja: "WealthPark CTO就任によせて", en: "On becoming CTO of WealthPark" }, href: "https://note.com/takahirofujii/n/nf66e8e99c53b" },
      { y: "2024", label: { ja: "教養としての「会計」入門", en: "Accounting as a liberal art" }, href: "https://note.com/takahirofujii/n/n06c63272dc95" },
      { y: "—", label: { ja: "旧ブログ: Spotify Modelの虚像と実像 / VPoEとしての最初の取組 ほか", en: "Older: Spotify Model myths / First moves as VPoE, etc." } },
    ],
    rel: ["engmgmt", "koiki", "designeer"],
  },
  designeer: {
    type: "a :Artifact · :Blog",
    title: { ja: "desi-gneer(旧テックブログ)", en: "desi-gneer (old tech blog)" },
    desc: {
      ja: "designer_engineerを名乗った最初の場所です(はてなブログ、2013-2019、27記事)。JavaOneやSpringOneの参加記からDDD、React、組織論、インド旅行記まで。デザイナー兼エンジニアという肩書きは、ここから始まっています。",
      en: "Where the name designer_engineer first appeared (Hatena Blog, 2013-2019, 27 posts). JavaOne and SpringOne reports, DDD, React, org theory, and an India travel series. The designer-engineer identity starts here.",
    },
    meta: [
      { p: ":period", v: "2013 – 2019" },
      { p: ":posts", v: "27" },
      { p: ":url", v: "takahiro-fujii.hatenablog.com ↗", href: "https://takahiro-fujii.hatenablog.com/" },
    ],
    items: [
      { y: "2019", label: { ja: "学び方のデザインを受けて / designergym 参加記", en: "On learning design / designergym notes" } },
      { y: "2019", label: { ja: "インド旅行記(ムンバイ、アーコラー)", en: "India travel series (Mumbai, Akola)" } },
      { y: "2018", label: { ja: "『エンジニアリング組織論への招待』を読んで", en: "Reading 'An Invitation to Engineering Organization Theory'" } },
      { y: "2017", label: { ja: "DDD・マイクロサービス関連の記事群", en: "Posts on DDD and microservices" } },
      { y: "2016", label: { ja: "SpringOne 参加記 / Zenhack 2016 Fall", en: "SpringOne report / Zenhack 2016 Fall" } },
      { y: "2015", label: { ja: "Design Sprint 研修記 / CSS・shadow DOM", en: "Design Sprint training / CSS & shadow DOM" } },
      { y: "2013", label: { ja: "JavaOne 2013 参加記 / API設計", en: "JavaOne 2013 report / API design" } },
    ],
    rel: ["note", "java", "uiux", "goodpatch"],
  },
  illustration: {
    type: "a :Artifact · :DesignWork",
    title: { ja: "イラスト & デザインワーク", en: "Illustration & Design Works" },
    desc: {
      ja: "幼少期から絵が得意だったわけではありません。大学2年のとき、インターンで稼いだお金でAdobeのCreative Suiteを一式買ったのが始まりです。そこから塾の教材やバナー、チラシをイラレで作るようになり、社会人になってからも趣味やフリーランスでロゴやデザインを作っています。小粋fmのロゴやLineスタンプ、名刺、バスケットボールのユニフォームもその一部です。",
      en: "I was never the kid who could draw. It started in my second year of university, when I spent my internship earnings on the full Adobe Creative Suite. From there came teaching materials, banners and flyers in Illustrator, and the designing never stopped: logos and design work as a hobby and freelance. The Koiki.fm logo, Line stickers, business cards and basketball uniforms in this gallery are part of that.",
    },
    meta: [
      { p: ":since", v: "大学2年(Creative Suite購入)" },
      { p: ":tool", v: "Illustrator → iPad, Figma" },
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
      { src: "/design/winx.png", caption: { ja: "WINX — 駒沢ストリートチームのユニフォーム", en: "WINX — uniform for the Komazawa street team" } },
      { src: "/design/superpoints.png", caption: { ja: "SUPERPOINTS — 楽天バスケ部(実業団)のユニフォーム", en: "SUPERPOINTS — uniform for Rakuten's corporate-league club" } },
      { src: "/design/business-card.png", caption: { ja: "名刺", en: "Business cards" } },
    ],
    rel: ["koiki", "basketball", "uiux", "origins"],
  },
  uiux: {
    type: "a :Domain",
    title: { ja: "UI / UX", en: "UI / UX" },
    desc: {
      ja: "2017年以降、UI/UX領域を専門とするエンジニアおよびエンジニアリングマネージャとして、WebフロントエンドやAndroid/iOSアプリ開発チームのマネジメント、サービス・組織の成長を牽引してきました。",
      en: "Since 2017, specialized in the UI/UX domain as an engineer and engineering manager, leading web frontend and Android/iOS app teams and driving the growth of services and organizations.",
    },
    meta: [{ p: ":since", v: "2017" }],
    rel: ["figma", "afc", "goodpatch"],
  },
  llm: {
    type: "a :Skill",
    title: { ja: "LLM", en: "LLM" },
    desc: {
      ja: "LLMを駆使したプロダクト開発・UI/UXデザイン設計に取り組んでいます。最新の取り組みは、このオントロジーに順次追記します。",
      en: "Building products and UI/UX design with LLMs, hands-on. Latest work will be appended to this ontology.",
    },
    meta: [{ p: ":status", v: "active" }],
    rel: ["seminars", "wealthpark"],
  },
  origins: {
    type: "a :Domain · :OriginStory",
    title: { ja: "原体験", en: "Origins" },
    desc: {
      ja: "機械に自然と馴染めたのは、父親の影響が大きいと思います。幼少期は家のワープロで意味もわからずタイピング。小学校の教室にはMacintoshが2台あり、インクレディブルマシーンでよく遊びました。父親がWindows 95を買ってからは、家でパソコンをよく触るように。中学ではポストペットやオンラインオセロのnethelloで遊ぶうちに、BBSを作り、チャットを作り、ホームページを作り、HTMLに手を出しました。この頃の体験が、いまの仕事を選んだ原体験だと思います。",
      en: "Getting comfortable with machines came from my father. As a small kid I typed away on the family word processor without understanding a thing. My elementary school classroom had two Macintoshes, where I played The Incredible Machine; then my father bought Windows 95 and the home PC became my playground. In junior high, PostPet and an online Othello game called nethello led to building BBSes, then chat rooms, then homepages, and to HTML. I think those years are why I chose this work.",
    },
    meta: [
      { p: ":influence", v: "父親" },
      { p: ":firstMachines", v: "ワープロ, Macintosh, Windows 95" },
      { p: ":major", v: "数理情報科学" },
    ],
    items: [
      { y: "幼少期", label: { ja: "家のワープロで、意味もわからずタイピング", en: "Typing on the family word processor, meaning unknown" } },
      { y: "小学校", label: { ja: "教室のMacintosh 2台と、インクレディブルマシーン", en: "Two classroom Macintoshes and The Incredible Machine" } },
      { y: "小学校", label: { ja: "父親がWindows 95を購入、家がパソコン部屋に", en: "Father buys Windows 95; the home PC era begins" } },
      { y: "中学", label: { ja: "ポストペット、nethello(オンラインオセロ)", en: "PostPet and nethello, an online Othello game" } },
      { y: "中学", label: { ja: "BBS → チャット → ホームページ → HTML", en: "BBS → chat → homepages → HTML" } },
      { y: "高校", label: { ja: "バスケに熱中して小休止(→ :basketball)", en: "A basketball-fueled intermission (→ :basketball)" } },
      { y: "大学", label: { ja: "数理情報科学を専攻し、コンピュータの世界に帰還", en: "Majoring in mathematical information science: back to computers" } },
      { y: "大学", label: { ja: "インターンで稼いだお金でAdobe Creative Suiteを一式購入", en: "Spent internship earnings on the full Adobe Creative Suite" } },
      { y: "大学", label: { ja: "塾講師 — Illustratorを駆使して教材プリントを自作", en: "Tutoring job: making original teaching materials in Illustrator" } },
      { y: "大学", label: { ja: "広報課バイトでデザインとWeb制作", en: "University PR office job: design and web production" } },
      { y: "卒研", label: { ja: "GoogleのPageRankアルゴリズムの改善", en: "Improving Google's PageRank algorithm" } },
    ],
    rel: ["engineer", "uiux", "basketball"],
  },
  tokyo: {
    type: "a :Place",
    title: { ja: "東京", en: "Tokyo" },
    desc: {
      ja: "生まれも育ちも東京。拠点であり、tokyo as a local で紹介していた対象でもあります。",
      en: "Born and raised in Tokyo. Home base, and the subject of tokyo as a local.",
    },
    rel: ["tokyolocal"],
  },
  tokyolocal: {
    type: "a :Artifact · :SideProject",
    title: { ja: "tokyo as a local", en: "tokyo as a local" },
    desc: {
      ja: "東京で生まれ育ったローカルとして、日常の東京を英語で紹介していた個人サイトです。学芸大学・駒沢大学エリアのカフェやバスケットボールショップなど、観光ガイドには載らない場所を載せていました。",
      en: "Share my daily life of Tokyo: a personal site introducing how a Tokyo native goes about their day. Cafes and basketball shops around Gakugei-Daigaku and Komazawa — the places tourist guides skip.",
    },
    meta: [
      { p: ":lang", v: "en" },
      { p: ":repo", v: "taka66/tokyo-as-a-local" },
    ],
    items: [
      { y: "—", label: { ja: "STREAMER COFFEE(学芸大学)", en: "STREAMER COFFEE (Gakugei-Daigaku)" } },
      { y: "—", label: { ja: "日本のバスケットボールブランド・ショップ", en: "Japanese basketball brand & shop" } },
      { y: "—", label: { ja: "オリジナルハンカチの店(駒沢大学)", en: "Original handkerchief shop (Komazawa-Daigaku)" } },
      { y: "—", label: { ja: "学芸大学〜駒沢大学エリアの散歩", en: "Walking the Gakugei-Daigaku to Komazawa stretch" } },
    ],
    rel: ["tokyo", "coffee", "basketball"],
  },
  koikiteam: {
    type: "a :Organization · :CreativeTeam",
    title: { ja: "小粋(KOIKI)", en: "KOIKI" },
    desc: {
      ja: "『小粋(STYLISH)なプロダクトをつくる』創作組織。共同創業者のひとりとして、ハッカソンなどでプロダクトを作っていました(2013-2017)。Monstera、Sigure、Spot4u、Betogether(Yahoo Hackday 2017)など。",
      en: "An organization to create stylish (koiki) products. Co-founded it and built things at hackathons (2013-2017): Monstera, Sigure, Spot4u, and Betogether at Yahoo Hackday 2017.",
    },
    meta: [
      { p: ":period", v: "2013 – 2017" },
      { p: ":members", v: "8" },
      { p: ":url", v: "koikijs.github.io ↗", href: "https://koikijs.github.io/" },
    ],
    items: [
      { y: "2017", label: { ja: "Betogether — オンラインコミュニケーションシステム(Yahoo Hackday 2017)", en: "Betogether — online communication system (Yahoo Hackday 2017)" } },
      { y: "—", label: { ja: "Monstera — イベントスケジュール管理", en: "Monstera — event schedule management" } },
      { y: "—", label: { ja: "Spot4u — スポット検索", en: "Spot4u — spot search" } },
    ],
    rel: ["koiki"],
  },
  coffee: {
    type: "a :Hobby",
    title: { ja: "コーヒー", en: "Coffee" },
    desc: {
      ja: "社会人になるまで、コーヒーはほとんど飲みませんでした。最初の出会いは、仕事中に寝ないための缶コーヒー。そのうちスタバや学芸大学・中目黒のカフェで、コーヒーを飲みながらプログラミングの勉強をするようになりました。仕事後や休日にスキルを磨くためのお供だったのが、素敵なカフェやコーヒーとの出会いを重ねるうちに、それ自体が趣味になって今に至ります。",
      en: "Coffee wasn't a habit until I started working: the first encounter was canned coffee, purely to stay awake on the job. It grew into studying programming over coffee at Starbucks and the cafes of Gakugei-Daigaku and Nakameguro, my companion for sharpening skills after work and on weekends. Somewhere along the way, meeting good cafes and good coffee, it stopped being a tool and became the hobby it is today.",
    },
    meta: [
      { p: ":origin", v: "缶コーヒー(眠気覚まし)" },
      { p: ":habitat", v: "学芸大学・中目黒のカフェ" },
    ],
    rel: ["engineer", "tokyo", "tokyolocal", "cooking"],
  },
  sake: {
    type: "a :Hobby",
    title: { ja: "お酒", en: "Drinks" },
    desc: {
      ja: "強いナラティブがあるわけではないかもしれません。ただ昔から飲むのが好きで、いまもよく行く飲み屋で週に数回、店主や友達と話しています。本質的には、お酒というより友達と話すことが好きなのかもしれません。そのなかで徐々に詳しくなり、いまではビール、焼酎、ジン、日本酒、ワインのどれも好きで、料理との組み合わせも楽しめるようになりました。住んできた場所の近くには思い入れのある店が多く、住む場所が変わるたびに好きな店と好きなお酒が少しずつ増えてきた、ということかなと思っています。",
      en: "There may not be a strong narrative here. But I have always liked drinking, and a few nights a week I am at my usual bar, talking with the owner and friends. Essentially it may be less about the alcohol and more about the conversation. Along the way I got to know it anyway: beer, shochu, gin, sake, wine, all of them, and pairing them with food. Every place I have lived left me a bar I care about, so the list of favorite bars and favorite drinks just kept growing, a little at a time.",
    },
    meta: [
      { p: ":essence", v: "お酒というより、友達と話すこと" },
      { p: ":favorites", v: "ビール, 焼酎, ジン, 日本酒, ワイン" },
      { p: ":frequency", v: "週数回、いつもの店で" },
    ],
    rel: ["cooking", "tokyo", "washoku"],
  },
  washoku: {
    type: "a :Hobby",
    title: { ja: "和食", en: "Washoku" },
    desc: {
      ja: "やっぱり自分は日本が好きだ、という点に影響されている部分が大きいです。他の料理も好きなのですが、海外から帰ってきた後に食べる和食が好きです。油分が多くない料理も多く、落ち着いて食べられるところが好きです。",
      en: "It comes largely from the simple fact that I love Japan. I enjoy other cuisines too, but the washoku eaten right after coming home from abroad is the one I love. Much of it is light on oil, so you can eat it calmly, and that calm is the point.",
    },
    meta: [
      { p: ":because", v: "やっぱり、日本が好きだから" },
      { p: ":best", v: "海外から帰ってきた直後の一食" },
      { p: ":quality", v: "油分少なめ、落ち着いて食べられる" },
    ],
    rel: ["cooking", "sake", "travel"],
  },
  english: {
    type: "a :Skill · :Language",
    title: { ja: "英語", en: "English" },
    desc: {
      ja: "学生時代は苦手教科で、話すことはほとんどできませんでした。自分の人生とリンクしておらず、勉強する意味が見出せなかったのだと思います。卒研と楽天入社で仕事と英語が徐々に紐づき、そこで仲の良い海外の友達ができたことが、英語力向上の一番の貢献者です。もともと人と話すことが好きなので、いろんな国の友達とやり取りするうちに自然と身につきました。多国籍なマネジメントの経験も重なり、英語力だけでなく多様性や文化の理解を深められたことが、国際的な組織を率いることができる理由の一つになっていると思います。",
      en: "English was my weak subject as a student. It simply was not linked to my life, so I never saw the point of studying it. Graduation research and joining Rakuten slowly tied it to work, and making close friends from abroad became the single biggest contributor: I have always loved talking with people, so the language came naturally through those friendships. Years of managing multinational teams then deepened not just the English but an understanding of diversity and culture — one of the reasons I can lead an international organization.",
    },
    meta: [
      { p: ":origin", v: "苦手教科(意味が見えなかった)" },
      { p: ":teacher", v: "海外の友達" },
      { p: ":beyond", v: "多様性と文化の理解" },
    ],
    rel: ["rakuten", "wealthpark", "talks", "sake"],
  },
  basketball: {
    type: "a :Hobby",
    title: { ja: "バスケットボール", en: "Basketball" },
    desc: {
      ja: "小学校のとき、先輩に誘われて始めました。転機は中学時代、夏に部活が少なかったので駒沢公園のストリートコートで遊ぶようになったこと。ここで出会った先輩や仲間とは、20年以上経ったいまも一緒にバスケをしています。仲間とチームを作って大会に出て、そのユニフォームは自分でデザインしました。高校・大学でも続け、楽天ではバスケ部に入り関東実業団リーグにも参加。いまは会社の仲間や昔の仲間と、趣味とエクササイズとして楽しんでいます。",
      en: "It started in elementary school when an older kid invited me in. The turning point came in junior high: my school had few summer clubs, so I started playing on the street courts of Komazawa Park. The friends I met there are still my teammates more than twenty years later. We formed a team, entered tournaments, and I designed our uniforms. I kept playing through high school and university, then joined Rakuten's basketball club and played in the Kanto corporate league. These days it is hobby and exercise, with colleagues and old friends.",
    },
    meta: [
      { p: ":since", v: "小学校 / elementary school" },
      { p: ":court", v: "駒沢公園ストリートコート" },
      { p: ":league", v: "関東実業団(楽天バスケ部)" },
    ],
    items: [
      { y: "—", label: { ja: "WINX — 駒沢の仲間と作ったチームのユニフォーム(自作 → :illustration)", en: "WINX — uniform for the Komazawa street team (self-designed → :illustration)" } },
      { y: "—", label: { ja: "SUPERPOINTS — 楽天バスケ部・関東実業団リーグのユニフォーム(自作 → :illustration)", en: "SUPERPOINTS — uniform for Rakuten's club in the corporate league (self-designed → :illustration)" } },
    ],
    rel: ["illustration", "tokyo", "rakuten"],
  },
  cooking: {
    type: "a :Hobby",
    title: { ja: "料理", en: "Cooking" },
    desc: {
      ja: "両親の休みがバラバラだったこともあり、小さい頃は父親にごはんを作ることがありました。一人暮らしを始めてからは日常のことに。最初は本を見ながらでしたが、コロナ禍とYouTubeの料理動画、リモートワークが向き合い方を一気に変えました。調味料やスパイスの配合を変えて味の変化を見るのは、ある種の実験でありテストで、そこが好きです。好きなものはコーヒー、お酒、和食全般。",
      en: "My parents' days off rarely lined up, so as a kid I sometimes cooked for my father. Living alone made it a daily thing. It started with cookbooks; the pandemic, YouTube cooking videos and remote work accelerated it. What I like most is changing the ratios of seasonings and spices and watching how the taste shifts — a kind of experiment, a kind of testing. Favorite things: coffee, alcohol, and Japanese cuisine in general.",
    },
    meta: [
      { p: ":origin", v: "父親へのごはん" },
      { p: ":accelerants", v: "コロナ禍, YouTube, リモートワーク" },
      { p: ":method", v: "配合を変えて、味の変化を観察" },
    ],
    rel: ["coffee", "engineer", "sake"],
  },
};

/** short hover sentences for nodes without a full panel */
export const SENTENCES: Record<string, L10n> = {
  cto: { ja: "2024年4月からWealthParkの<b>CTO</b>。", en: "<b>CTO</b> at WealthPark since April 2024." },
  svp: { ja: "<b>SVP</b>(2023.03–2024.04)— VPoEとCTOの間の一年。", en: "<b>SVP</b> (2023.03–2024.04) — the year between VPoE and CTO." },
  vpoe: { ja: "<b>VPoE</b>(2020.04–2023.03)として多国籍組織を構築。", en: "Built a multinational org as <b>VPoE</b> (2020.04–2023.03)." },
  engineer: { ja: "フルスタック<b>エンジニア</b>、EMとして楽天トラベル(2010-2019)。", en: "Full-stack <b>engineer</b> and EM at Rakuten Travel (2010-2019)." },
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
  worksSub: {
    ja: "講演、ポッドキャスト、セミナー、翻訳レビュー、記事。出典チップを押すと、グラフの該当エンティティが開きます。",
    en: "Talks, podcasts, seminars, translation reviews, writing. The source chip on each row opens the entity in the graph.",
  },
  storyKicker: { ja: "# story renderer · :fujii/profile", en: "# story renderer · :fujii/profile" },
  storySub: { ja: "Product Engineer / Designer / CTO — Tokyo", en: "Product Engineer / Designer / CTO — Tokyo" },
  storyHint: { ja: "太字に触れると、裏側の繋がりが見えます", en: "Touch any bold term to see its hidden connections" },
  storyNote: {
    ja: "この記事の太字は、すべてグラフのノードです。同じ関係を、文章という形に注ぎ替えています。",
    en: "Every bold term in this article is a node in the graph — the same relations, poured into prose.",
  },
  openInGraph: { ja: "グラフで開く", en: "open in graph" },
  designSub: {
    ja: "幼少期から絵が得意だったわけではありません。大学2年、インターン代でCreative Suiteを買ったところから始まった作品集です。",
    en: "I was never the kid who could draw. This collection started with the Creative Suite bought on internship earnings in my second year of university.",
  },
} satisfies Record<string, L10n>;


/** the 2025 site's full AboutMe text, reused verbatim as the profile intro */
export const PROFILE_INTRO: L10n = {
  ja: `WealthPark株式会社にてCTOとしてプロダクト開発を牽引。
その側、LLMを駆使してエンジニアとしてプロダクト開発・UI/UXデザイン設計も行う。

大学卒業後、楽天株式会社に入社し、楽天トラベルの開発業務に従事。
国際業務チームにて、海外ホテルの予約システムや管理画面、経理システム、インバウンドサイト、外部システム連携など、複数の新規サービスの立ち上げおよび開発に携わる。
フルスタックエンジニアとしてキャリアをスタートし、2017年以降はUI/UX領域を専門とするエンジニアおよびエンジニアリングマネージャとして、WebフロントエンドやAndroid/iOSアプリ開発チームのマネジメント、サービス・組織の成長を牽引。

2020年にWealthParkへ参画。
フロントエンドの開発リードとして開発に従事したのち、VPoEとして多国籍なエンジニア組織(プロダクト開発・PdM・SRE・セキュリティ・QA・PMOなど)の構築・強化(採用含む)に注力しつつ、不動産・FinTech領域における複数サービスの開発をリードする。
2024年より現職であるCTOに就任。
CTOとして経営とエンジニアリングの接続/技術を基盤とした文化の醸成/エンジニアリングとソフトウェアを通じた企業価値の最大化などにも取り組んでいる。

フリーランス・プライベートではプロダクトマネジメント・デザイン含めた企画・デザイン・開発を行う。
趣味はバスケットボール、料理、イラストを描くこと。
好きなものはコーヒー、お酒、和食全般。`,
  en: `Leading product development as CTO at WealthPark Inc.
Also actively involved in product development and UI/UX design as an engineer utilizing LLMs.

After graduating from university, joined Rakuten, Inc. and worked on the development of Rakuten Travel.
In the international business team, involved in the launch and development of multiple new services, including booking systems for overseas hotels, management screens, accounting systems, inbound sites, and external system integration.
Started career as a full-stack engineer. Since 2017, specialized in the UI/UX domain as an engineer and engineering manager, leading the management of web frontend and Android/iOS app development teams, and driving the growth of services and organizations.

Joined WealthPark in 2020.
After working as a frontend development lead, focused on building and strengthening a multinational engineering organization (product development, PdM, SRE, security, QA, PMO, etc.) as VPoE, while leading the development of multiple services in the real estate and FinTech domains.
Appointed to the current position of CTO in 2024.
As CTO, also focusing on establishing budgets, mid-to-long-term development roadmaps, resource allocation, and evaluation systems.

As a freelancer and in private projects, involved in planning, design, and development, including product management and design.
Hobbies include basketball and cooking and drawing.
Favorite things are coffee, alcoholic beverages, and Japanese cuisine in general.`,
};

/** surface forms that the story renderer auto-links to entities */
export const STORY_ALIASES: { id: string; forms: string[] }[] = [
  { id: "wealthpark", forms: ["WealthPark"] },
  { id: "english", forms: ["多国籍なエンジニア組織", "multinational engineering organization"] },
  { id: "rakuten", forms: ["楽天株式会社", "楽天トラベル", "Rakuten Travel", "Rakuten, Inc."] },
  { id: "llm", forms: ["LLMを", "LLMs", "LLM"] },
  { id: "uiux", forms: ["UI/UX"] },
  { id: "vpoe", forms: ["VPoE"] },
  { id: "svp", forms: ["SVP"] },
  { id: "cto", forms: ["CTO"] },
  { id: "fintech", forms: ["FinTech"] },
  { id: "basketball", forms: ["バスケットボール", "basketball"] },
  { id: "cooking", forms: ["料理", "cooking"] },
  { id: "illustration", forms: ["イラストを描くこと", "drawing"] },
  { id: "coffee", forms: ["コーヒー", "coffee"] },
  { id: "sake", forms: ["お酒", "alcoholic beverages"] },
  { id: "washoku", forms: ["和食全般", "Japanese cuisine in general"] },
];

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
  { s: ":fujii", p: ":rootedIn", o: ":origins", ghosts: [":win95", ":html"] },
  { s: ":CTO", p: ":at", o: ":wealthpark" },
  { s: ":fujii", p: ":taught", o: ":afc", ghosts: [":web制作"] },
  { s: ":fujii", p: ":coHosts", o: ":koiki.fm", ghosts: [":podcast"] },
  { s: ":fujii", p: ":speaksAt", o: ":talks, :ai-seminars", ghosts: [":rsgt2022"] },
  { s: ":fujii", p: ":reviewed", o: ":book-reviews", ghosts: [":staff-eng-path"] },
  { s: ":fujii", p: ":writes", o: ":note", ghosts: [":ご機嫌でいる技術"] },
  { s: ":fujii", p: ":draws", o: ":illustration", ghosts: [":mt-fuji"] },
  { s: ":illustration", p: ":brands", o: ":koiki.fm" },
  { s: ":illustration", p: ":for", o: ":basketball", ghosts: [":uniforms"] },
  { s: ":coffee", p: ":fueled", o: ":Engineer", ghosts: [":缶コーヒー"] },
  { s: ":fujii", p: ":wrote", o: ":desi-gneer", ghosts: [":2013-2019"] },
  { s: ":fujii", p: ":livesIn", o: ":tokyo", ghosts: [":native"] },
  { s: ":fujii", p: ":coFounded", o: ":koiki-team", ghosts: [":2013-2017"] },
  { s: ":fujii", p: ":codesIn", o: ":typescript, :go, :python, :java" },
  { s: ":fujii", p: ":speaks", o: ":english", ghosts: [":海外の友達"] },
  { s: "# graph committed", comment: true },
];

export const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
