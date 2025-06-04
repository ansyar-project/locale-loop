import { prisma } from "./prisma";
import { Role, Prisma } from "@/generated/prisma";

// ========== USER OPERATIONS ==========

export const userOperations = {
  // Create user
  create: async (data: {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role?: Role;
  }) => {
    return await prisma.user.create({
      data: {
        ...data,
        role: data.role || Role.USER,
      },
    });
  },

  // Get user by ID
  getById: async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        loops: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            loops: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  },

  // Get user by email
  getByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Update user
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      image?: string;
    }
  ) => {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  // Delete user
  delete: async (id: string) => {
    return await prisma.user.delete({
      where: { id },
    });
  },

  // Get all users (admin only)
  getAll: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              loops: true,
              comments: true,
            },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
};

// ========== LOOP OPERATIONS ==========

export const loopOperations = {
  // Create loop
  create: async (data: {
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    city: string;
    tags: string[];
    userId: string;
    featured?: boolean;
    published?: boolean;
  }) => {
    return await prisma.loop.create({
      data: {
        ...data,
        featured: data.featured || false,
        published: data.published !== false, // Default to true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            places: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  },

  // Get loop by ID
  getById: async (id: string) => {
    return await prisma.loop.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        places: {
          orderBy: { order: "asc" },
        },
        comments: {
          include: {
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
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            places: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  },

  // Get loop by slug
  getBySlug: async (slug: string) => {
    return await prisma.loop.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        places: {
          orderBy: { order: "asc" },
        },
        comments: {
          include: {
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
            places: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  },

  // Get loops with filters
  getMany: async (
    filters: {
      city?: string;
      tags?: string[];
      featured?: boolean;
      published?: boolean;
      userId?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const {
      city,
      tags,
      featured,
      published = true,
      userId,
      search,
      page = 1,
      limit = 12,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.LoopWhereInput = {
      published,
    };

    if (city) where.city = city;
    if (featured !== undefined) where.featured = featured;
    if (userId) where.userId = userId;
    if (tags && tags.length > 0) {
      where.tags = {
        hasEvery: tags,
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { city: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const [loops, total] = await Promise.all([
      prisma.loop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              places: true,
              comments: true,
              likes: true,
            },
          },
        },
      }),
      prisma.loop.count({ where }),
    ]);

    return {
      loops,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  // Update loop
  update: async (
    id: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      coverImage?: string;
      city?: string;
      tags?: string[];
      featured?: boolean;
      published?: boolean;
    }
  ) => {
    return await prisma.loop.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            places: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  },

  // Delete loop
  delete: async (id: string) => {
    return await prisma.loop.delete({
      where: { id },
    });
  },

  // Get featured loops
  getFeatured: async (limit = 6) => {
    return await prisma.loop.findMany({
      where: {
        featured: true,
        published: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            places: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  },

  // Get popular loops (by likes count)
  getPopular: async (limit = 6) => {
    return await prisma.loop.findMany({
      where: {
        published: true,
      },
      take: limit,
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            places: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  },
};

// ========== PLACE OPERATIONS ==========

export const placeOperations = {
  // Create place
  create: async (data: {
    name: string;
    description: string;
    image?: string;
    category: string;
    mapUrl: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    loopId: string;
    order: number;
  }) => {
    return await prisma.place.create({
      data,
    });
  },

  // Get place by ID
  getById: async (id: string) => {
    return await prisma.place.findUnique({
      where: { id },
      include: {
        loop: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  },

  // Get places by loop ID
  getByLoopId: async (loopId: string) => {
    return await prisma.place.findMany({
      where: { loopId },
      orderBy: { order: "asc" },
    });
  },

  // Update place
  update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      category?: string;
      mapUrl?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
      order?: number;
    }
  ) => {
    return await prisma.place.update({
      where: { id },
      data,
    });
  },

  // Delete place
  delete: async (id: string) => {
    return await prisma.place.delete({
      where: { id },
    });
  },

  // Reorder places
  reorder: async (places: { id: string; order: number }[]) => {
    const updatePromises = places.map((place) =>
      prisma.place.update({
        where: { id: place.id },
        data: { order: place.order },
      })
    );

    return await Promise.all(updatePromises);
  },
};

// ========== COMMENT OPERATIONS ==========

export const commentOperations = {
  // Create comment
  create: async (data: { content: string; userId: string; loopId: string }) => {
    return await prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  },

  // Get comments by loop ID
  getByLoopId: async (loopId: string, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { loopId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.comment.count({ where: { loopId } }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  // Update comment
  update: async (id: string, content: string) => {
    return await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  },

  // Delete comment
  delete: async (id: string) => {
    return await prisma.comment.delete({
      where: { id },
    });
  },
};

// ========== LIKE OPERATIONS ==========

export const likeOperations = {
  // Toggle like (like/unlike)
  toggle: async (userId: string, loopId: string) => {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_loopId: {
          userId,
          loopId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          loopId,
        },
      });
      return { liked: true };
    }
  },

  // Check if user liked a loop
  isLiked: async (userId: string, loopId: string) => {
    const like = await prisma.like.findUnique({
      where: {
        userId_loopId: {
          userId,
          loopId,
        },
      },
    });
    return !!like;
  },

  // Get likes count for a loop
  getCount: async (loopId: string) => {
    return await prisma.like.count({
      where: { loopId },
    });
  },
};

// ========== UTILITY OPERATIONS ==========

export const utilityOperations = {
  // Get all unique cities
  getCities: async () => {
    const loops = await prisma.loop.findMany({
      where: { published: true },
      select: { city: true },
      distinct: ["city"],
    });
    return loops.map((loop) => loop.city).sort();
  },

  // Get all unique tags
  getTags: async () => {
    const loops = await prisma.loop.findMany({
      where: { published: true },
      select: { tags: true },
    });

    const allTags = loops.flatMap((loop) => loop.tags);
    const uniqueTags = [...new Set(allTags)].sort();
    return uniqueTags;
  },

  // Get statistics
  getStats: async () => {
    const [totalLoops, totalUsers, totalPlaces, totalComments] =
      await Promise.all([
        prisma.loop.count({ where: { published: true } }),
        prisma.user.count(),
        prisma.place.count(),
        prisma.comment.count(),
      ]);

    return {
      totalLoops,
      totalUsers,
      totalPlaces,
      totalComments,
    };
  },
};

// Export all operations
export const db = {
  users: userOperations,
  loops: loopOperations,
  places: placeOperations,
  comments: commentOperations,
  likes: likeOperations,
  utils: utilityOperations,
};

// ========== COMMENT LIKE OPERATIONS ==========

export const commentLikes = {
  async create(data: { userId: string; commentId: string }) {
    return await prisma.commentLike.create({ data });
  },

  async delete(id: string) {
    return await prisma.commentLike.delete({ where: { id } });
  },

  async getByUserAndComment(userId: string, commentId: string) {
    return await prisma.commentLike.findUnique({
      where: {
        userId_commentId: { userId, commentId },
      },
    });
  },

  async countByComment(commentId: string) {
    return await prisma.commentLike.count({
      where: { commentId },
    });
  },
};
