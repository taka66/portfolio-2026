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
  { id: "tokyo", label: ":tokyo", cls: "domain", queries: ["life"], seed: [0.58, 0.8] },
  { id: "tokyolocal", label: ":tokyo-as-a-local", cls: "artifact", queries: ["life", "craft"], seed: [0.72, 0.84] },
  { id: "koikiteam", label: ":koiki-team", cls: "org", queries: ["craft", "life"], seed: [0.22, 0.08] },
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
  { s: "fujii", p: "livesIn", o: "tokyo" },
  { s: "fujii", p: "made", o: "tokyolocal" },
  { s: "tokyolocal", p: "about", o: "tokyo" },
  { s: "fujii", p: "coFounded", o: "koikiteam" },
  { s: "koiki", p: "namedAfter", o: "koikiteam" },
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
    ],
    items: [
      { y: "2023", label: { ja: "WealthPark Engineering Blog 開設", en: "Launched WealthPark Engineering Blog" }, href: "https://medium.com/wealthpark-engineering" },
      { y: "2022", label: { ja: "Remote Trust — RSGT2022(Matteo Carellaと共同登壇)", en: "Remote Trust — RSGT2022 (with Matteo Carella)" } },
      { y: "2021", label: { ja: "グローバルなエンジニア組織を率いるVPoEの挑戦(Wantedly)", en: "Challenges of a VP of Engineering leading a global org (Wantedly)" } },
      { y: "2020", label: { ja: "VPが語る、WealthParkのプロダクト、技術、組織(Wantedly)", en: "WealthPark's Product VPs talk about products, technologies, and organization (Wantedly)" } },
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
      ja: "2019年の半年間、デザインを基礎から習い直した場所です。エンジニアの自分がデザイナーを名乗る根拠のひとつになっています。",
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
      { p: ":listen", v: "koiki.fm ↗", href: "https://koiki.fm" },
    ],
    items: [{ y: "—", label: { ja: "note マガジン「小粋fm」(7本)", en: 'note magazine "Koiki fm" (7 posts)' } }],
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
      { y: "2023", label: { ja: "日本にいながら多国籍チームで働けるスタートアップエンジニアトーク!!", en: "Startup engineer talk: working in multinational teams while in Japan" } },
      { y: "2022", label: { ja: "Remote Trust - RSGT2022(Matteo Carella氏と共同発表)", en: "Remote Trust - RSGT2022 (with Matteo Carella)" } },
      { y: "2022", label: { ja: "What do we want to know through coding assessment", en: "What do we want to know through coding assessment" } },
      { y: "2021", label: { ja: "SquadにおけるPO/PdMとエンジニアの協業", en: "PO/PdM × engineer collaboration in Squads" } },
      { y: "2019", label: { ja: "Large react product with 20+ FE engineers(React Tokyo Plus)", en: "Large react product with 20+ FE engineers" } },
      { y: "2019", label: { ja: "楽天トラベルのフロントエンド(React Meetup)", en: "Rakuten Travel frontend (React Meetup)" } },
      { y: "2017", label: { ja: "東京理科大学 講演「グローバルな環境におけるエンジニアのキャリア形成」", en: "Tokyo University of Science lecture: career development for engineers in a global environment" } },
      { y: "2017", label: { ja: "東京理科大学 寄稿「好きなことを仕事にする」(科学フォーラム)", en: "Tokyo University of Science journal essay: turning what you love into a job" } },
      { y: "2018", label: { ja: "Microservice Meetup Vol.6", en: "Microservice Meetup Vol.6" } },
      { y: "2016", label: { ja: "楽天トラベルとSpring(Spring Day 2016)", en: "Rakuten Travel and Spring (Spring Day 2016)" } },
      { y: "2015", label: { ja: "Spring Rest Docsの活用について(JSUG)", en: "Using Spring REST Docs (JSUG)" } },
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
      ja: "『スタッフエンジニアの道』『ソフトウェアアーキテクトのための意思決定術』の翻訳レビューを行いました(2024)。",
      en: "Performed translation reviews of The Staff Engineer's Path and Software Architecture and Decision-Making (2024).",
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
      ja: "キャリアや組織の話から、ご機嫌でいる技術(という記事)まで。書いたものはだいたいここにあります。",
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
      { y: "—", label: { ja: "旧テックブログ: Desi-gineer(はてなブログ)", en: "Older tech blog: Desi-gineer (Hatena)" } },
    ],
    rel: ["engmgmt", "koiki"],
  },
  illustration: {
    type: "a :Artifact · :DesignWork",
    title: { ja: "イラスト & デザインワーク", en: "Illustration & Design Works" },
    desc: {
      ja: "プライベートで制作したデザインやイラストの作品集です。小粋fmのロゴやLineスタンプ、名刺、バスケットボールのユニフォームも自作しました。",
      en: "A collection of design and illustration works made in private: the Koiki.fm logo, Line stickers, business cards and basketball uniforms included.",
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
  basketball: {
    type: "a :Hobby",
    title: { ja: "バスケットボール", en: "Basketball" },
    desc: {
      ja: "コートの上では肩書きが消えるのがいいところです。チームのユニフォームは自分でデザインしました(→ :illustration)。",
      en: "Titles disappear on the court. Team uniforms: designed by the player (→ :illustration).",
    },
    rel: ["illustration"],
  },
  cooking: {
    type: "a :Hobby",
    title: { ja: "料理", en: "Cooking" },
    desc: {
      ja: "趣味は料理。好きなものはコーヒー、お酒、和食全般です。",
      en: "Cooking as a hobby. Favorite things: coffee, alcohol, and Japanese cuisine in general.",
    },
    rel: ["coffee"],
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
  { s: ":fujii", p: ":livesIn", o: ":tokyo", ghosts: [":native"] },
  { s: ":fujii", p: ":coFounded", o: ":koiki-team", ghosts: [":2013-2017"] },
  { s: ":fujii", p: ":codesIn", o: ":typescript, :go, :python, :java" },
  { s: "# graph committed", comment: true },
];

export const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
