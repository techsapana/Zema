import { Quote, Star, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getReviewsApi, type Review } from "../../api/galleryAndReviewApi";

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count
              ? "fill-primary-pink text-primary-pink"
              : "text-slate-300 fill-slate-100"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: getReviewsApi,
  });



  return (
    <main className="min-h-screen bg-primary-pink/5">
      <section className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-pink transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary-pink/20 text-primary-pink rounded-full">
                Client Love
              </span>
              <h1 className="text-5xl font-black text-slate-900 mb-2">
                All Reviews
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
              <p className="text-slate-500">Loading reviews...</p>
            </div>
          )}

          {isError && (
            <div className="rounded-2xl bg-red-50 p-8 text-center text-red-500">
              <p>Error loading reviews: {(error as Error).message}</p>
            </div>
          )}

          {!isLoading && !isError && (!reviews || reviews.length === 0) && (
            <p className="text-center text-slate-400 font-medium text-lg">
              No reviews yet. Be the first to share your experience!
            </p>
          )}

          {!isLoading && !isError && reviews && reviews.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-8 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-5 left-5 opacity-10">
                    <Quote
                      size={48}
                      className="stroke-none fill-primary-pink"
                    />
                  </div>
                  <StarRating count={review.rating} />
                  <p className="text-base mb-6 leading-relaxed text-slate-700 relative z-10">
                    "{review.message}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-pink/20 flex items-center justify-center font-bold text-primary-pink text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">
                        {review.name}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
