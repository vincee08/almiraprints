import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  noIndex = false,
  canonicalUrl,
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      images: [image],
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
  };
}

export function generateStructuredData(type: "Organization" | "WebSite" | "Service", data: any) {
  const baseData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "Organization":
      return {
        ...baseData,
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/logo.png`,
        ...data,
      };

    case "WebSite":
      return {
        ...baseData,
        "@type": "WebSite",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        ...data,
      };

    case "Service":
      return {
        ...baseData,
        "@type": "Service",
        provider: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
        },
        ...data,
      };

    default:
      return baseData;
  }
}
