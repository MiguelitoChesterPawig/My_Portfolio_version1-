"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile, chatSuggestions } from "@/content/profile";
import { FlowSection } from "./FlowSection";
import { cannedAnswer } from "@/lib/localAnswer";

// a believable "composing" pause for ready-made answers: ~1–2.6s, a bit longer for longer replies
const composeDelay = (reply: string) => Math.min(900 + reply.length * 8 + Math.random() * 600, 2600);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Msg = { role: "user" | "assistant"; content: string };

export function AskAI() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${profile.shortName}'s AI assistant. Ask me anything about his skills, projects or experience.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  // hide suggestions already asked (clicked or typed)
  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content.trim().toLowerCase()));
  const unasked = chatSuggestions.filter((s) => !asked.has(s.toLowerCase()));

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // common questions are answered from ready-made replies (no AI call, no tokens)
      const canned = cannedAnswer(q);
      if (canned) {
        await wait(composeDelay(canned));
        setMessages([...next, { role: "assistant", content: canned }]);
        return;
      }
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1).slice(-10) }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, I can't connect right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FlowSection
      id="ask"
      step="06"
      shape="terminal"
      label="Input"
      title="Ask my AI assistant"
      intro="Short on time? Ask a question and get an answer based on my real experience."
    >
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-neon/40 bg-sunken shadow-[0_0_80px_-20px_rgb(var(--glow)/0.6)] backdrop-blur">
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
        <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-coral" />
          <span className="h-3 w-3 rounded-full bg-fg/30" />
          <span className="h-3 w-3 rounded-full bg-fg/30" />
          <span className="ml-3 font-mono text-xs text-fg/60">ask-{profile.shortName.toLowerCase()}.exe</span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-neon">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" /> online
          </span>
        </div>

        <div ref={boxRef} className="max-h-80 min-h-32 space-y-4 overflow-y-auto p-5 md:h-[clamp(12rem,calc(100svh-30rem),24rem)] md:max-h-none" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <p
                className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-coral text-white glow-coral" : "border border-neon/20 bg-neon/5 text-fg"
                }`}
              >
                {m.content}
              </p>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start" role="status">
              <div className="flex items-center gap-2 rounded-xl border border-neon/20 bg-neon/5 px-4 py-2.5">
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </span>
                <span className="font-mono text-xs text-neon/80">composing reply</span>
              </div>
            </div>
          )}
        </div>

        {/* suggestion chips disappear once that question has been asked */}
        {unasked.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            <AnimatePresence initial={false}>
              {unasked.map((s) => (
                <motion.button
                  key={s}
                  layout
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => send(s)}
                  className="rounded-full border border-edge px-3 py-1 text-xs text-fg/80 transition-colors hover:border-neon hover:text-neon"
                >
                  {s}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 border-t border-edge p-3"
        >
          <span className="self-center pl-2 font-mono text-neon">&gt;</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            placeholder="Type your question..."
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-fg placeholder:text-fg/40 focus:outline-none"
          />
          <button
            disabled={loading || !input.trim()}
            className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral-deep disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </FlowSection>
  );
}
