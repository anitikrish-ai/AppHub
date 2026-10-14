import Rating from "./Rating";

export default function ReviewCard({
  name,
  rating,
  body,
  date,
}: {
  name: string;
  rating: number;
  body: string;
  date: string;
}) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div
      className="liquid-glass-subtle flex flex-col gap-3 rounded-lg p-5 border border-white/20 dark:border-white/10 shadow-[var(--shadow-sm)]"
      style={{ borderRadius: "var(--radius-md)" }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#5e5ce6] text-xs font-bold text-white shadow-xs">
          {initial}
        </span>
        <div>
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          <div className="flex items-center gap-2">
            <Rating value={rating} />
            <span className="text-xs text-text-tertiary">{date}</span>
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}
