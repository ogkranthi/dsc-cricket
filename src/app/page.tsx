import Link from "next/link";
import { getMatches, getTeamStats, getSchedule, getPosts, getBattingLeaderboard, getSeasons } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { SeasonHighlights } from "@/components/SeasonHighlights";

export default function HomePage() {
  const matches = getMatches();
  const stats = getTeamStats();
  const schedule = getSchedule();
  const posts = getPosts();
  const topBatters = getBattingLeaderboard().slice(0, 3);

  const seasons = getSeasons();
  const recentMatches = matches.filter((m) => m.result !== "Upcoming").slice(0, 3);
  const nextFixture = schedule.find((f) => f.status === "upcoming");
  const latestPost = posts[0];

  return (
    <div>
      {/* Hero — clean, bold, sports-focused */}
      <section className="relative overflow-hidden bg-[#08090d]">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ff8c2a]/[0.03] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1e3a5f]/[0.08] blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 relative">
          <div className="max-w-xl">
            <p className="text-[#ff8c2a] text-xs font-bold tracking-[0.25em] uppercase mb-4">Season 2026</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.95]">
              DECCAN<br />SPORTS CLUB
            </h1>
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              Match reports, scorecards, player stats, and team updates.
            </p>
            <div className="flex gap-3 mt-7">
              <Link
                href="/matches"
                className="px-5 py-2.5 rounded-lg bg-[#ff8c2a] text-white font-bold text-xs tracking-wider hover:bg-[#e07a20] transition-colors"
              >
                MATCHES
              </Link>
              <Link
                href="/players"
                className="px-5 py-2.5 rounded-lg bg-white/[0.06] text-white font-bold text-xs tracking-wider hover:bg-white/[0.1] transition-colors"
              >
                SQUAD
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/[0.04] bg-[#0a0c12]">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: "PLAYED", value: stats.played },
              { label: "WON", value: stats.won },
              { label: "LOST", value: stats.lost },
              { label: "TIED", value: stats.tied },
              { label: "WIN %", value: stats.played > 0 ? `${Math.round((stats.won / stats.played) * 100)}%` : "-" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl md:text-2xl font-black stat-number">{s.value}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        {/* Next match */}
        {nextFixture && (
          <section>
            <p className="section-label text-[#ff8c2a] mb-3">Next Match</p>
            <div className="rounded-xl bg-gradient-to-r from-[#0e1117] via-[#15120d] to-[#0e1117] p-5 border border-[#ff8c2a]/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  <img src="/logo.svg" alt="DSC" width={48} height={48} className="rounded-xl" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#ff8c2a] font-bold">VS</p>
                    <p className="text-lg font-extrabold text-white tracking-tight">{nextFixture.opponent}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm font-bold text-white">
                    {new Date(nextFixture.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{nextFixture.time} &middot; {nextFixture.venue}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#ff8c2a]/10 text-[#ff8c2a]">{nextFixture.matchType}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent results */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label text-slate-400">Recent Results</p>
            <Link href="/matches" className="text-[11px] text-slate-500 hover:text-[#ff8c2a] font-semibold tracking-wider uppercase transition-colors">
              All &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {recentMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <div className={`rounded-xl gradient-card p-4 card-hover border ${
                  match.result === "Won" ? "border-emerald-500/10" : "border-rose-500/10"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
                      {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                      match.result === "Won" ? "badge-won" : "badge-lost"
                    }`}>
                      {match.result}
                    </span>
                  </div>
                  <p className="font-extrabold text-white text-base tracking-tight">vs {match.opponent}</p>
                  <div className="mt-2.5 space-y-0.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#ff8c2a] font-bold text-xs">DSC</span>
                      <span className="text-white font-bold text-xs">{match.dscScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 text-xs">{match.opponent}</span>
                      <span className="text-slate-400 text-xs">{match.opponentScore}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top performers */}
        {topBatters.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label text-slate-400">Top Run Scorers</p>
              <Link href="/leaderboard" className="text-[11px] text-slate-500 hover:text-[#ff8c2a] font-semibold tracking-wider uppercase transition-colors">
                Stats &rarr;
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {topBatters.map((player, i) => {
                const rankColors = ["text-[#ff8c2a]", "text-slate-400", "text-amber-700"];
                return (
                  <div key={player.playerId} className="rounded-xl gradient-card border border-white/[0.04] p-4 flex items-center gap-3.5">
                    <span className={`text-2xl font-black ${rankColors[i]} w-8 text-center`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{player.playerName}</p>
                      <p className="text-[10px] text-slate-600">{player.matches} matches</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black stat-number">{player.runs}</p>
                      <p className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold">runs</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Season highlights */}
        {seasons.map((season) => (
          <SeasonHighlights key={season.year} season={season} />
        ))}

        {/* Latest news */}
        {latestPost && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label text-slate-400">Latest</p>
              <Link href="/news" className="text-[11px] text-slate-500 hover:text-[#ff8c2a] font-semibold tracking-wider uppercase transition-colors">
                All &rarr;
              </Link>
            </div>
            <Link href={`/news/${latestPost.slug}`}>
              <div className="rounded-xl gradient-card border border-white/[0.04] p-5 card-hover">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#ff8c2a]">{latestPost.category}</span>
                <h3 className="text-lg font-extrabold text-white mt-1.5 tracking-tight">{latestPost.title}</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{latestPost.excerpt}</p>
                <p className="text-[10px] text-slate-700 mt-3 font-semibold">
                  {new Date(latestPost.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
