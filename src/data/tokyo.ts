import type { L10n } from "@/i18n/config";

/**
 * tokyo as a local — the three articles from the 2016 side project,
 * rescued from takahirofujii.com/tokyo-as-a-local.
 *
 * Hidden feature: these pages are linked only from the :tokyo-as-a-local
 * entity panel — no nav, no sitemap, noindex. The English has been cleaned
 * up from the 2016 originals; the Japanese is an AI translation of that
 * English (the page says so). The voice and the TAKA. sign-off stay.
 */

export type TokyoBlock = { img: string; alt: string } | { text: L10n } | { h: L10n };

export interface TokyoArticle {
  slug: string;
  no: string;
  kind: L10n;
  title: string;
  area: string;
  meta: { p: string; v: L10n; href?: string }[];
  blocks: TokyoBlock[];
  notes?: L10n[];
}

export const TOKYO_ARTICLES: TokyoArticle[] = [
  {
    slug: "streamer-coffee",
    no: "01",
    kind: { ja: "カフェ", en: "Cafe" },
    title: "STREAMER COFFEE COMPANY",
    area: "Gakugei-Daigaku",
    meta: [
      { p: ":station", v: { ja: "学芸大学(東急東横線)", en: "Gakugei-Daigaku (Tokyu Toyoko line)" } },
      { p: ":open", v: { ja: "10:00 – 20:00", en: "10:00 – 20:00" } },
      { p: ":address", v: { ja: "東京都目黒区中央町2-36", en: "2-36 Chuo-cho, Meguro-ku, Tokyo" } },
      { p: ":site", v: { ja: "streamercoffee.com ↗", en: "streamercoffee.com ↗" }, href: "http://streamercoffee.com/" },
    ],
    blocks: [
      {
        text: {
          ja: "このサイトの最初の記事として、学芸大学の Streamer Coffee Company を紹介します。日本で一番好きなカフェのひとつで、実はいままさに、この店の席でこのサイトを作っています。",
          en: "For the first article on this site, let me introduce Streamer Coffee Company in Gakugei-Daigaku — easily one of my favorite cafes in Japan. In fact, I am building this very website from one of its tables right now.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer1.jpg", alt: "Streamer Coffee Company under the railway viaduct" },
      {
        text: {
          ja: "学芸大学駅から歩いて5分ほど。高架下にあるので見つけやすいはずです。線路の下という立地のおかげで天井が高く、東京では珍しい空間で、どこか海外にいるような気分になります。",
          en: "It is about a five-minute walk from Gakugei-Daigaku station, tucked under the railway viaduct, so it is easy to find. Being under the tracks gives the cafe an unusually high ceiling — a rare thing in Tokyo — and the whole place feels a little like being abroad.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer2.jpg", alt: "Inside the cafe" },
      {
        text: {
          ja: "カウンター席には電源があります。東京で、Wi-Fiと電源の両方があるカフェは貴重です。",
          en: "The counter seats come with power outlets. In Tokyo, a cafe with both wifi and outlets is a precious thing.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer3.jpg", alt: "Counter seats" },
      {
        text: {
          ja: "2階は古着屋の KILO SHOP と共用になっていて、席もいくつかあります。",
          en: "The second floor is shared with KILO SHOP, a vintage clothing store, and has some extra seating too.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer4.jpg", alt: "Stairs to the second floor" },
      {
        text: {
          ja: "店の外には駐輪スタンドがあります。移動はほとんど自転車なので、これはうれしいポイント。そして一番のお気に入りは、店内にバスケットゴールがあること。好きなものが近くにあると、人は落ち着けるものです。",
          en: "There are bicycle stands outside — I get around mostly by bicycle, so this makes me happy. And my favorite detail: there is a basketball hoop inside the cafe. When your favorite things are close by, you can really settle in.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer5.jpg", alt: "The basketball hoop in the cafe" },
      { h: { ja: "Streamer Latte", en: "Streamer Latte" } },
      {
        text: {
          ja: "定番は Streamer Latte(580円ほど)。初めてなら、まずこれを頼んでみてください。マグはアメリカサイズで、バリスタがシンプルで美しいラテアートを注いでくれます。スチームミルクが多めで、なめらかで飲みやすい一杯です。",
          en: "The signature order is the Streamer Latte (around ¥580). If it is your first visit, start there. The mug is American-sized, and the baristas pour simple, beautiful latte art. The steamed milk is more generous than usual, which makes it smooth and easy to drink.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer7.jpg", alt: "Streamer Latte with latte art" },
      {
        text: {
          ja: "こちらは Military Latte。抹茶ラテにホワイトチョコレートを合わせ、迷彩柄に注がれています。",
          en: "This one below is the Military Latte — Streamer's matcha latte with white chocolate, poured in a camouflage pattern.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer8.jpg", alt: "Military Latte" },
      { img: "/tokyo/streamer-coffee/streamer10.jpg", alt: "Menu board" },
      {
        text: {
          ja: "コーヒー以外のメニュー(タイティー、ココア、ジュース)もあるので、コーヒーが苦手な友達と来ても大丈夫。無料Wi-Fi(「Tourist WIFI @ STREAMER」、パスワードはスタッフに聞いてください)と電源は自分にとって大事です。カフェでコードを書いたり絵を描いたりするのが、好きな時間の過ごし方だから。おいしいラテとバスケットゴールとWi-Fi。このカフェには、必要なものがだいたい揃っています。ぜひ行ってみてください。",
          en: "There are plenty of non-coffee options too — Thai tea, cocoa, juice — so you can bring friends who do not drink coffee. The free wifi (\"Tourist WIFI @ STREAMER\", ask the staff for the password) and the outlets matter to me, because writing code and drawing in cafes is one of my favorite ways to spend a day. A good latte, a basketball hoop and wifi: this cafe covers most of my essentials. So — try Streamer Coffee Company.",
        },
      },
      { img: "/tokyo/streamer-coffee/streamer6.jpg", alt: "Working from the cafe" },
    ],
    notes: [
      { ja: "週末、特にランチタイムは混み合います。", en: "Weekends get crowded, especially around lunch." },
      { ja: "トイレの鍵は大きめです。スタッフに声をかけてください。", en: "The restroom key is a big one — ask the staff." },
    ],
  },
  {
    slug: "ryzm",
    no: "02",
    kind: { ja: "バスケットボールショップ / ブランド", en: "Basketball shop / brand" },
    title: "RYZM",
    area: "Komazawa-Daigaku",
    meta: [
      { p: ":station", v: { ja: "駒沢大学", en: "Komazawa-Daigaku" } },
      { p: ":open", v: { ja: "12:00 – 18:00(水曜定休)", en: "12:00 – 18:00 (closed Wednesdays)" } },
      { p: ":address", v: { ja: "東京都世田谷区駒沢5-17-13", en: "5-17-13 Komazawa, Setagaya-ku, Tokyo" } },
      { p: ":site", v: { ja: "ryzm.net ↗", en: "ryzm.net ↗" }, href: "http://ryzm.net/" },
    ],
    blocks: [
      {
        text: {
          ja: "2本目の記事は、駒沢の RYZM。オリジナルブランドも作っているバスケットボールショップです。",
          en: "For the second article, RYZM in Komazawa — a basketball shop that also makes its own brand.",
        },
      },
      { img: "/tokyo/ryzm/ryzm13.jpg", alt: "RYZM storefront" },
      {
        text: {
          ja: "駒沢大学駅から歩いて10〜15分、駒沢オリンピック公園のすぐ近くです。道中の駒沢公園通りにはカフェや雑貨屋が並んでいて、買い物やランチがてら歩くのがおすすめ。時間があれば、公園もひと回りしてみてください。",
          en: "It is a 10-15 minute walk from Komazawa-Daigaku station, close to Komazawa Olympic Park. The street on the way, Komazawa Park Avenue, is lined with cafes and zakka stores — worth wandering for lunch before or after, and if you have time, take a loop around the park itself.",
        },
      },
      { img: "/tokyo/ryzm/ryzm12.jpg", alt: "Komazawa Park Avenue" },
      {
        text: {
          ja: "自分のバスケ人生は、ここから始まりました。駒沢公園で15年プレーしてきて、バスケのワードローブはずっと RYZM と一緒に変わってきました。思い出の詰まった場所です。",
          en: "My basketball life started here: I have been playing at Komazawa Park for fifteen years, and my basketball wardrobe has grown and changed alongside RYZM. This is a place with real memories for me.",
        },
      },
      { img: "/tokyo/ryzm/ryzm14.jpg", alt: "Inside the shop" },
      {
        text: {
          ja: "店内は広くはないけれど、ぎっしり。RYZM のオリジナルブランドに加えて、AKTR と AAA(AKTR All Activity)、ヴィンテージの輸入物を扱っています。まずはひと通り眺めて、気になることがあればオーナーのヒロタさんに話しかけてみてください。本当にフレンドリーな方です。",
          en: "The shop is not large, but it is packed. RYZM mainly carries its own brand, plus AKTR and AAA (AKTR All Activity) and vintage imports. Look around first — and if you have any questions, talk to the owner, Hirota-san. He is genuinely friendly.",
        },
      },
      { h: { ja: "トップス / ショーツ", en: "Tops / Shorts" } },
      {
        text: {
          ja: "RYZM で一番のお気に入りは、ゲームショーツとトップス。ツートーンの配色は何にでも合わせやすく、乾きも速い。毎シーズン新しい色の組み合わせが出ます。自分は5セット以上持っています。",
          en: "My favorite RYZM items are the game shorts and tops. The two-tone colorways go with almost anything, they dry quickly, and new color combinations come out every season. I own more than five sets.",
        },
      },
      { img: "/tokyo/ryzm/ryzm4.jpg", alt: "RYZM game shorts and tops" },
      { h: { ja: "バスケン", en: "Basuken" } },
      {
        text: {
          ja: "バスケン(バスケットボール犬)は、RYZM のオリジナルキャラクターです。",
          en: "Basuken, the basketball dog, is RYZM's original character.",
        },
      },
      { img: "/tokyo/ryzm/ryzm11.jpg", alt: "Basuken, the basketball dog" },
      { h: { ja: "AKTR", en: "AKTR" } },
      {
        text: {
          ja: "あわせて AKTR もきちんと紹介させてください。バスケだけでなくライフスタイルウェアまでカバーする日本のブランドで、RYZM は姉妹ラインの AAA を扱う数少ない店のひとつです。シャツやジャケットなどもあり、AAA のシャツは自分のお気に入り。デザインだけでなく品質も確かです。AKTR が気になったら、RYZM で試してみてください。",
          en: "I also want to introduce AKTR properly. It is a Japanese brand that covers not just basketball but lifestyle wear, and RYZM is one of the few shops carrying AAA, its sister line — shirts, jackets and more. The AAA shirts are my favorite, and the quality matches the design. If AKTR interests you, RYZM is the place to try it on.",
        },
      },
      { img: "/tokyo/ryzm/ryzm10.jpg", alt: "AKTR items in the shop" },
      { img: "/tokyo/ryzm/ryzm8.jpg", alt: "More AKTR and AAA pieces" },
      { img: "/tokyo/ryzm/ryzm1.jpg", alt: "RYZM" },
    ],
    notes: [
      {
        ja: "不定休で閉まっていることがあります。行く前にFacebookページで確認するか、直接聞いてみてください。",
        en: "RYZM sometimes closes irregularly — check or ask on their Facebook page before you go.",
      },
    ],
  },
  {
    slug: "h-tokyo",
    no: "03",
    kind: { ja: "ハンカチ専門店 / ブランド", en: "Handkerchief shop / brand" },
    title: "H TOKYO",
    area: "Sangen-Jaya",
    meta: [
      { p: ":station", v: { ja: "三軒茶屋 / 池尻大橋", en: "Sangen-Jaya / Ikejiri-Ohashi" } },
      { p: ":open", v: { ja: "12:00 – 20:00(水曜定休)", en: "12:00 – 20:00 (closed Wednesdays)" } },
      { p: ":address", v: { ja: "東京都世田谷区太子堂1-11-11", en: "1-11-11 Taishido, Setagaya-ku, Tokyo" } },
      { p: ":site", v: { ja: "htokyo.com ↗", en: "htokyo.com ↗" }, href: "http://www.htokyo.com" },
    ],
    blocks: [
      {
        text: {
          ja: "3本目の記事は、三軒茶屋の H TOKYO。ハンカチだけを扱う、粋な専門店です。",
          en: "For the third article, H TOKYO in Sangen-Jaya — a stylish shop dedicated entirely to handkerchiefs.",
        },
      },
      { img: "/tokyo/h-tokyo/htokyo2.jpg", alt: "H TOKYO storefront" },
      {
        text: {
          ja: "三軒茶屋駅か池尻大橋駅から歩いて10〜15分、三宿通り沿いにあります。道中にはレストランやバー、カフェ、雑貨屋、それに世田谷公園。駅からは少し歩きますが、その道のり自体が楽しいエリアです。",
          en: "It is a 10-15 minute walk from Sangen-Jaya or Ikejiri-Ohashi station, on Mishuku street, with restaurants, bars, cafes and Setagaya Park along the way. A little far from the station, but the walk itself is a good one.",
        },
      },
      { img: "/tokyo/h-tokyo/htokyo3.jpg", alt: "On the way along Mishuku street" },
      { h: { ja: "ハンカチ", en: "Handkerchiefs" } },
      {
        text: {
          ja: "驚くことに、店内には常時200枚以上のハンカチが並んでいます。日本の生地、輸入生地、ヴィンテージの生地。柄はフォーマルからカジュアルまであり、すべて日本で縫製されています。お土産にもぴったり。少量生産で入れ替わりが速く、来るたびに新しい一枚に出会えます。通い続けるお客さんが多い理由は、たぶんそこです。",
          en: "Amazingly, the shop displays over 200 handkerchiefs at any time — Japanese fabrics, imports, vintage cloth — with patterns running from formal to casual, all sewn in Japan. They make excellent souvenirs. Production runs are small and turnover is fast: every time I visit, there is something new. I suspect that is exactly why people keep coming back.",
        },
      },
      { img: "/tokyo/h-tokyo/htokyo4.jpg", alt: "Rows of handkerchiefs" },
      { img: "/tokyo/h-tokyo/htokyo5.jpg", alt: "Patterns from formal to casual" },
      { h: { ja: "トランクス / 靴下", en: "Trunks / Socks" } },
      {
        text: {
          ja: "ハンカチだけではありません。トランクスや靴下といったアイテムも作っています。",
          en: "Handkerchiefs are not the whole story — they also make trunks and socks, for example.",
        },
      },
      { img: "/tokyo/h-tokyo/htokyo6.jpg", alt: "Trunks and socks" },
      { h: { ja: "刺繍", en: "Embroidery" } },
      {
        text: {
          ja: "店内では刺繍のサービスも頼めます。たとえば名前の刺繍(別料金)。",
          en: "There is an in-shop embroidery service — name embroidery, for instance, for a small extra fee.",
        },
      },
      { img: "/tokyo/h-tokyo/htokyo7.jpg", alt: "Embroidery samples" },
      {
        text: {
          ja: "今回はこのシンプルな柄を買いました。1,296円。",
          en: "This time I picked up this simple pattern — ¥1,296.",
        },
      },
      { img: "/tokyo/h-tokyo/htokyo9.jpg", alt: "The handkerchief I bought" },
      {
        text: {
          ja: "H TOKYO なら、きっとお気に入りの一枚に出会えるはずです。",
          en: "I promise you will meet your handkerchief at H TOKYO.",
        },
      },
      { img: "/tokyo/h-tokyo/htokyo10.jpg", alt: "H TOKYO" },
    ],
  },
];

export const tokyoArticleBySlug = Object.fromEntries(TOKYO_ARTICLES.map((a) => [a.slug, a]));
