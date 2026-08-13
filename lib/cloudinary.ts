"use client";

interface CloudinaryUploadResult {
  event: string;
  info?: { secure_url: string };
}

interface CloudinaryWidget {
  open: () => void;
}

interface CloudinaryGlobal {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryUploadResult) => void
  ) => CloudinaryWidget;
}

declare global {
  interface Window {
    cloudinary?: CloudinaryGlobal;
  }
}

const WIDGET_SRC = "https://upload-widget.cloudinary.com/global/all.js";
let widgetScriptPromise: Promise<void> | null = null;

function loadWidgetScript(): Promise<void> {
  if (window.cloudinary) return Promise.resolve();
  if (widgetScriptPromise) return widgetScriptPromise;

  widgetScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      widgetScriptPromise = null;
      reject(new Error("Failed to load the upload widget."));
    };
    document.body.appendChild(script);
  });
  return widgetScriptPromise;
}

/**
 * Opens Cloudinary's hosted upload widget (drag-and-drop, URL, or camera).
 * Uploads go straight from the browser to Cloudinary via an unsigned preset —
 * no server credentials involved, which is why cloud name / preset are
 * NEXT_PUBLIC_ vars safe to ship to the client.
 */
export async function openCloudinaryWidget(
  onUploaded: (url: string) => void,
  onError?: (message: string) => void
): Promise<void> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    onError?.(
      "Cloudinary isn't configured yet. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local."
    );
    return;
  }

  try {
    await loadWidgetScript();
  } catch {
    onError?.("Could not load the upload widget. Check your connection and try again.");
    return;
  }

  const widget = window.cloudinary!.createUploadWidget(
    {
      cloudName,
      uploadPreset,
      sources: ["local", "url", "camera"],
      multiple: false,
      folder: "richkid-decor-store",
      maxFileSize: 8_000_000,
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
    },
    (error, result) => {
      if (error) {
        onError?.("Upload failed. Please try again.");
        return;
      }
      if (result.event === "success" && result.info) {
        onUploaded(result.info.secure_url);
      }
    }
  );
  widget.open();
}
