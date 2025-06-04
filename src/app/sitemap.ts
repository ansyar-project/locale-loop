import { MetadataRoute } from "next";
import { prisma } from "@/lib/utils/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    // Get all published loops with more data
    const loops = await prisma.loop.findMany({
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
        featured: true,
      },
      where: {
        published: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Get all user profiles that have loops
    const users = await prisma.user.findMany({
      select: {
        name: true,
        updatedAt: true,
        _count: {
          select: { loops: true },
        },
      },
      where: {
        loops: {
          some: {
            published: true,
          },
        },
      },
    });

    // Static pages with different priorities and change frequencies
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/explore`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.3,
      },
    ];

    // Dynamic loop pages with higher priority for featured loops
    const loopPages = loops.map((loop) => ({
      url: `${baseUrl}/loop/${loop.slug}`,
      lastModified: loop.updatedAt,
      changeFrequency: "weekly" as const,
      priority: loop.featured ? 0.9 : 0.8,
    }));

    // Dynamic user profile pages with priority based on number of loops
    const userPages = users
      .filter((user) => user.name)
      .map((user) => ({
        url: `${baseUrl}/profile/${encodeURIComponent(user.name!)}`,
        lastModified: user.updatedAt,
        changeFrequency: "weekly" as const,
        priority: user._count.loops > 5 ? 0.7 : 0.6,
      }));

    return [...staticPages, ...loopPages, ...userPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return basic sitemap if database query fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/explore`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ];
  }
}
