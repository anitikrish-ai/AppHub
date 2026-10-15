import { Star } from "lucide-react";

export default function Rating({ value = 5.0 }: { value?: number }) {
  const safeVal = typeof value === "number" && !isNaN(value) ? value : 5.0;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-text-primary">
      <Star size={13} fill="#FF9F0A" stroke="#FF9F0A" />
      {safeVal.toFixed(1)}
    </span>
  );
}
