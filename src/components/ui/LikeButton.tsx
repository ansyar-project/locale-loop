"use client";

import { useState } from "react";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { toggleLike } from "@/lib/actions/likeActions";

interface LikeButtonProps {
  loopId: string;
  initialLiked: boolean;
  initialCount: number;
  userId?: string;
}

export function LikeButton({
  loopId,
  initialLiked,
  initialCount,
  userId,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleToggle = async () => {
    if (!userId) {
      addToast({
        type: "error",
        title: "Login Required",
        message: "Please login to like loops",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await toggleLike(loopId, userId);

      if (result.success) {
        setLiked(result.liked);
        setCount(result.liked ? count + 1 : count - 1);
      } else {
        addToast({
          type: "error",
          title: "Error",
          message: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Toggle like error:", error);
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
    <Button
      variant={liked ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isLoading}
      className="w-full"
    >
      <HeartIcon className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
      {liked ? "Liked" : "Like"} ({count})
    </Button>
  );
}
