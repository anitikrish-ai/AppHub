import { Star } from "lucide-react";

export default function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-text-primary">
      <Star size={13} fill="#FF9F0A" stroke="#FF9F0A" />
      {value.toFixed(1)}
    </span>
  );
}
