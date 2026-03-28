import Link from "next/link";
import { getPlayers } from "@/lib/content";

export const metadata = { title: "Squad | DSC Cricket" };

const roleColors: Record<string, string> = {
  Batsman: "bg-blue-500/15 text-blue-400 border-blue-600/30",
  Bowler: "bg-red-500/15 text-red-400 border-red-600/30",
  "All-Rounder": "bg-orange-500/15 text-orange-400 border-orange-600/30",
  "Wicket-Keeper": "bg-yellow-500/15 text-yellow-400 border-yellow-600/30",
};

export default function PlayersPage() {
  const players = getPlayers().sort((a, b) => {
    if (a.captain) return -1;
    if (b.captain) return 1;
    if (a.viceCaptain) return -1;
    if (b.viceCaptain) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight text-white mb-2">THE SQUAD</h1>
      <p className="text-sm text-slate-500 mb-8">Meet the DSC players</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <Link key={player.id} href={`/players/${player.id}`}>
            <div className="rounded-xl gradient-card border border-slate-800 p-6 text-center hover:border-[#213661]/50 hover:scale-[1.03] transition-all group">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#213661]/30 to-[#213661]/10 border-2 border-[#213661]/30 flex items-center justify-center text-2xl font-black text-blue-400 group-hover:border-orange-500/40 transition-colors">
                {player.name.split(" ").map((n) => n[0]).join("")}
              </div>
              {player.jerseyNumber && (
                <p className="text-xs text-slate-600 font-bold mt-2">#{player.jerseyNumber}</p>
              )}
              <p className="font-bold text-white mt-2">{player.name}</p>
              {player.captain && (
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 bg-orange-500/20 text-orange-400 border border-orange-600/30">
                  Captain
                </span>
              )}
              {player.viceCaptain && (
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 bg-blue-500/15 text-blue-400 border border-blue-600/30">
                  Vice Captain
                </span>
              )}
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 border ${roleColors[player.role] || "bg-slate-500/15 text-slate-400"}`}>
                {player.role}
              </span>
              <p className="text-xs text-slate-500 mt-2">{player.battingStyle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
