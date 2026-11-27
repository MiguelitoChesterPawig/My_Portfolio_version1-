"use client";

import { useEffect, useRef, useState } from "react";

/* Plays the video by itself as soon as it is on screen, with sound.
   Browsers refuse to start a video WITH sound until the visitor has clicked or tapped the page
   at least once. So: we try with sound first; if the browser says no, we play it muted and
   switch the sound on at the visitor's very first click/tap/key press anywhere on the page
   (or when they press the "Tap for sound" button). It pauses when scrolled away and resumes
   when it comes back, and does not restart once it has finished. */
export function AutoVideo({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const unmute = () => {
      v.muted = false;
      setMuted(false);
      if (v.paused && !v.ended && isOnScreen) v.play().catch(() => {});
    };
    const onFirstGesture = () => {
      unmute();
      removeGestureListeners();
    };
    const gestures = ["pointerdown", "keydown", "touchend"] as const;
    const removeGestureListeners = () => gestures.forEach((g) => window.removeEventListener(g, onFirstGesture));

    const start = async () => {
      if (v.ended) return;
      try {
        v.muted = false;
        await v.play();
        setMuted(false);
      } catch {
        // blocked: play silently for now, turn sound on at the first interaction
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
        gestures.forEach((g) => window.addEventListener(g, onFirstGesture, { once: true, passive: true }));
      }
    };

    let isOnScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        isOnScreen = entry.isIntersecting;
        if (isOnScreen) start();
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);

    // keep the badge in sync if the visitor uses the player's own mute button
    const onVolume = () => setMuted(v.muted);
    v.addEventListener("volumechange", onVolume);

    return () => {
      io.disconnect();
      removeGestureListeners();
      v.removeEventListener("volumechange", onVolume);
    };
  }, []);

  return (
    <div className="relative">
      <video
        ref={ref}
        src={src}
        title={title}
        aria-label={title}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full bg-black"
      />
      {muted && (
        <button
          type="button"
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            v.muted = false;
            setMuted(false);
            v.play().catch(() => {});
          }}
          className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-coral-deep"
        >
          <i className="fi fi-rr-volume flex" aria-hidden="true" />
          Tap for sound
        </button>
      )}
    </div>
  );
}
