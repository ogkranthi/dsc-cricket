import { notFound } from "next/navigation";
import { getMatch, getMatches, getPlayer } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return getMatches().map((m) => ({ id: m.id }));
}

export function generateMetadata() {
  return { title: "Match Details | DSC Cricket" };
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = getMatch(id);
  if (!match) notFound();

  const motmPlayer = match.motm ? getPlayer(match.motm) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Match header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-black tracking-tight text-white">DSC vs {match.opponent}</h1>
          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded ${
            match.result === "Won" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
          }`}>
            {match.result}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          {new Date(match.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          {" · "}{match.venue} · {match.matchType}
        </p>
        {match.tossWinner && (
          <p className="text-xs text-slate-600 mt-1">
            Toss: {match.tossWinner} elected to {match.tossDecision}
          </p>
        )}
      </div>

      {/* Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl gradient-card border border-green-900/30 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-green-500 font-semibold mb-2">DSC</p>
          <p className="text-4xl font-black stat-number">{match.dscScore}</p>
        </div>
        <div className="rounded-xl gradient-card border border-slate-800 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-2">{match.opponent}</p>
          <p className="text-4xl font-black text-slate-300">{match.opponentScore}</p>
        </div>
      </div>

      {/* MOTM */}
      {motmPlayer && (
        <div className="rounded-xl border-glow-gold bg-gradient-to-r from-[#111827] via-[#1a1a0a] to-[#111827] p-6 glow-gold">
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-500 font-semibold mb-2">Man of the Match</p>
          <p className="font-black text-xl text-white">{motmPlayer.name}</p>
          <p className="text-sm text-slate-400 mt-1">{match.motmReason}</p>
        </div>
      )}

      {/* Batting scorecard */}
      {match.batting && match.batting.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 mb-4">DSC Batting</h2>
          <div className="rounded-xl gradient-card border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-green-600/5">
                    <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Batter</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-green-500 font-semibold px-4 py-3">R</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">B</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">4s</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">6s</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">SR</th>
                    <th className="text-left text-[10px] uppercase tracking-wider text-slate-600 font-semibold px-4 py-3">Dismissal</th>
                  </tr>
                </thead>
                <tbody>
                  {match.batting.map((inn) => (
                    <tr key={inn.playerId} className="border-b border-slate-800/50 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-semibold text-white text-sm">{inn.playerName}</td>
                      <td className="text-right px-4 py-3 text-sm font-bold text-green-400">{inn.runs}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.balls}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.fours}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.sixes}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.strikeRate.toFixed(1)}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{inn.howOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Bowling scorecard */}
      {match.bowling && match.bowling.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-red-400 mb-4">DSC Bowling</h2>
          <div className="rounded-xl gradient-card border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-red-600/5">
                    <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Bowler</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">O</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">M</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">R</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-red-400 font-semibold px-4 py-3">W</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {match.bowling.map((inn) => (
                    <tr key={inn.playerId} className="border-b border-slate-800/50 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-semibold text-white text-sm">{inn.playerName}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.overs}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.maidens}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.runs}</td>
                      <td className="text-right px-4 py-3 text-sm font-bold text-red-400">{inn.wickets}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{inn.economy.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* AI Match Report */}
      {match.aiReport && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 mb-4">Match Report</h2>
          <div className="rounded-xl gradient-card border border-slate-800 p-6">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold tracking-wider uppercase mb-4">
              AI Generated
            </div>
            {match.aiReport.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed text-slate-300">{para}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
