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
  return (
    <div
      className="glass flex flex-col gap-3 rounded-lg p-5"
      style={{ borderRadius: "var(--radius-md)" }}
    >
      <div className="flex items-center gap-3">
        <span className="h-8 w-8 rounded-full bg-gradient-to-br from-brand to-[#5e5ce6]" />
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
