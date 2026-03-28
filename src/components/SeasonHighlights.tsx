"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Season } from "@/lib/content";

const typeLabels: Record<string, string> = {
  moment: "HIGHLIGHT",
  achievement: "ACHIEVEMENT",
  performance: "STANDOUT",
  culture: "TEAM",
};

export function SeasonHighlights({ season }: { season: Season }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const totalPlayed = season.tournaments.reduce((a, t) => a + t.played, 0);
  const totalWon = season.tournaments.reduce((a, t) => a + t.won, 0);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <p className="section-label text-[#ff8c2a]">{season.year} Season</p>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scroll("left")} className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-colors" aria-label="Scroll left">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scroll("right")} className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-colors" aria-label="Scroll right">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1" style={{ scrollbarWidth: "none" }}>
        {/* Overview */}
        <div className="flex-shrink-0 w-[280px] snap-start rounded-xl gradient-card border border-[#ff8c2a]/10 p-4 space-y-3">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#ff8c2a] font-bold">Overview</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xl font-black stat-number">{totalPlayed}</p>
              <p className="text-[8px] uppercase tracking-widest text-slate-600 font-semibold">Played</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black stat-number">{totalWon}</p>
              <p className="text-[8px] uppercase tracking-widest text-slate-600 font-semibold">Won</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black stat-number">{season.overallWinPct}%</p>
              <p className="text-[8px] uppercase tracking-widest text-slate-600 font-semibold">Win %</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center pt-1">
            <div className="text-center">
              <p className="text-base font-black text-[#ff8c2a]">{season.teamRating}<span className="text-[10px] text-slate-600">/10</span></p>
              <p className="text-[8px] uppercase tracking-widest text-slate-600 font-semibold">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-base font-black text-[#ff8c2a]">{season.captaincyRating}<span className="text-[10px] text-slate-600">/10</span></p>
              <p className="text-[8px] uppercase tracking-widest text-slate-600 font-semibold">Captain</p>
            </div>
          </div>
        </div>

        {/* Tournaments */}
        <div className="flex-shrink-0 w-[280px] snap-start rounded-xl gradient-card border border-white/[0.04] p-4 space-y-2">
          <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-bold">Leagues</p>
          {season.tournaments.map((t) => (
            <div key={t.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0">
              <span className="text-xs font-bold text-white">{t.name}</span>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-400 font-semibold">{t.won}W-{t.lost}L</span>
                <span className="text-[10px] text-[#ff8c2a] font-bold">{t.position}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        {season.highlights.map((h, i) => (
          <div key={i} className="flex-shrink-0 w-[240px] snap-start rounded-xl gradient-card border border-white/[0.04] p-4 flex flex-col">
            <p className="text-[9px] uppercase tracking-[0.25em] text-slate-600 font-bold mb-2">{typeLabels[h.type] || "HIGHLIGHT"}</p>
            <p className="text-sm font-extrabold text-white tracking-tight mb-1.5">{h.title}</p>
            <p className="text-[11px] text-slate-500 leading-relaxed flex-1">{h.description}</p>
          </div>
        ))}

        {/* MoTM */}
        {season.motm.map((m, i) => (
          <div key={`motm-${i}`} className="flex-shrink-0 w-[240px] snap-start rounded-xl bg-gradient-to-b from-[#15120d] to-[#0e1117] border border-[#ff8c2a]/10 p-4 flex flex-col">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#ff8c2a] font-bold mb-2">MOTM</p>
            {m.photo && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2.5 bg-slate-900">
                <Image src={m.photo} alt={m.player} fill className="object-cover" sizes="240px" />
              </div>
            )}
            <p className="text-sm font-extrabold text-white tracking-tight">{m.player}</p>
            <p className="text-[11px] text-[#ff8c2a] font-bold mt-1">{m.performance}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{m.match}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
