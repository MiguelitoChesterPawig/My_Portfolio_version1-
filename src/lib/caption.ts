/* "(Admin Dashboard)" in a filename → "Admin Dashboard" caption.
   Kept in its own tiny module so galleries can show captions without pulling in the Lightbox code. */
export const captionOf = (src: string) => src.match(/\(([^)]+)\)/)?.[1];
