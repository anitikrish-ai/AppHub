"use client";

import { useState } from "react";
import { ArrowDownToLine, Check, Loader2 } from "lucide-react";
import Button from "@/components/Button";
import { recordDownload } from "./actions";

export default function DownloadButton({
  appId,
  slug,
  appName,
  buildFileUrl,
}: {
  appId: string;
  slug: string;
  appName: string;
  buildFileUrl?: string | null;
}) {
  const [status, setStatus] = useState<"idle" | "downloading" | "completed">("idle");

  const handleDownload = async () => {
    setStatus("downloading");

    try {
      await recordDownload(appId, slug);
    } catch {
      // safe fallback
    }

    // Trigger file download if actual URL exists, or simulated binary package
    if (buildFileUrl) {
      window.open(buildFileUrl, "_blank");
    } else {
      // Simulate file download creation
      const blob = new Blob(
        [
          `AppHub Application Package: ${appName}\nVersion: Latest Release\nVerified Clean by AppHub Gatekeeper\nDownloaded: ${new Date().toISOString()}`,
        ],
        { type: "text/plain" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-installer.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setTimeout(() => {
      setStatus("completed");
      setTimeout(() => setStatus("idle"), 4000);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        variant="primary"
        disabled={status === "downloading"}
        onClick={handleDownload}
        className="!px-6 !py-3 flex items-center gap-2"
      >
        {status === "downloading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Preparing package…</span>
          </>
        ) : status === "completed" ? (
          <>
            <Check size={16} className="text-white" />
            <span>Downloaded</span>
          </>
        ) : (
          <>
            <ArrowDownToLine size={16} />
            <span>Download</span>
          </>
        )}
      </Button>

      {status === "completed" && (
        <span className="text-[11px] text-success animate-fade-in font-medium">
          Package downloaded successfully
        </span>
      )}
    </div>
  );
}
