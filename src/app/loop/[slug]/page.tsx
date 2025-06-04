import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
  MessageCircleIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import { LikeButton } from "@/components/ui/LikeButton";
import { Comments } from "@/components/ui/Comments";
import { getComments } from "@/lib/actions/commentActions";
import { calculateLoopMetrics } from "@/lib/actions/loopCalculations";
import { StructuredData } from "@/components/ui/StructuredData";

interface LoopPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: LoopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const loop = await db.loops.getBySlug(slug);

  if (!loop) {
    return {
      title: "Loop Not Found",
    };
  }


  return {
    title: `${loop.title} - ${loop.city}`,
    description:
      loop.description ||
      `Discover ${loop.city} through this curated local guide featuring ${
        loop.places?.length || 0
      } handpicked places by ${loop.user.name}.`,
    keywords: [
      loop.city,
      "local guide",
      "travel guide",
      ...loop.tags,
      loop.user.name || "",
    ].filter(Boolean),
    authors: [{ name: loop.user.name || "LocaleLoop User" }],
    openGraph: {
      title: `${loop.title} - ${loop.city} | LocaleLoop`,
      description:
        loop.description ||
        `Discover ${loop.city} through this curated local guide`,
      type: "article",
      publishedTime: loop.createdAt.toISOString(),
      modifiedTime: loop.updatedAt.toISOString(),
      authors: [loop.user.name || "LocaleLoop User"],
      images: loop.coverImage
        ? [
            {
              url: loop.coverImage,
              width: 1200,
              height: 630,
              alt: `${loop.title} - ${loop.city}`,
            },
          ]
        : [
            {
              url: `/api/og?title=${encodeURIComponent(
                loop.title
              )}&description=${encodeURIComponent(
                `Discover ${loop.city} through this curated local guide`
              )}`,
              width: 1200,
              height: 630,
              alt: `${loop.title} - ${loop.city}`,
            },
          ],
      locale: "en_US",
      siteName: "LocaleLoop",
    },
    twitter: {
      card: "summary_large_image",
      title: `${loop.title} - ${loop.city}`,
      description:
        loop.description ||
        `Discover ${loop.city} through this curated local guide`,
      images: loop.coverImage ? [loop.coverImage] : [],
    },
    alternates: {
      canonical: `/loop/${slug}`,
    },
  };
}

