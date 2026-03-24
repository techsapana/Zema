import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviewsApi,
  deleteReviewApi,
  type Review,
} from "../../api/galleryAndReviewApi";
import { Trash2, Star, MessageSquare, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function AdminReviews() {
  const queryClient = useQueryClient();

  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery<Review[]>({
    queryKey: ["adminReviews"],
    queryFn: getReviewsApi,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete review. Please try again.");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Reviews Manager</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and manage all customer reviews.
        </p>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          All Reviews
          {reviews && (
            <span className="text-slate-400 font-normal text-sm ml-2">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          )}
        </h2>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-8 text-center">
            <p className="text-red-500 font-semibold text-sm">
              Could not load reviews.{" "}
              <span className="text-red-400 font-normal">
                {(error as Error).message}
              </span>
            </p>
          </div>
        )}

        {/* Empty State */}
        {reviews && reviews.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-12 text-center">
            <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">
              No reviews yet.
            </p>
          </div>
        )}

        {/* Horizontal Review Cards */}
        {reviews && reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all group"
              >
                {/* Avatar */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary-pink/10 flex items-center justify-center">
                  <User size={18} className="text-primary-pink" />
                </div>

                {/* Name + Rating */}
                <div className="shrink-0 w-32">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {review.name}
                  </p>
                  <StarRating rating={review.rating} />
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {review.message}
                  </p>
                  {review.reply && (
                    <p className="text-xs text-primary-pink mt-1 truncate">
                      ↳ Replied: {review.reply.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <p className="shrink-0 text-xs text-slate-400 hidden sm:block">
                  {formatDate(review.createdAt)}
                </p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer shrink-0 p-2 text-red-500 bg-red-50 rounded-lg transition-all opacity-100"
                  title="Delete review"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
