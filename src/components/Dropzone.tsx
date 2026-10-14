"use client";

import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Dropzone({
  label,
  hint,
}: {
  label: string;
  hint: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setActive(false);
      }}
      animate={{ scale: active ? 1.01 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer",
        active ? "border-brand bg-brand/5" : "border-border hover:border-border-strong"
      )}
      style={{ borderRadius: "var(--radius-md)" }}
    >
      <UploadCloud size={26} className="text-brand" />
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="text-xs text-text-tertiary">{hint}</p>
    </motion.div>
  );
}
