import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";

export const alt = "RichKid Decor Store";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderBrandOgImage();
}
