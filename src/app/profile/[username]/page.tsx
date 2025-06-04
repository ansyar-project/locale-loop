// Create /app/profile/[username]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/utils/prisma";
import { UserIcon,  CalendarIcon } from "lucide-react";
import Image from "next/image";
import LoopCard from "@/components/LoopCard";
import { StructuredData } from "@/components/ui/StructuredData";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedUsername = decodeURIComponent(resolvedParams.username);

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: decodedUsername,
        mode: "insensitive",
      },
    },
    include: {
      _count: {
        select: { loops: true },
      },
    },
  });

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name} - Local Guide Creator`,
    description: `Explore local guides created by ${user.name}. Discover ${user._count.loops} curated city experiences and authentic local recommendations.`,
    keywords: [
      user.name || "",
      "local guide creator",
      "travel recommendations",
      "city guides",
      "local experiences",
    ].filter(Boolean),
    openGraph: {
      title: `${user.name} - Local Guide Creator | LocaleLoop`,
      description: `Explore local guides created by ${user.name}`,
      type: "profile",
      images: user.image
        ? [
            {
              url: user.image,
              width: 400,
              height: 400,
              alt: `${user.name}'s profile`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary",
      title: `${user.name} - Local Guide Creator`,
      description: `Explore local guides created by ${user.name}`,
      images: user.image ? [user.image] : [],
    },
    alternates: {
      canonical: `/profile/${encodeURIComponent(user.name || "")}`,
    },
  };
}

// interface ProfilePageProps {
//   params: { username: string };
// }

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;

  // Decode the URL-encoded username
  const decodedUsername = decodeURIComponent(resolvedParams.username);

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: decodedUsername,
        mode: "insensitive",
      },
    },
    include: {
      loops: {
        where: { published: true },
        include: {
          _count: {
            select: { likes: true, comments: true, places: true },
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          loops: { where: { published: true } },
          likes: true,
          comments: true,
        },
      },
    },
  });
  if (!user) {
    notFound();
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <StructuredData
        type="person"
        data={{
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          description: `Local guide creator with ${user._count.loops} curated city experiences`,
          url: `${baseUrl}/profile/${encodeURIComponent(user.name || "")}`,
          expertise: ["Travel", "Local Culture", "City Guides"],
        }}
      />{" "}
      {/* Profile Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
            )}

            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {user.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-gray-600">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 mt-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {user._count.loops}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Loops</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {user._count.likes}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Likes Given
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {user._count.comments}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Comments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* User's Loops */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
          {user.name}&apos;s Loops ({user.loops.length})
        </h2>

        {user.loops.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500">No public loops yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {user.loops.map((loop) => (
              <LoopCard key={loop.id} loop={loop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
