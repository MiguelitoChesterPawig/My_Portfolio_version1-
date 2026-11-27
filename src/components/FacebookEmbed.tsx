"use client";

import { useEffect, useRef, useState } from "react";

/* Shows a public Facebook post (with its video/photos) using Facebook's official embed.
   It appears on its own, no click needed. loading="lazy" makes the browser fetch it only
   when the visitor scrolls near it, so the top of the page still loads fast. */
export function FacebookEmbed({ url, title }: { url: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  // Facebook's embed is a fixed width (350–750px), so fit it to the space we have once on screen
  useEffect(() => {
    setWidth(Math.round(Math.max(350, Math.min(560, box.current?.clientWidth ?? 500))));
  }, []);

  return (
    <div ref={box} className="w-full">
      {width ? (
        <iframe
          title={title}
          src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=${width}`}
          width={width}
          height={Math.round(width * 1.45)}
          loading="lazy"
          className="mx-auto block max-w-full rounded-xl border-0 bg-white"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        // brief placeholder until the width is known (a split second after the page loads)
        <div className="glass mx-auto aspect-[1/1.45] w-full max-w-[560px] animate-pulse rounded-xl" />
      )}
      <p className="mt-3 text-center text-xs text-muted">
        Not loading?{" "}
        <a href={url} target="_blank" rel="noreferrer" className="text-neon underline-offset-4 hover:underline">
          Open it on Facebook ↗
        </a>
      </p>
    </div>
  );
}
