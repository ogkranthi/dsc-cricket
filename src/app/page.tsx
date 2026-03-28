import Link from "next/link";
import { getMatches, getTeamStats, getSchedule, getPosts, getBattingLeaderboard } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const matches = getMatches();
  const stats = getTeamStats();
  const schedule = getSchedule();
  const posts = getPosts();
  const topBatters = getBattingLeaderboard().slice(0, 3);

  const recentMatches = matches.filter((m) => m.result !== "Upcoming").slice(0, 3);
  const nextFixture = schedule.find((f) => f.status === "upcoming");
  const latestPost = posts[0];

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full border border-[#213661]/30" />
          <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full border border-orange-500/20" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#213661]/20 border border-[#213661]/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Season 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.9]">
              DSC<br />
              <span className="text-orange-500">CRICKET</span>
            </h1>
            <p className="text-lg text-slate-400 mt-6 max-w-md">
              Match reports, live stats, player profiles, and everything DSC. Powered by AI.
            </p>
            <div className="flex gap-3 mt-8">
              <Link
                href="/matches"
                className="px-6 py-3 rounded-lg gradient-navy text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity shadow-lg shadow-[#213661]/30"
              >
                VIEW MATCHES
              </Link>
              <Link
                href="/players"
                className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/10 transition-colors"
              >
                MEET THE SQUAD
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#213661]/30 bg-[#0d1420]">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-5 divide-x divide-slate-800">
            {[
              { label: "PLAYED", value: stats.played },
              { label: "WON", value: stats.won },
              { label: "LOST", value: stats.lost },
              { label: "TIED", value: stats.tied },
              { label: "WIN %", value: stats.played > 0 ? `${Math.round((stats.won / stats.played) * 100)}%` : "-" },
            ].map((s) => (
              <div key={s.label} className="text-center px-2">
                <p className="text-2xl md:text-3xl font-black stat-number">{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
        {/* Next match */}
        {nextFixture && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Next Match</h2>
            <div className="rounded-xl border-glow-orange bg-gradient-to-r from-[#111827] via-[#1a1510] to-[#111827] p-6 glow-orange">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl gradient-navy flex items-center justify-center font-black text-white text-xl shadow-lg">
                    DSC
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-orange-500 font-semibold">VS</p>
                    <p className="text-xl font-bold text-white">{nextFixture.opponent}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-lg font-bold text-white">
                    {new Date(nextFixture.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-slate-400">{nextFixture.time} &middot; {nextFixture.venue}</p>
                  <Badge className="mt-2 bg-orange-600/20 text-orange-500 border-orange-600/30">{nextFixture.matchType}</Badge>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Recent Results</h2>
            <Link href="/matches" className="text-xs text-slate-400 hover:text-orange-400 font-semibold tracking-wider uppercase transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recentMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <div className={`rounded-xl gradient-card p-5 hover:scale-[1.02] transition-transform border ${
                  match.result === "Won" ? "border-[#213661]/40 hover:border-blue-500/40" : "border-red-900/30 hover:border-red-600/40"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      match.result === "Won"
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-red-500/15 text-red-400"
                    }`}>
                      {match.result}
                    </span>
                  </div>
                  <p className="font-bold text-white text-lg">vs {match.opponent}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-400 font-semibold">DSC</span>
                      <span className="text-white font-bold">{match.dscScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{match.opponent}</span>
                      <span className="text-slate-300">{match.opponentScore}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">{match.venue}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top performers */}
        {topBatters.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Top Run Scorers</h2>
              <Link href="/leaderboard" className="text-xs text-slate-400 hover:text-orange-400 font-semibold tracking-wider uppercase transition-colors">
                Full stats &rarr;
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {topBatters.map((player, i) => {
                const medals = ["bg-orange-500", "bg-slate-400", "bg-amber-700"];
                return (
                  <div key={player.playerId} className="rounded-xl gradient-card border border-slate-800 p-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${medals[i]} flex items-center justify-center text-white font-black text-sm`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{player.playerName}</p>
                      <p className="text-xs text-slate-500">{player.matches} matches</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black stat-number">{player.runs}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">runs</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Latest news */}
        {latestPost && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Latest News</h2>
              <Link href="/news" className="text-xs text-slate-400 hover:text-orange-400 font-semibold tracking-wider uppercase transition-colors">
                All articles &rarr;
              </Link>
            </div>
            <Link href={`/news/${latestPost.slug}`}>
              <div className="rounded-xl gradient-card border border-slate-800 p-6 hover:border-[#213661]/50 transition-colors">
                <Badge className="bg-[#213661]/20 text-blue-400 border-[#213661]/40 mb-3">{latestPost.category}</Badge>
                <h3 className="text-xl font-bold text-white mb-2">{latestPost.title}</h3>
                <p className="text-slate-400 text-sm">{latestPost.excerpt}</p>
                <p className="text-xs text-slate-600 mt-3">
                  {new Date(latestPost.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
