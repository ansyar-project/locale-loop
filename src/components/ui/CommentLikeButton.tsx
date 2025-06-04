"use client";

import { useState } from "react";
import { HeartIcon } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { toggleCommentLike } from "@/lib/actions/commentActions";

interface CommentLikeButtonProps {
  commentId: string;
  initialLiked: boolean;
  initialCount: number;
  userId?: string;
}

export function CommentLikeButton({
  commentId,
  initialLiked,
  initialCount,
  userId,
}: CommentLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleToggle = async () => {
    if (!userId) {
      addToast({
        type: "error",
        title: "Login Required",
        message: "Please login to like comments",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await toggleCommentLike(commentId, userId);

      if (result.success) {
        setLiked(result.liked ?? false);
        setCount(result.count ?? 0);
      } else {
        addToast({
          type: "error",
          title: "Error",
          message: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      addToast({
        type: "error",
        title: "Error",
        message: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
        liked
          ? "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
          : "text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200"
      } ${
        isLoading
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 active:scale-95"
      }`}
    >
      <HeartIcon
        className={`w-4 h-4 transition-all duration-300 ${
          liked ? "fill-current scale-110" : ""
        }`}
      />
      <span className="font-semibold">{count}</span>
      {count === 1 ? "Like" : "Likes"}
    </button>
  );
}
