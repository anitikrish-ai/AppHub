"use client";

import { useTransition } from "react";
import Button from "@/components/Button";
import { recordDownload } from "./actions";

export default function DownloadButton({
  appId,
  slug,
}: {
  appId: string;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="primary"
      disabled={isPending}
      onClick={() => startTransition(() => recordDownload(appId, slug))}
    >
      {isPending ? "Starting download…" : "Download"}
    </Button>
  );
}