export default async function LoopPage({ params }: LoopPageProps) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  // Get the loop with all related data
  const loop = await db.loops.getBySlug(resolvedParams.slug);

  if (!loop || !loop.published) {
    notFound();
  }
  // Get places and comments for this loop
  const [places, commentsResult] = await Promise.all([
    db.places.getByLoopId(loop.id),
    getComments(loop.id),
  ]);
  // Calculate loop metrics based on places
  const loopMetrics = calculateLoopMetrics(
    places.map((place) => ({
      ...place,
      image: place.image === null ? undefined : place.image,
      address: place.address === null ? undefined : place.address,
      latitude: place.latitude === null ? undefined : place.latitude,
      longitude: place.longitude === null ? undefined : place.longitude,
    }))
  );
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Structured Data */}
      <StructuredData
        type="article"
        data={{
          title: loop.title,
          description: loop.description,
          author: {
            name: loop.user.name ?? undefined,
            image: loop.user.image ?? undefined,
          },
          datePublished: loop.createdAt.toISOString(),
          dateModified: loop.updatedAt.toISOString(),
          url: `${baseUrl}/loop/${loop.slug}`,
          baseUrl,
          image: loop.coverImage,
          keywords: loop.tags,
          place: loop.city,
        }}
      />
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gray-900 overflow-hidden">
        {loop.coverImage ? (
          <Image
            src={loop.coverImage}
            alt={loop.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-green-500" />
        )}

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

        {/* Back button - positioned absolutely */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="font-medium">Back to loops</span>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
            <div className="text-white max-w-4xl">
              {/* Tags */}
              {loop.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {loop.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30"
                    >
                      <TagIcon className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {loop.title}
              </h1>{" "}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-white/25 backdrop-blur-md rounded-xl px-5 py-4 border border-white/30 shadow-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <MapPinIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80 uppercase tracking-wide font-medium mb-1">
                      Location
                    </p>
                    <p className="font-bold text-white text-lg">{loop.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/25 backdrop-blur-md rounded-xl px-5 py-4 border border-white/30 shadow-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80 uppercase tracking-wide font-medium mb-1">
                      Created by
                    </p>
                    <p className="font-bold text-white text-lg">
                      {loop.user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/25 backdrop-blur-md rounded-xl px-5 py-4 border border-white/30 shadow-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80 uppercase tracking-wide font-medium mb-1">
                      Published
                    </p>
                    <p className="font-bold text-white text-lg">
                      {new Date(loop.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
                {loop.description}
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Places List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Places Section Header */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Places in this loop
                  </h2>
                  <p className="text-gray-600">
                    {places.length} carefully curated{" "}
                    {places.length === 1 ? "location" : "locations"} to explore
                  </p>
                </div>
              </div>{" "}
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {places.length}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    Places
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {loopMetrics.estimatedDuration}
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    Duration
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-lg font-bold text-purple-600 leading-tight">
                    {loopMetrics.recommendedTransport}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Best way
                  </div>
                </div>
              </div>
            </div>
            {/* Places Cards */}
            <div className="space-y-6">
              {places.map((place, index) => (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="md:flex">
                    {/* Place Image */}
                    <div className="md:w-2/5 relative">
                      <div className="relative h-64 md:h-full">
                        {place.image ? (
                          <Image
                            src={place.image}
                            alt={place.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-green-400 flex items-center justify-center">
                            <MapPinIcon className="w-12 h-12 text-white opacity-50" />
                          </div>
                        )}
                        {/* Step number */}
                        <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                          {index + 1}
                        </div>
                        {/* Category badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                            {place.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Place Content */}
                    <div className="md:w-3/5 p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {place.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <ClockIcon className="w-4 h-4" />
                            <span>
                              Stop {index + 1} of {places.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {place.description}
                      </p>

                      {place.address && (
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                          <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Address
                            </p>
                            <p className="text-gray-600">{place.address}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <Button
                          asChild
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <a
                            href={place.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2"
                          >
                            <ExternalLinkIcon className="w-4 h-4" />
                            View on Maps
                          </a>
                        </Button>
                        {index < places.length - 1 && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <span>Next:</span>
                            <span className="font-medium">
                              {places[index + 1].name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>{" "}
            {/* Comments Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Comments
                loopId={loop.id}
                initialComments={
                  commentsResult.success
                    ? commentsResult.comments.map((comment) => ({
                        ...comment,
                        createdAt:
                          typeof comment.createdAt === "string"
                            ? comment.createdAt
                            : comment.createdAt.toISOString(),
                        updatedAt:
                          typeof comment.updatedAt === "string"
                            ? comment.updatedAt
                            : comment.updatedAt.toISOString(),
                      }))
                    : []
                }
              />
            </div>
          </div>{" "}
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Loop Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Loop Stats
                  </h3>
                  <p className="text-gray-600">Engagement overview</p>
                </div>
              </div>

              <div className="space-y-6">
                {" "}
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <MapPinIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {places.length}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Places
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ClockIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {loopMetrics.estimatedDuration}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Duration
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center border border-red-200">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <HeartIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-red-700">
                      {loop._count?.likes || 0}
                    </div>
                    <div className="text-sm text-red-600 font-medium">
                      Likes
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <StarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {loopMetrics.difficulty}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">
                      Difficulty
                    </div>
                  </div>
                </div>
                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <MessageCircleIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      {loop._count?.comments || 0}
                    </div>
                    <div className="text-sm text-orange-600 font-medium">
                      Comments
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center border border-indigo-200">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {new Date(loop.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                    <div className="text-sm text-indigo-600 font-medium">
                      Created
                    </div>
                  </div>
                </div>
                {/* Creator Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Created by
                  </h4>
                  <Link
                    href={`/profile/${loop.user.name}`}
                    className="block group"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                      <div className="flex items-center gap-4">
                        {loop.user.image ? (
                          <Image
                            src={loop.user.image}
                            alt={loop.user.name || "User"}
                            width={56}
                            height={56}
                            className="rounded-2xl border-2 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center border-2 border-white shadow-md">
                            <UserIcon className="w-7 h-7 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {loop.user.name}
                          </p>
                          <p className="text-sm text-gray-600">Loop Creator</p>
                          <div className="flex items-center gap-1 mt-1">
                            <ExternalLinkIcon className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-600 font-medium">
                              View Profile
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* Action Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions
                  </h4>
                  <div className="space-y-3">
                    <LikeButton
                      loopId={loop.id}
                      initialLiked={false} // We'll implement this logic
                      initialCount={loop._count?.likes || 0}
                      userId={session?.user?.id}
                    />
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                      asChild
                    >
                      <a
                        href={`https://maps.google.com/maps?q=${encodeURIComponent(
                          loop.city
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        Explore {loop.city}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
