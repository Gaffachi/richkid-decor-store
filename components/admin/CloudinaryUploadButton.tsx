"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { openCloudinaryWidget } from "@/lib/cloudinary";

export function CloudinaryUploadButton({
  onUploaded,
  label = "Upload",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [opening, setOpening] = useState(false);

  async function handleClick() {
    setOpening(true);
    await openCloudinaryWidget(
      (url) => {
        onUploaded(url);
        toast.success("Image uploaded.");
      },
      (message) => toast.error(message)
    );
    setOpening(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0 gap-1.5"
      onClick={handleClick}
      disabled={opening}
    >
      <UploadCloud className="size-3.5" />
      {opening ? "Opening..." : label}
    </Button>
  );
}
