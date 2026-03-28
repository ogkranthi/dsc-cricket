import Link from "next/link";
import { getMatches } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Matches | DSC Cricket" };

export default function MatchesPage() {
  const matches = getMatches();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight text-white mb-2">MATCHES</h1>
      <p className="text-sm text-slate-500 mb-8">All DSC match results and scorecards</p>
      <div className="space-y-3">
        {matches.map((match) => (
          <Link key={match.id} href={`/matches/${match.id}`}>
            <div className={`rounded-xl gradient-card p-5 border transition-all hover:scale-[1.01] mb-3 ${
              match.result === "Won" ? "border-[#213661]/30 hover:border-blue-500/40" : "border-red-900/20 hover:border-red-600/30"
            }`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-white">DSC vs {match.opponent}</p>
                    <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      match.result === "Won"
                        ? "bg-blue-500/15 text-blue-400"
                        : match.result === "Lost"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-slate-500/15 text-slate-400"
                    }`}>
                      {match.result}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <span>{new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>{match.venue}</span>
                    <span>{match.matchType}</span>
                    {match.league && <span className="text-orange-400/60">{match.league}</span>}
                    {match.matchStage && match.matchStage !== "League" && <span className="text-blue-400/60">{match.matchStage}</span>}
                  </div>
                </div>
                {match.dscScore && (
                  <div className="text-right space-y-0.5">
                    <p className="text-sm font-bold text-orange-400">DSC: {match.dscScore}</p>
                    <p className="text-sm text-slate-400">{match.opponent}: {match.opponentScore}</p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
