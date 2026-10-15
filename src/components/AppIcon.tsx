import clsx from "clsx";

/**
 * Deterministic gradient avatar used as a placeholder app icon when an app
 * has no uploaded icon_url yet. Hashing the name keeps the gradient stable
 * across re-renders instead of flashing a new random color each time.
 */
function hashToHue(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export default function AppIcon({
  name,
  iconUrl,
  size = 52,
  className,
}: {
  name: string;
  iconUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={iconUrl}
        alt={`${name} icon`}
        width={size}
        height={size}
        className={clsx("rounded-md object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  const hue = hashToHue(name);
  return (
    <div
      aria-hidden
      className={clsx("rounded-md shrink-0", className)}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 70% 60%), hsl(${
          (hue + 60) % 360
        } 70% 60%))`,
      }}
    />
  );
}
