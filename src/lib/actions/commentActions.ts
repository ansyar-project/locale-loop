"use server"

import { prisma } from "@/lib/utils/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/utils/authOptions"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment too long"),
  loopId: z.string().min(1, "Loop ID is required"),
  userId: z.string().min(1, "User ID is required")
})

export async function createComment(data: {
  content: string
  loopId: string
  userId: string
}) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Authentication required"
      }
    }

    // Validate input
    const validated = CommentSchema.parse(data)

    // Verify user matches session
    if (validated.userId !== session.user.id) {
      return {
        success: false,
        message: "Unauthorized"
      }
    }

    // Check if loop exists and is published
    const loop = await prisma.loop.findUnique({
      where: { id: validated.loopId },
      select: { published: true }
    })

    if (!loop || !loop.published) {
      return {
        success: false,
        message: "Loop not found or not published"
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: validated.content,
        loopId: validated.loopId,
        userId: validated.userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    })

    revalidatePath(`/loop/[slug]`, 'page')

    return {
      success: true,
      comment,
      message: "Comment created successfully"
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message
      }
    }

    console.error("Create comment error:", error)
    return {
      success: false,
      message: "Something went wrong"
    }
  }
}

export async function getComments(loopId: string) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const comments = await prisma.comment.findMany({
      where: { loopId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        },
        // Include user's like status if logged in
        likes: userId ? {
          where: { userId },
          select: { id: true }
        } : false
      }
    })

    // Transform comments to include isLiked status
    const transformedComments = comments.map(comment => ({
      ...comment,
      isLiked: userId ? comment.likes.length > 0 : false,
      likes: undefined // Remove the likes array from response
    }))

    return {
      success: true,
      comments: transformedComments
    }

  } catch (error) {
    console.error("Get comments error:", error)
    return {
      success: false,
      comments: [],
      message: "Failed to load comments"
    }
  }
}

export async function deleteComment(commentId: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Authentication required"
      }
    }

    // Check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, loopId: true }
    })

    if (!comment) {
      return {
        success: false,
        message: "Comment not found"
      }
    }

    if (comment.userId !== session.user.id) {
      return {
        success: false,
        message: "Unauthorized"
      }
    }

    // Delete comment (likes will be deleted automatically due to cascade)
    await prisma.comment.delete({
      where: { id: commentId }
    })

    revalidatePath(`/loop/[slug]`, 'page')

    return {
      success: true,
      message: "Comment deleted successfully"
    }

  } catch (error) {
    console.error("Delete comment error:", error)
    return {
      success: false,
      message: "Failed to delete comment"
    }
  }
}

export async function toggleCommentLike(commentId: string, userId: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.id !== userId) {
      return {
        success: false,
        message: "Authentication required"
      }
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true }
    })

    if (!comment) {
      return {
        success: false,
        message: "Comment not found"
      }
    }

    // Check if like already exists
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: { userId, commentId }
      }
    })

    if (existingLike) {
      // Remove like
      await prisma.commentLike.delete({
        where: { id: existingLike.id }
      })

      // Get updated count
      const likeCount = await prisma.commentLike.count({
        where: { commentId }
      })

      revalidatePath(`/loop/[slug]`, 'page')
      
      return {
        success: true,
        liked: false,
        count: likeCount,
        message: "Like removed"
      }
    } else {
      // Add like
      await prisma.commentLike.create({
        data: { userId, commentId }
      })

      // Get updated count
      const likeCount = await prisma.commentLike.count({
        where: { commentId }
      })

      revalidatePath(`/loop/[slug]`, 'page')
      
      return {
        success: true,
        liked: true,
        count: likeCount,
        message: "Comment liked"
      }
    }
  } catch (error) {
    console.error("Toggle comment like error:", error)
    return {
      success: false,
      liked: false,
      count: 0,
      message: "Something went wrong"
    }
  }
}