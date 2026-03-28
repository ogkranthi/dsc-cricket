import { getBattingLeaderboard, getBowlingLeaderboard } from "@/lib/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Stats | DSC Cricket" };

export default function LeaderboardPage() {
  const batting = getBattingLeaderboard();
  const bowling = getBowlingLeaderboard();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight text-white mb-2">LEADERBOARD</h1>
      <p className="text-sm text-slate-500 mb-8">Season statistics and rankings</p>

      <Tabs defaultValue="batting">
        <TabsList className="bg-[#111827] border border-slate-800 mb-6">
          <TabsTrigger value="batting" className="data-[state=active]:bg-[#213661] data-[state=active]:text-white font-bold text-xs tracking-wider uppercase">
            Batting
          </TabsTrigger>
          <TabsTrigger value="bowling" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-bold text-xs tracking-wider uppercase">
            Bowling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batting">
          <div className="rounded-xl gradient-card border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#213661]/10">
                    <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3 w-8">#</th>
                    <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Player</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">M</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-orange-500 font-semibold px-4 py-3">Runs</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Avg</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">HS</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">50s</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">4s</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">6s</th>
                  </tr>
                </thead>
                <tbody>
                  {batting.map((player, i) => (
                    <tr key={player.playerId} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-black ${i === 0 ? "text-orange-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-slate-600"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-white text-sm">{player.playerName}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.matches}</td>
                      <td className="text-right px-4 py-3 text-sm font-bold text-orange-400">{player.runs}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.average.toFixed(1)}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-300">{player.highScore}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.fifties}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.fours}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.sixes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bowling">
          <div className="rounded-xl gradient-card border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-red-600/5">
                    <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3 w-8">#</th>
                    <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Player</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">M</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-red-400 font-semibold px-4 py-3">W</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Overs</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Runs</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Avg</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Econ</th>
                    <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-4 py-3">Best</th>
                  </tr>
                </thead>
                <tbody>
                  {bowling.map((player, i) => (
                    <tr key={player.playerId} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-black ${i === 0 ? "text-orange-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-slate-600"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-white text-sm">{player.playerName}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.matches}</td>
                      <td className="text-right px-4 py-3 text-sm font-bold text-red-400">{player.wickets}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.overs}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.runs}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.average.toFixed(1)}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-400">{player.economy.toFixed(1)}</td>
                      <td className="text-right px-4 py-3 text-sm text-slate-300">{player.bestFigures}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
