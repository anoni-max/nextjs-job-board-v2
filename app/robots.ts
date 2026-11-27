import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/login",
        "/api/",
        "/profile",
        "/matches",
        "/alerts",
        "/notifications",
        "/dashboard",
      ],
    },
    sitemap: "https://www.kazispot.com/sitemap.xml",
  };
}
