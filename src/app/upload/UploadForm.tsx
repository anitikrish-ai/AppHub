"use client";

import { useState } from "react";
import { useActionState } from "react";
import { motion } from "framer-motion";
import FormField from "@/components/FormField";
import Dropzone from "@/components/Dropzone";
import Button from "@/components/Button";
import LiquidToggle from "@/components/LiquidToggle";
import { submitApp, type UploadState } from "./actions";
import type { CategoryItem } from "@/lib/data";

export default function UploadForm({
  categories,
}: {
  categories: CategoryItem[];
}) {
  const [state, formAction, isPending] = useActionState<UploadState, FormData>(
    submitApp,
    undefined
  );

  const [fastTrackScan, setFastTrackScan] = useState(true);
  const [openSourceRelease, setOpenSourceRelease] = useState(true);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="liquid-glass-medium relative flex flex-col gap-10 rounded-lg p-8 sm:p-10 shadow-[var(--shadow-md)] overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/40 dark:border-white/10"
      />

      {state?.error && (
        <div
          className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger animate-fade-in"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          {state.error}
        </div>
      )}

      {/* Developer Information */}
      <section className="flex flex-col gap-4">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          1. Developer & Studio
        </h3>
        <FormField
          label="Company / Developer Name"
          name="company_name"
          placeholder="e.g. Acme Software Studio"
          required
        />
      </section>

      {/* App Metadata */}
      <section className="flex flex-col gap-4">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          2. Application Details
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Application Name"
            name="name"
            placeholder="e.g. Prism Notes"
            required
          />
          <FormField label="Primary Category" name="category_id">
            <select
              name="category_id"
              className="w-full rounded-md border border-border bg-bg-elevated/80 px-4 py-3 text-sm text-text-primary outline-none focus:border-brand"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Short Tagline"
            name="tagline"
            placeholder="e.g. Fast local markdown editor with biometric vault"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Version"
              name="version"
              placeholder="1.0.0"
            />
            <FormField
              label="Price (USD, 0 for Free)"
              name="price"
              placeholder="0.00"
              type="number"
            />
          </div>
        </div>

        <FormField
          label="Full Description"
          name="description"
          placeholder="Describe your software, key features, system requirements, and architecture…"
          textarea
          required
        />
      </section>

      {/* Assets & Artwork */}
      <section className="flex flex-col gap-4">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          3. Artwork & Visuals
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Dropzone
            name="icon"
            label="App Icon (PNG, SVG, JPG)"
            hint="512x512px or 1024x1024px square"
            accept="image/*"
          />
          <Dropzone
            name="screenshots"
            label="Screenshots (up to 4 images)"
            hint="16:9 or 16:10 desktop screenshots"
            accept="image/*"
            multiple
          />
        </div>
      </section>

      {/* Binary Build File */}
      <section className="flex flex-col gap-4">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          4. Application Package
        </h3>
        <Dropzone
          name="build_file"
          label="Upload release package"
          hint="ZIP, DMG, PKG, or EXE up to 250MB"
          accept=".zip,.dmg,.pkg,.exe,.tar.gz"
        />
      </section>

      {/* Distribution Preferences with Liquid Toggles */}
      <section className="flex flex-col gap-4 border-t border-border pt-4">
        <h3 className="text-heading text-lg font-semibold text-text-primary">
          5. Release & Gatekeeper Options
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg-elevated/60 p-4">
            <div>
              <span className="text-sm font-semibold text-text-primary block">
                Automated Gatekeeper Scan
              </span>
              <span className="text-xs text-text-secondary">
                Pre-screen binaries for malware signatures
              </span>
            </div>
            <LiquidToggle
              checked={fastTrackScan}
              onChange={setFastTrackScan}
              size="sm"
              showIcons={false}
              label="Gatekeeper automated scan"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg-elevated/60 p-4">
            <div>
              <span className="text-sm font-semibold text-text-primary block">
                Open-Source Certification
              </span>
              <span className="text-xs text-text-secondary">
                Display verified open-source package badge
              </span>
            </div>
            <LiquidToggle
              checked={openSourceRelease}
              onChange={setOpenSourceRelease}
              size="sm"
              showIcons={false}
              label="Open source distribution"
            />
          </div>
          <input type="hidden" name="fast_track_scan" value={fastTrackScan ? "true" : "false"} />
          <input type="hidden" name="open_source_release" value={openSourceRelease ? "true" : "false"} />
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <p className="text-xs text-text-tertiary">
          By submitting, you certify that this software complies with AppHub Security Standards.
        </p>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="!px-6 !py-3"
          >
            {isPending ? "Submitting for review…" : "Submit for Gatekeeper Review"}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
