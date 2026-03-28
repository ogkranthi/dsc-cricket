import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata = { title: "DCL 2026 | DSC Cricket" };

interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

interface TournamentMatch {
  id: string;
  round: string;
  matchNumber: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  description?: string;
  winner?: string;
  team1Score?: string;
  team2Score?: string;
}

function getTournament() {
  const filePath = path.join(process.cwd(), "content/tournaments/dcl-2026.mdx");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  return data as {
    name: string;
    fullName: string;
    season: number;
    status: string;
    teams: Team[];
    schedule: TournamentMatch[];
  };
}

const teamColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Gladiators: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", badge: "bg-red-500" },
  Globetrotters: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", badge: "bg-blue-500" },
  Spartans: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", badge: "bg-amber-500" },
};

function getTeamStyle(name: string) {
  return teamColors[name] || { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30", badge: "bg-slate-500" };
}

export default function DCLPage() {
  const tournament = getTournament();
  const { teams, schedule } = tournament;

  const roundRobin = schedule.filter((m) => m.round === "Round Robin");
  const playoffs = schedule.filter((m) => m.round === "Qualifier" || m.round === "Eliminator");
  const final = schedule.filter((m) => m.round === "Final");

  // Build standings
  const standings = teams.map((team) => {
    const teamMatches = roundRobin.filter(
      (m) => (m.team1 === team.name || m.team2 === team.name) && m.status === "completed"
    );
    const wins = teamMatches.filter((m) => m.winner === team.name).length;
    const losses = teamMatches.length - wins;
    return { ...team, played: teamMatches.length, wins, losses, points: wins * 2 };
  }).sort((a, b) => b.points - a.points || b.wins - a.wins);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Season 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
          DCL <span className="text-orange-500">2026</span>
        </h1>
        <p className="text-slate-400 mt-2">DSC Cricket League — 3 Teams, 1 Champion</p>
      </div>

      {/* Teams */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Teams</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {teams.map((team) => {
            const style = getTeamStyle(team.name);
            return (
              <div key={team.id} className={`rounded-xl gradient-card border ${style.border} p-6 text-center`}>
                <div className={`w-16 h-16 mx-auto rounded-full ${style.badge} flex items-center justify-center font-black text-white text-lg shadow-lg mb-3`}>
                  {team.shortName}
                </div>
                <p className={`text-xl font-black ${style.text}`}>{team.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Standings */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Standings</h2>
        <div className="rounded-xl gradient-card border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-[#213661]/10">
                <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3 w-8">#</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Team</th>
                <th className="text-center text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">P</th>
                <th className="text-center text-[10px] uppercase tracking-wider text-blue-400 font-semibold px-4 py-3">W</th>
                <th className="text-center text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">L</th>
                <th className="text-center text-[10px] uppercase tracking-wider text-orange-500 font-semibold px-4 py-3">PTS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, i) => {
                const style = getTeamStyle(team.name);
                return (
                  <tr key={team.id} className="border-b border-slate-800/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <span className={`text-xs font-black ${i === 0 ? "text-orange-500" : "text-slate-600"}`}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${style.badge} flex items-center justify-center font-black text-white text-[10px]`}>
                          {team.shortName}
                        </div>
                        <span className="font-bold text-white text-sm">{team.name}</span>
                      </div>
                    </td>
                    <td className="text-center px-4 py-3 text-sm text-slate-400">{team.played}</td>
                    <td className="text-center px-4 py-3 text-sm font-bold text-blue-400">{team.wins}</td>
                    <td className="text-center px-4 py-3 text-sm text-slate-400">{team.losses}</td>
                    <td className="text-center px-4 py-3 text-sm font-black text-orange-400">{team.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Round Robin */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Round Robin</h2>
        <div className="space-y-3">
          {roundRobin.map((match) => {
            const t1Style = getTeamStyle(match.team1);
            const t2Style = getTeamStyle(match.team2);
            return (
              <div key={match.id} className="rounded-xl gradient-card border border-slate-800 p-5 hover:border-[#213661]/40 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">Match {match.matchNumber}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                    {new Date(match.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {match.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full ${t1Style.badge} flex items-center justify-center font-black text-white text-[10px]`}>
                      {match.team1.substring(0, 3).toUpperCase()}
                    </div>
                    <span className={`font-bold text-sm ${t1Style.text}`}>{match.team1}</span>
                  </div>
                  <div className="px-4">
                    {match.status === "completed" ? (
                      <div className="text-center">
                        <p className="text-white font-black text-lg">{match.team1Score} - {match.team2Score}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">VS</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className={`font-bold text-sm ${t2Style.text}`}>{match.team2}</span>
                    <div className={`w-10 h-10 rounded-full ${t2Style.badge} flex items-center justify-center font-black text-white text-[10px]`}>
                      {match.team2.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                </div>
                {match.winner && (
                  <p className="text-xs text-center mt-3 text-slate-500">
                    <span className="font-bold text-white">{match.winner}</span> won
                  </p>
                )}
                <p className="text-[10px] text-slate-600 text-center mt-2">{match.venue}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Playoffs */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-4">Playoffs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {playoffs.map((match) => (
            <div key={match.id} className="rounded-xl gradient-card border border-orange-500/20 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400">{match.round}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">Match {match.matchNumber}</span>
              </div>
              <div className="flex items-center justify-between my-4">
                <span className="font-bold text-white">{match.team1}</span>
                <span className="text-xs font-bold text-slate-600">VS</span>
                <span className="font-bold text-white">{match.team2}</span>
              </div>
              <p className="text-[10px] text-slate-500">{match.description}</p>
              <div className="flex items-center justify-between mt-3 text-[10px] text-slate-600">
                <span>{new Date(match.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {match.time}</span>
                <span>{match.venue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final */}
      <section>
        {final.map((match) => (
          <div key={match.id} className="rounded-xl border-glow-orange bg-gradient-to-r from-[#111827] via-[#1a1510] to-[#111827] p-8 glow-orange text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-black mb-3">Championship Final</p>
            <div className="flex items-center justify-center gap-6 my-4">
              <span className="text-xl font-black text-white">{match.team1}</span>
              <span className="text-sm font-bold text-slate-600">VS</span>
              <span className="text-xl font-black text-white">{match.team2}</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              {new Date(match.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {match.time}
            </p>
            <p className="text-xs text-slate-600 mt-1">{match.venue}</p>
          </div>
        ))}
      </section>

      {/* Tournament format */}
      <section className="rounded-xl gradient-card border border-slate-800 p-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Tournament Format</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-bold text-white mb-1">Round Robin</p>
            <p className="text-slate-400 text-xs">Each team plays every other team twice. Top 2 qualify for playoffs.</p>
          </div>
          <div>
            <p className="font-bold text-white mb-1">Playoffs</p>
            <p className="text-slate-400 text-xs">Qualifier: 1st vs 2nd (winner to Final). Eliminator: Loser of Qualifier vs 3rd (winner to Final).</p>
          </div>
          <div>
            <p className="font-bold text-white mb-1">Final</p>
            <p className="text-slate-400 text-xs">Qualifier winner vs Eliminator winner. The ultimate showdown for the DCL crown.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
