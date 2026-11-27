"use client";

/* Viber links (viber://...) only work when the Viber app is installed.
   Browsers give no error when it isn't, so this watches every Viber link on the page:
   if the page is still in front ~1.5 s after the click (the app never took over),
   a small pop-up explains that Viber is needed and offers the number + other ways to chat. */

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

export function ViberNotice() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { phone, whatsapp, telegram } = profile.links;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => clearTimeout(timer);
    const onHide = () => document.hidden && cancel();

    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.('a[href^="viber:"]');
      if (!link) return;
      cancel();
      timer = setTimeout(() => {
        // still visible and focused = the Viber app did not open
        if (!document.hidden && document.hasFocus()) {
          setCopied(false);
          setOpen(true);
        }
      }, 1500);
    }

    document.addEventListener("click", onClick);
    window.addEventListener("blur", cancel);
    window.addEventListener("pagehide", cancel);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      cancel();
      document.removeEventListener("click", onClick);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("pagehide", cancel);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const btn = "glass glass-hover flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-fg";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="viber-title"
    >
      <div className="glass w-full max-w-sm rounded-2xl p-6 bg-bg" onClick={(e) => e.stopPropagation()}>
        <p className="font-mono text-xs uppercase tracking-widest text-neon/80">Viber</p>
        <h3 id="viber-title" className="mt-2 text-lg font-semibold text-fg">
          Viber didn&apos;t open
        </h3>
        <p className="mt-2 text-sm text-muted">
          You need the Viber app installed on this device to start a chat. Install Viber, or reach me another way below.
          If Viber already opened, you can close this.
        </p>

        <div className="mt-5 grid gap-2">
          <a href="https://www.viber.com/en/download/" target="_blank" rel="noreferrer" className="block rounded-xl bg-neon px-4 py-3 text-center text-sm font-semibold text-bg transition hover:brightness-110">
            Get Viber
          </a>
          {phone && (
            <button type="button" onClick={copy} className={btn}>
              <i className="fi fi-rr-copy flex" aria-hidden="true" />
              {copied ? "Number copied!" : `Copy number (${phone})`}
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" className={btn}>
                <i className="fi fi-brands-whatsapp flex" aria-hidden="true" /> WhatsApp
              </a>
            )}
            {telegram && (
              <a href={telegram} target="_blank" rel="noreferrer" className={btn}>
                <i className="fi fi-brands-telegram flex" aria-hidden="true" /> Telegram
              </a>
            )}
          </div>
          <button type="button" onClick={() => setOpen(false)} className="mt-1 text-xs text-muted hover:text-fg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
