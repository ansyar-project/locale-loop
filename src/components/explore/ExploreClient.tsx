"use client";

import { useState } from "react";
import { searchLoops } from "@/lib/actions/searchActions";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Filter,
  X,
  MapPin,
  TrendingUp,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react";
import LoopCard from "@/components/LoopCard";

type Loop = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  city: string;
  tags: string[];
  image?: string | null;
  published: boolean;
  slug: string;
  coverImage?: string | null;
  user: {
    name: string | null;
    id: string;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
    places: number;
  };
};

interface ExploreClientProps {
  initialLoops: Loop[];
  initialCities: string[];
  initialTags: string[];
}

export default function ExploreClient({
  initialLoops,
  initialCities,
  initialTags,
}: ExploreClientProps) {
  const [loops, setLoops] = useState<Loop[]>(initialLoops);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [cities] = useState<string[]>(initialCities);
  const [availableTags] = useState<string[]>(initialTags);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const result = await searchLoops({
      query: searchQuery,
      city: selectedCity,
      tags: selectedTags,
      sortBy: sortBy as "newest" | "oldest" | "most-liked" | "most-commented",
    });

    if (result.success) {
      setLoops(
        result.loops.map((loop) => ({
          ...loop,
          coverImage: loop.coverImage ?? null,
        }))
      );
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedTags([]);
    setSortBy("newest");
    setLoops(initialLoops); // Reset to initial data
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCity,
    selectedTags.length > 0,
    sortBy !== "newest",
  ].filter(Boolean).length;

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: Clock },
    { value: "oldest", label: "Oldest First", icon: Clock },
    { value: "most-liked", label: "Most Liked", icon: Heart },
    { value: "most-commented", label: "Most Discussed", icon: MessageCircle },
  ];

  return (
    <>
      {/* Search & Filters Section */}
      <div className="bg-white shadow-lg border-t-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for destinations, activities, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900 font-medium"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSearch}
                disabled={loading}
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-6 border-2"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Options
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {availableTags.slice(0, 8).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag)
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Clear all filters
                </button>
                <Button onClick={handleSearch} className="px-6">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-xl text-gray-600">
              Discovering amazing loops...
            </p>
          </div>
        ) : loops.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No loops found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn&apos;t find any travel loops matching your criteria. Try
              adjusting your search terms or filters.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters & Browse All
            </Button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loops.length} Travel {loops.length === 1 ? "Loop" : "Loops"}{" "}
                  Found
                </h2>
                <p className="text-gray-600 mt-1">
                  Discover your next adventure from our curated collection
                </p>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      &quot;{searchQuery}&quot;
                    </span>
                  )}
                  {selectedCity && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedCity}
                    </span>
                  )}
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>{" "}
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loops.map((loop) => {
                // Transform the data to match LoopCard's expected interface
                const loopCardData = {
                  ...loop,
                  coverImage: loop.coverImage ?? loop.image ?? null,
                  description: loop.description || null,
                };

                return (
                  <div
                    key={loop.id}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <LoopCard loop={loopCardData} />
                  </div>
                );
              })}
            </div>
            {/* Load More Button (for future pagination) */}
            {loops.length >= 12 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8">
                  Load More Loops
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
