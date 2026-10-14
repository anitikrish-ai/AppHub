"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import FormField from "@/components/FormField";
import Dropzone from "@/components/Dropzone";
import Button from "@/components/Button";
import { submitApp, type UploadState } from "./actions";

export default function UploadForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState<UploadState, FormData>(
    submitApp,
    undefined
  );

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="glass flex flex-col gap-10 rounded-lg p-10"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {state?.error && (
        <div
          className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          {state.error}
        </div>
      )}

      <section className="flex flex-col gap-5">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          Developer details
        </h3>
        <FormField
          label="Company / developer name"
          name="company_name"
          placeholder="e.g. Orbit Software Co."
        />
      </section>

      <section className="flex flex-col gap-5">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          App details
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="App name"
            name="name"
            placeholder="e.g. Nebula Notes"
            required
          />
          <FormField label="Category" name="category_id">
            <select
              name="category_id"
              className="w-full rounded-md border border-border bg-bg-elevated/70 px-4 py-3 text-sm text-text-primary outline-none focus:border-brand"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField
          label="Description"
          name="description"
          placeholder="Tell users what your app does…"
          textarea
          required
        />
      </section>

      <section className="flex flex-col gap-5">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          Icon & screenshots
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Dropzone label="Drag your icon here or click to browse" hint="PNG, JPG up to 10MB" />
          <Dropzone label="Drag screenshots here or click to browse" hint="Up to 6 images" />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          Build file
        </h3>
        <Dropzone label="Drag your build file here or click to browse" hint="ZIP, DMG, or EXE up to 200MB" />
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit for review"}
        </Button>
        <Button type="button" variant="ghost">
          Save as draft
        </Button>
      </div>
    </motion.form>
  );
}
