"use client";

import { motion } from "framer-motion";
import { UploadCloud, FileCheck, X } from "lucide-react";
import { useState, useRef } from "react";
import clsx from "clsx";

interface DropzoneProps {
  label: string;
  hint: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
}

export default function Dropzone({
  label,
  hint,
  name,
  accept,
  multiple = false,
}: DropzoneProps) {
  const [active, setActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const array = Array.from(files);
    setSelectedFiles((prev) => (multiple ? [...prev, ...array] : [array[0]]));
  };

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <motion.div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setActive(true);
        }}
        onDragLeave={() => setActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        animate={{ scale: active ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={clsx(
          "relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-8 text-center transition-all cursor-pointer select-none",
          active
            ? "border-brand bg-brand/5"
            : "border-border hover:border-border-strong hover:bg-bg-elevated/40"
        )}
        style={{ borderRadius: "var(--radius-md)" }}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {selectedFiles.length > 0 ? (
          <div className="flex flex-col items-center gap-1.5">
            <FileCheck size={28} className="text-success" />
            <p className="text-sm font-medium text-text-primary">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-text-tertiary">Click or drag to replace</p>
          </div>
        ) : (
          <>
            <UploadCloud size={28} className="text-brand" />
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="text-xs text-text-tertiary">{hint}</p>
          </>
        )}
      </motion.div>

      {/* Selected file badges */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 rounded-pill bg-bg-elevated border border-border px-3 py-1 text-xs text-text-secondary shadow-xs"
            >
              <span className="truncate max-w-[140px]">{file.name}</span>
              <span className="text-text-tertiary">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                type="button"
                onClick={(e) => removeFile(idx, e)}
                className="text-text-tertiary hover:text-danger cursor-pointer transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
