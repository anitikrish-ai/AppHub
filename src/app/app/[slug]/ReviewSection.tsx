"use client";

import { useState } from "react";
import { Star, MessageSquarePlus, Check, X } from "lucide-react";
import Button from "@/components/Button";
import ReviewCard from "@/components/ReviewCard";
import type { ReviewItem } from "@/lib/data";
import { submitReviewAction } from "./actions";

export default function ReviewSection({
  appId,
  slug,
  initialReviews,
}: {
  appId: string;
  slug: string;
  initialReviews: ReviewItem[];
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBody.trim()) return;

    setIsSubmitting(true);
    await submitReviewAction(appId, slug, selectedRating, reviewBody);

    const newReview: ReviewItem = {
      id: `rev-local-${Date.now()}`,
      appId,
      userName: reviewerName.trim() || "Community Reviewer",
      rating: selectedRating,
      body: reviewBody.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setReviewBody("");
    setReviewerName("");
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 4000);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-heading text-xl sm:text-2xl font-semibold text-text-primary">
            Ratings & Reviews
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Verified feedback from community users
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          className="!px-4 !py-2 text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <MessageSquarePlus size={14} />
          <span>Write a review</span>
        </Button>
      </div>

      {successNotice && (
        <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success animate-fade-in">
          <Check size={16} />
          <span>Thank you! Your review has been published.</span>
        </div>
      )}

      {/* Review Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div
            className="liquid-glass-strong relative w-full max-w-lg rounded-lg border border-white/30 dark:border-white/15 p-6 shadow-2xl animate-scale-in overflow-hidden"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/30 dark:border-white/10"
            />
            <div className="flex items-center justify-between pb-4 border-b border-border relative z-10">
              <h3 className="text-lg font-semibold text-text-primary">
                Write a Review
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || selectedRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setSelectedRating(star)}
                        className="cursor-pointer p-1 transition-transform hover:scale-110"
                        aria-label={`${star} star`}
                      >
                        <Star
                          size={24}
                          fill={active ? "#FF9F0A" : "transparent"}
                          stroke={active ? "#FF9F0A" : "currentColor"}
                          className={active ? "" : "text-text-tertiary"}
                        />
                      </button>
                    );
                  })}
                  <span className="text-sm font-semibold text-text-primary ml-2">
                    {selectedRating} of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  Your Name or Handle (optional)
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Jordan V."
                  className="w-full rounded-md border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
                  style={{ borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="What did you like or dislike? How does it fit your daily workflow?"
                  className="w-full rounded-md border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
                  style={{ borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Publish review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="liquid-glass-subtle rounded-lg p-8 text-center border border-white/20 dark:border-white/10" style={{ borderRadius: "var(--radius-md)" }}>
            <p className="text-sm text-text-secondary">
              No reviews yet. Be the first to share your experience with this software!
            </p>
          </div>
        ) : (
          reviews.map((r) => (
            <ReviewCard
              key={r.id}
              name={r.userName}
              rating={r.rating}
              body={r.body}
              date={new Date(r.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            />
          ))
        )}
      </div>
    </section>
  );
}
