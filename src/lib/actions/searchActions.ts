// Add to /lib/actions/searchActions.ts
"use server";

import { prisma } from "@/lib/utils/prisma";
import { Prisma } from "@/generated/prisma";

export async function searchLoops({
  query = "",
  city = "",
  tags = [],
  sortBy = "newest",
  page = 1,
  limit = 12,
}: {
  query?: string;
  city?: string;
  tags?: string[];
  sortBy?: "newest" | "oldest" | "most-liked" | "most-commented";
  page?: number;
  limit?: number;
}) {
  try {
    // Build the where clause properly
    const whereConditions: Prisma.LoopWhereInput[] = [];

    if (query) {
      whereConditions.push({
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: [query] } },
        ],
      });
    }

    if (city) {
      whereConditions.push({
        city: { equals: city, mode: "insensitive" },
      });
    }

    if (tags.length > 0) {
      whereConditions.push({
        tags: { hasSome: tags },
      });
    }

    const where: Prisma.LoopWhereInput = {
      published: true,
      AND: whereConditions.length > 0 ? whereConditions : undefined,
    };

    const orderBy: Prisma.LoopOrderByWithRelationInput = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      "most-liked": { likes: { _count: "desc" } },
      "most-commented": { comments: { _count: "desc" } },
    }[sortBy] as Prisma.LoopOrderByWithRelationInput;

    const [loops, total] = await Promise.all([
      prisma.loop.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          _count: {
            select: { likes: true, comments: true, places: true },
          },
        },
      }),
      prisma.loop.count({ where }),
    ]);

    return {
      success: true,
      loops,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Search loops error:", error);
    return {
      success: false,
      loops: [],
      pagination: { page: 1, limit, total: 0, pages: 0 },
    };
  }
}

export async function getFilterOptions() {
  try {
    const [cities, tags] = await Promise.all([
      prisma.loop.findMany({
        where: { published: true },
        select: { city: true },
        distinct: ["city"],
      }),
      prisma.loop.findMany({
        where: { published: true },
        select: { tags: true },
      }),
    ]);

    const allTags = tags.flatMap((loop) => loop.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    return {
      success: true,
      cities: cities
        .map((c) => c.city)
        .filter(Boolean)
        .sort(),
      tags: uniqueTags,
    };
  } catch (error) {
    console.error("Get filter options error:", error);
    return {
      success: false,
      cities: [],
      tags: [],
    };
  }
}
