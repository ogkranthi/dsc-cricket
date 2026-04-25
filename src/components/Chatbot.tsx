"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "bot" | "user"; text: string; suggestions?: string[] };

type Faq = {
  keywords: string[];
  answer: string;
  suggestions?: string[];
};

const SUGGESTIONS = [
  "Where are you based?",
  "How do I see fixtures?",
  "Where can I watch matches?",
  "Who's on the squad?",
  "What is DCL?",
];

const FAQS: Faq[] = [
  {
    keywords: ["where", "based", "location", "city", "state", "massachusetts", "ma"],
    answer:
      "Deccan Sports Club is based in Massachusetts and was established in 2023.",
  },
  {
    keywords: ["fixture", "schedule", "upcoming", "next match", "next game", "when"],
    answer: "You can find upcoming fixtures on the Fixtures page.",
    suggestions: ["Go to /schedule", "Show recent results"],
  },
  {
    keywords: ["result", "recent", "match report", "scorecard", "matches", "past"],
    answer: "Match reports and scorecards are on the Matches page.",
    suggestions: ["Go to /matches", "Show season stats"],
  },
  {
    keywords: ["squad", "player", "team", "roster", "lineup", "who plays"],
    answer: "The full squad is on the Squad page.",
    suggestions: ["Go to /players", "Show top run scorers"],
  },
  {
    keywords: ["stat", "leader", "leaderboard", "top", "run", "wicket", "average"],
    answer: "Batting and bowling leaders are on the Stats page.",
    suggestions: ["Go to /leaderboard"],
  },
  {
    keywords: ["news", "post", "article", "blog", "preview", "recap"],
    answer: "Latest news and posts are on the News page.",
    suggestions: ["Go to /news"],
  },
  {
    keywords: ["dcl", "deccan cricket league", "tournament"],
    answer:
      "DCL is the Deccan Cricket League — head over to the DCL page for standings, fixtures, and team info.",
    suggestions: ["Go to /dcl"],
  },
  {
    keywords: ["watch", "stream", "live", "video", "youtube"],
    answer:
      "We stream and upload matches to our YouTube channel: youtube.com/@dsc-ma.",
  },
  {
    keywords: ["cricclubs", "register", "scoring", "official"],
    answer:
      "Official scoring and registration are on CricClubs — there's a link in the footer.",
  },
  {
    keywords: ["join", "trial", "play for", "signup", "sign up", "contact"],
    answer:
      "Interested in playing? Reach out via our YouTube channel or CricClubs profile linked in the footer.",
  },
  {
    keywords: ["hi", "hello", "hey", "yo", "sup"],
    answer: "Hey! Ask me about fixtures, the squad, results, or DCL.",
    suggestions: SUGGESTIONS,
  },
  {
    keywords: ["thanks", "thank you", "thx", "ty"],
    answer: "Anytime. Howzat! 🏏",
  },
];

const ROUTE_HINTS: Record<string, string> = {
  "/schedule": "Fixtures",
  "/matches": "Matches",
  "/players": "Squad",
  "/leaderboard": "Stats",
  "/news": "News",
  "/dcl": "DCL",
};

function findAnswer(input: string): { answer: string; suggestions?: string[] } {
  const q = input.toLowerCase();

  for (const path of Object.keys(ROUTE_HINTS)) {
    if (q.includes(path)) {
      return {
        answer: `Opening the ${ROUTE_HINTS[path]} page in a new tab.`,
        suggestions: [`__open:${path}`],
      };
    }
  }

  let best: { faq: Faq; score: number } | null = null;
  for (const faq of FAQS) {
    const score = faq.keywords.reduce(
      (acc, kw) => (q.includes(kw) ? acc + kw.length : acc),
      0,
    );
    if (score > 0 && (!best || score > best.score)) best = { faq, score };
  }

  if (best) return { answer: best.faq.answer, suggestions: best.faq.suggestions };

  return {
    answer:
      "I don't have an answer for that yet. Try asking about fixtures, results, the squad, stats, news, or DCL.",
    suggestions: SUGGESTIONS,
  };
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm the DSC bot. Pick a question or type your own.",
      suggestions: SUGGESTIONS,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = findAnswer(trimmed);
    setMessages((m) => [
      ...m,
      { role: "user", text: trimmed },
      { role: "bot", text: reply.answer, suggestions: reply.suggestions },
    ]);
    setInput("");
  }

  function handleSuggestion(s: string) {
    if (s.startsWith("__open:")) {
      window.open(s.slice("__open:".length), "_blank", "noopener,noreferrer");
      return;
    }
    if (s.startsWith("Go to ")) {
      window.open(s.slice("Go to ".length), "_blank", "noopener,noreferrer");
      return;
    }
    send(s);
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ff8c2a] text-black shadow-lg shadow-black/40 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="DSC chatbot"
          className="fixed bottom-20 right-5 z-50 flex h-[28rem] w-[20rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0e14] shadow-2xl shadow-black/60"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0a0c11] px-4 py-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ff8c2a]/10 text-[#ff8c2a]">
              <Bot size={16} />
            </span>
            <div className="leading-tight">
              <p className="text-[12px] font-bold tracking-tight text-white">DSC Bot</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Ask away</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className="space-y-2">
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-[12px] leading-relaxed",
                    m.role === "bot"
                      ? "bg-white/[0.04] text-slate-200"
                      : "ml-auto bg-[#ff8c2a] text-black",
                  )}
                >
                  {m.text}
                </div>
                {m.role === "bot" && m.suggestions && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.suggestions.map((s) => {
                      const label = s.startsWith("__open:")
                        ? `Open ${ROUTE_HINTS[s.slice("__open:".length)] ?? s.slice("__open:".length)}`
                        : s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSuggestion(s)}
                          className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-slate-300 hover:border-[#ff8c2a]/40 hover:text-white"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-white/[0.06] bg-[#0a0c11] px-3 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fixtures, squad, DCL…"
              className="flex-1 rounded-md bg-white/[0.04] px-3 py-2 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff8c2a]/50"
            />
            <button
              type="submit"
              aria-label="Send"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#ff8c2a] text-black hover:brightness-110 disabled:opacity-40"
              disabled={!input.trim()}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
