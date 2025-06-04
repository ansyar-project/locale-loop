"use client";

interface BaseData {
  url?: string;
  baseUrl?: string;
}

type WebsiteData = BaseData;

interface ArticleData extends BaseData {
  title?: string;
  description?: string;
  author?: {
    name?: string;
    image?: string;
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
  place?: string;
}

interface PersonData extends BaseData {
  name?: string;
  image?: string;
  description?: string;
  expertise?: string[];
}

interface OrganizationData extends BaseData {
  socialMedia?: string[];
}

type StructuredDataType = {
  website: WebsiteData;
  article: ArticleData;
  person: PersonData;
  organization: OrganizationData;
};

interface StructuredDataProps<T extends keyof StructuredDataType> {
  type: T;
  data: StructuredDataType[T];
}

export function StructuredData<T extends keyof StructuredDataType>({
  type,
  data,
}: StructuredDataProps<T>) {
  let structuredData;
  switch (type) {
    case "website":
      const websiteData = data as WebsiteData;
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "LocaleLoop",
        description: "Curated city guides by locals",
        url: websiteData.url || "https://localeloop.com",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${
              websiteData.url || "https://localeloop.com"
            }/explore?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        author: {
          "@type": "Organization",
          name: "LocaleLoop",
        },
      };
      break;

    case "article":
      const articleData = data as ArticleData;
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: articleData.title,
        description: articleData.description,
        author: {
          "@type": "Person",
          name: articleData.author?.name,
          image: articleData.author?.image,
        },
        publisher: {
          "@type": "Organization",
          name: "LocaleLoop",
          logo: {
            "@type": "ImageObject",
            url: `${articleData.baseUrl}/favicon.ico`,
          },
        },
        datePublished: articleData.datePublished,
        dateModified: articleData.dateModified,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleData.url,
        },
        image: articleData.image ? [articleData.image] : [],
        articleSection: "Travel Guide",
        keywords: articleData.keywords?.join(", "),
        about: {
          "@type": "Place",
          name: articleData.place,
        },
      };
      break;

    case "person":
      const personData = data as PersonData;
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: personData.name,
        image: personData.image,
        description: personData.description,
        url: personData.url,
        knowsAbout: personData.expertise || [
          "Travel",
          "Local Culture",
          "City Guides",
        ],
        hasOccupation: {
          "@type": "Occupation",
          name: "Local Guide Creator",
        },
      };
      break;

    case "organization":
      const organizationData = data as OrganizationData;
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "LocaleLoop",
        description:
          "A platform for locals to share curated city guides and authentic travel experiences",
        url: organizationData.url,
        logo: `${organizationData.url}/favicon.ico`,
        sameAs: organizationData.socialMedia || [],
        foundingDate: "2024",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          email: "hello@localeloop.com",
        },
      };
      break;

    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
