import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const alternates = {
    languages: {
      ar: "https://www.remed.tn/ar",
      fr: "https://www.remed.tn/fr",
      en: "https://www.remed.tn/en",
    },
  } as const;

  return [
    {
      url: "https://www.remed.tn/ar",
      lastModified,
      changeFrequency: "daily",
      priority: 1,
      alternates,
    },
    {
      url: "https://www.remed.tn/fr",
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
      alternates,
    },
    {
      url: "https://www.remed.tn/en",
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
      alternates,
    },
  ];
}
