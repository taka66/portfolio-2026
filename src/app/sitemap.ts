import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const routes = ["", "/works", "/design", "/story"];

  // The default locale (ja) is served without a prefix; en lives under /en.
  return routes.flatMap((route) => {
    const alternates = {
      languages: {
        ja: `${baseUrl}${route}`,
        en: `${baseUrl}/en${route}`,
      },
    };
    const shared = {
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates,
    };

    return [
      { url: `${baseUrl}${route}`, ...shared },
      { url: `${baseUrl}/en${route}`, ...shared },
    ];
  });
}
