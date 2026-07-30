import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.kampstamping.in";
  return [
    "",
    "/services/",
    "/products/",
    "/about-us/",
    "/resources/",
    "/resources/copper-buying-guide/",
    "/resources/aluminium-buying-guide/",
    "/contact/",
  ].map((path, index) => ({
    url: `${base}${path}`,
    changeFrequency: index === 0 ? "monthly" : "yearly",
    priority: index === 0 ? 1 : path.includes("buying-guide") ? 0.5 : path === "/resources/" ? 0.6 : 0.8,
  }));
}
