import { getImageProps } from "next/image";

/* Resized, modern-format versions of a picture, served by Next's image optimizer.
   Returns only src / srcSet / sizes, so it can be spread onto a plain <img> or <motion.img>
   without changing any layout or animation. `sizes` tells the browser how wide the picture
   is shown, so a phone downloads a small file instead of the full original.
   SVGs are returned as-is (they are already tiny and scale perfectly). */
export function optimized(src: string, sizes: string) {
  if (src.endsWith(".svg")) return { src };
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
