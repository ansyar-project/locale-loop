// Create /components/LoopCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import {
  UserIcon,
  HeartIcon,
  MessageCircleIcon,
  MapPinIcon,
} from "lucide-react";

interface LoopCardProps {
  loop: {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    city: string;
    coverImage: string | null;
    tags: string[];
    createdAt: Date;
    featured?: boolean;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    _count: {
      likes: number;
      comments: number;
      places: number;
    };
  };
  compact?: boolean;
}

export default function LoopCard({ loop, compact = false }: LoopCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Cover Image - Make this clickable to loop */}
      <Link href={`/loop/${loop.slug}`} className="block">
        <div
          className={`relative ${
            compact ? "h-32 sm:h-40" : "h-40 sm:h-52"
          } bg-gray-200 overflow-hidden`}
        >
          {loop.coverImage ? (
            <Image
              src={loop.coverImage}
              alt={loop.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-green-500" />
          )}
          {loop.featured && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
              <span className="px-2 py-1 sm:px-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs font-semibold rounded-full shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      <div className="p-4 sm:p-5">
        {" "}
        {/* Title - Make this clickable to loop */}
        <Link href={`/loop/${loop.slug}`} className="block mb-2 sm:mb-3">
          <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors text-base sm:text-lg leading-tight">
            {loop.title}
          </h3>
        </Link>
        {/* Location */}
        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0" />
          <span className="font-medium truncate">{loop.city}</span>
          <span className="mx-1 sm:mx-2 text-gray-300">•</span>
          <span className="whitespace-nowrap">{loop._count.places} places</span>
        </div>{" "}
        {/* Description */}
        {loop.description && !compact && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-3 sm:mb-4 leading-relaxed">
            {loop.description}
          </p>
        )}
        {/* Author and Stats - Separate links */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Author Link - Separate clickable area */}
          <Link
            href={`/profile/${encodeURIComponent(loop.user.name || "")}`}
            className="flex items-center text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium min-w-0"
            onClick={(e) => e.stopPropagation()} // Prevent event bubbling
          >
            <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
            <span className="truncate">{loop.user.name}</span>
          </Link>

          {/* Stats - Not clickable */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
            <div className="flex items-center hover:text-red-500 transition-colors">
              <HeartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
              <span className="font-medium">{loop._count.likes}</span>
            </div>
            <div className="flex items-center hover:text-blue-500 transition-colors">
              <MessageCircleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
              <span className="font-medium">{loop._count.comments}</span>
            </div>
          </div>
        </div>{" "}
        {/* Tags */}
        {loop.tags.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {loop.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100"
              >
                {tag}
              </span>
            ))}
            {loop.tags.length > 3 && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{loop.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
