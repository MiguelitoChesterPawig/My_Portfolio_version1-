"use client";

import { useRef, useState } from "react";

/* Horizontal swipe for a gallery: finger on phones, click-and-drag with a mouse on computers.
   Spread `handlers` on the element that should listen (put it around the arrows and dots too,
   so a swipe that starts on them still works). The image follows the pointer (`dx`); letting go
   past the threshold calls onPrev/onNext. Vertical finger drags are left to the page so
   scrolling still works (the element needs `touch-action: pan-y`, Tailwind `touch-pan-y`).
   The click a browser fires at the end of a drag is swallowed, so a swipe never also opens
   (or closes) the full-size viewer. */
const THRESHOLD = 40; // px of horizontal travel that counts as a swipe

export function useSwipe(onPrev: () => void, onNext: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const axis = useRef<"x" | "y" | null>(null);
  const offset = useRef(0);
  const swiped = useRef(false);
  const [dx, setDx] = useState(0);

  const reset = () => {
    start.current = null;
    axis.current = null;
    offset.current = 0;
    setDx(0);
  };

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return; // left mouse button only
      start.current = { x: e.clientX, y: e.clientY };
      axis.current = null;
      swiped.current = false;
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current) return;
      if (e.pointerType === "mouse" && e.buttons === 0) return reset(); // button released outside
      const x = e.clientX - start.current.x;
      const y = e.clientY - start.current.y;
      if (!axis.current && Math.hypot(x, y) > 8) {
        axis.current = Math.abs(x) > Math.abs(y) ? "x" : "y";
        // keep receiving the moves even if the pointer leaves the gallery mid-swipe
        if (axis.current === "x") e.currentTarget.setPointerCapture?.(e.pointerId);
      }
      if (axis.current !== "x") return;
      offset.current = x;
      setDx(x);
    },
    onPointerUp: () => {
      const x = offset.current;
      if (axis.current === "x" && Math.abs(x) > THRESHOLD) {
        swiped.current = true;
        if (x < 0) onNext();
        else onPrev();
      }
      reset();
    },
    onPointerCancel: reset, // the browser took over (e.g. the page started scrolling)
    onClickCapture: (e: React.MouseEvent) => {
      if (!swiped.current) return;
      swiped.current = false;
      e.stopPropagation();
      e.preventDefault();
    },
    onDragStart: (e: React.DragEvent) => e.preventDefault(), // no "ghost image" drag with a mouse
  };

  return { dx, handlers };
}
