import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/movie", "/tv", "/person", "/movie/", "/tv/"],
        disallow: [
          "/search*",
          "/*?*",
          "/movie/*/casts*",
          "/movie/*/recommendation*",
        ],
      },
    ],
  };
}
