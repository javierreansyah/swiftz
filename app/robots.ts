import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/discover", "/genres", "/popular", "/trending", "/movie/"],
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
