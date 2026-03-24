import { Quote, Star, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviewsApi,
  createReviewApi,
  type Review,
} from "../../api/galleryAndReviewApi";

interface ReviewForm {
  name: string;
  text: string;
  rating: number;
}

interface StarRatingProps {
  count?: number;
}

interface InteractiveStarRatingProps {
  value: number;
  onChange: (val: number) => void;
}

function StarRating({ count = 5 }: StarRatingProps) {
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

function InteractiveStarRating({
  value,
  onChange,
}: InteractiveStarRatingProps) {
  const [hovered, setHovered] = useState<number>(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i + 1)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={
              i < (hovered || value)
                ? "fill-primary-pink text-primary-pink"
                : "text-slate-300 fill-slate-100"
            }
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialCard({ review }: { review: Review }) {
  return (
    <div className="bg-white p-10 rounded-3xl relative shadow-sm">
      <div className="absolute top-6 left-6 opacity-10">
        <Quote size={56} className="stroke-none fill-primary-pink" />
      </div>
      <StarRating count={review.rating} />
      <p className="text-lg mb-6 leading-relaxed text-slate-700 relative z-10">
        "{review.message}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-primary-pink/20 flex items-center justify-center font-bold text-primary-pink text-sm">
          {review.name.charAt(0)}
        </div>
        <div>
          <h5 className="font-bold text-sm text-slate-900">{review.name}</h5>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const queryClient = useQueryClient();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [form, setForm] = useState<ReviewForm>({
    name: "",
    text: "",
    rating: 0,
  });

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: getReviewsApi,
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: () =>
      createReviewApi({
        name: form.name,
        message: form.text,
        rating: form.rating,
      }),
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      console.error("Failed to submit review:", error);
    },
  });

  const featuredReviews = reviews?.slice(0, 2) ?? [];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.text || form.rating === 0) return;
    submitReview();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-24 bg-primary-pink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary-pink/20 text-primary-pink rounded-full">
            Client Love
          </span>
          <h2 className="text-4xl font-black text-slate-900">
            What Our Guests Say
          </h2>
        </div>

        {/* ── Two Featured Testimonials ── */}
        {isLoading && (
          <div className="flex h-48 items-center justify-center gap-3 mb-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary-pink" />
            <p className="text-slate-500 font-medium">Loading reviews...</p>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-red-500 mb-10">
            <p>Unable to load reviews at the moment.</p>
          </div>
        )}

        {!isLoading && !isError && featuredReviews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {featuredReviews.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {!isLoading && !isError && featuredReviews.length === 0 && (
          <p className="text-center text-slate-400 font-medium mb-10">
            No reviews yet. Be the first to share your experience!
          </p>
        )}

        {/* ── More Reviews Link ── */}
        <div className="flex justify-center mb-20">
          <Link
            to="/reviews"
            className="flex items-center gap-2 border-2 border-primary-pink/40 hover:border-primary-pink text-slate-800 font-bold px-7 py-3 rounded-xl transition-all hover:bg-primary-pink/5 group"
          >
            See All Reviews
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-pink group-hover:translate-x-1 transition-transform duration-200"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Divider ── */}
        <div className="relative mb-20">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-pink/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-primary-pink/10 px-6 py-2 rounded-full text-sm font-bold text-primary-pink tracking-widest uppercase">
              Share Your Experience
            </span>
          </div>
        </div>

        {/* ── Leave a Review Form ── */}
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-primary-pink/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <Star
                  size={28}
                  className="fill-primary-pink text-primary-pink"
                />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Thank You!
              </h3>
              <p className="text-slate-600">
                Your review has been submitted. We love hearing from our guests.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Leave a Review
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                Your feedback helps us grow and serve you better.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Your Rating <span className="text-primary-pink">*</span>
                  </label>
                  <InteractiveStarRating
                    value={form.rating}
                    onChange={(val) => setForm({ ...form, rating: val })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Name <span className="text-primary-pink">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Your Review <span className="text-primary-pink">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="text"
                    placeholder="Tell us about your experience at Luxe…"
                    value={form.text}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 bg-primary-pink text-slate-900 font-bold px-8 py-3.5 rounded-xl hover:shadow-lg transition-shadow w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
