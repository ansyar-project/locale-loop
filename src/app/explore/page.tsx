// Enhanced Explore Page with Modern Styling and SEO
import { Metadata } from "next";
import { searchLoops, getFilterOptions } from "@/lib/actions/searchActions";
import ExploreHero from "@/components/explore/ExploreHero";
import ExploreClient from "@/components/explore/ExploreClient";

export const metadata: Metadata = {
  title: "Explore Local Guides",
  description:
    "Discover curated city guides from locals around the world. Browse by city, interests, and popular destinations to find your perfect travel experience.",
  keywords: [
    "explore travel guides",
    "city exploration",
    "local recommendations",
    "travel discovery",
    "destination guides",
  ],
  openGraph: {
    title: "Explore Local Guides | LocaleLoop",
    description:
      "Discover curated city guides from locals around the world. Browse by city, interests, and popular destinations.",
    type: "website",
  },
};

export default async function ExplorePage() {
  // Fetch initial data on the server
  const [loopsResult, filterOptionsResult] = await Promise.all([
    searchLoops({ sortBy: "newest", limit: 12 }),
    getFilterOptions(),
  ]);

  const initialLoops = loopsResult.success ? loopsResult.loops : [];
  const initialCities = filterOptionsResult.success
    ? filterOptionsResult.cities
    : [];
  const initialTags = filterOptionsResult.success
    ? filterOptionsResult.tags
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ExploreHero />
      <ExploreClient
        initialLoops={initialLoops}
        initialCities={initialCities}
        initialTags={initialTags}
      />
    </div>
  );
}
