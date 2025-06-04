"use server";

import { db } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function toggleLike(loopId: string, userId: string) {
  try {
    // Check if like already exists
    const isAlreadyLiked = await db.likes.isLiked(userId, loopId);

    if (isAlreadyLiked) {
      // Remove like
      await db.likes.toggle(userId, loopId);
      revalidatePath(`/loop/[slug]`, "page");

      return {
        success: true,
        liked: false,
        message: "Like removed",
      };
    } else {
      // Add like
      await db.likes.toggle(userId, loopId);
      revalidatePath(`/loop/[slug]`, "page");

      return {
        success: true,
        liked: true,
        message: "Loop liked",
      };
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    return {
      success: false,
      liked: false,
      message: "Something went wrong",
    };
  }
}
