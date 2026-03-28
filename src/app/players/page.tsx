import Link from "next/link";
import { getPlayers } from "@/lib/content";

export const metadata = { title: "Squad | DSC Cricket" };

const roleColors: Record<string, string> = {
  Batsman: "bg-green-500/15 text-green-400 border-green-600/30",
  Bowler: "bg-red-500/15 text-red-400 border-red-600/30",
  "All-Rounder": "bg-blue-500/15 text-blue-400 border-blue-600/30",
  "Wicket-Keeper": "bg-yellow-500/15 text-yellow-400 border-yellow-600/30",
};

export default function PlayersPage() {
  const players = getPlayers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight text-white mb-2">THE SQUAD</h1>
      <p className="text-sm text-slate-500 mb-8">Meet the DSC players</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <Link key={player.id} href={`/players/${player.id}`}>
            <div className="rounded-xl gradient-card border border-slate-800 p-6 text-center hover:border-green-900/40 hover:scale-[1.03] transition-all group">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-900/20 border-2 border-green-600/20 flex items-center justify-center text-2xl font-black text-green-400 group-hover:border-green-500/40 transition-colors">
                {player.name.split(" ").map((n) => n[0]).join("")}
              </div>
              {player.jerseyNumber && (
                <p className="text-xs text-slate-600 font-bold mt-2">#{player.jerseyNumber}</p>
              )}
              <p className="font-bold text-white mt-2">{player.name}</p>
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
