export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill border border-border bg-bg-elevated px-2.5 py-1 text-xs font-medium text-text-secondary">
      {children}
    </span>
  );
}
