"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { MessageCircleIcon, ReplyIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import {
  createComment,
  deleteComment,
  getComments,
} from "@/lib/actions/commentActions";
import { CommentLikeButton } from "@/components/ui/CommentLikeButton";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  isLiked: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    likes: number;
  };
}

interface CommentsProps {
  loopId: string;
  initialComments?: Comment[];
}

export function Comments({ loopId, initialComments = [] }: CommentsProps) {
  const { data: session } = useSession();
  const { addToast } = useToast();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getComments(loopId);
      if (result.success) {
        setComments(
          result.comments.map((c) => ({
            ...c,
            createdAt:
              typeof c.createdAt === "string"
                ? c.createdAt
                : c.createdAt.toISOString(),
          }))
        );
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [loopId]);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      addToast({
        type: "error",
        title: "Login Required",
        message: "Please login to comment",
      });
      return;
    }

    if (!newComment.trim()) {
      addToast({
        type: "error",
        title: "Empty Comment",
        message: "Please write something before posting",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment({
        loopId,
        content: newComment.trim(),
        userId: session.user.id,
      });

      if (result.success) {
        setNewComment("");
        loadComments(); // Reload comments
        addToast({
          type: "success",
          title: "Comment Added",
          message: "Your comment has been posted",
        });
      } else {
        addToast({
          type: "error",
          title: "Failed to Post",
          message: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      addToast({
        type: "error",
        title: "Error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const result = await deleteComment(commentId);

      if (result.success) {
        setComments(comments.filter((c) => c.id !== commentId));
        addToast({
          type: "success",
          title: "Comment Deleted",
          message: "Your comment has been removed",
        });
      } else {
        addToast({
          type: "error",
          title: "Delete Failed",
          message: result.message || "Something went wrong",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Error",
        message: "Something went wrong",
      });
    }
  };
  return (
    <div className="space-y-8">
      {/* Comment Form Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircleIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Join the Discussion ({comments.length})
          </h3>
        </div>

        {/* Comment Form */}
        {session ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            <div className="flex gap-3 sm:gap-4">
              <UserAvatar
                user={session.user}
                size={48}
                className="hidden sm:block"
              />
              <UserAvatar
                user={session.user}
                size={36}
                className="block sm:hidden"
              />
              <div className="flex-1 min-w-0">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this loop..."
                  rows={3}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-all duration-300 text-sm sm:text-base"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {newComment.length}/500 characters
                  </span>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="px-4 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <MessageCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Join the conversation
            </h4>
            <p className="text-gray-600 mb-4">
              Sign in to share your thoughts and connect with other travelers
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/login">Login to Comment</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MessageCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              No comments yet
            </h4>
            <p className="text-gray-500">
              Be the first to share your thoughts about this loop!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={session?.user?.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Comment Component
interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
}

function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps) {
  const isOwner = currentUserId === comment.user.id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString();
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex gap-4">
        <UserAvatar user={comment.user} size={48} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link
                href={`/profile/${comment.user.name}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {comment.user.name}
              </Link>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Delete comment"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-6">
            <CommentLikeButton
              commentId={comment.id}
              initialLiked={comment.isLiked}
              initialCount={comment._count.likes}
              userId={currentUserId}
            />

            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
              <ReplyIcon className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
