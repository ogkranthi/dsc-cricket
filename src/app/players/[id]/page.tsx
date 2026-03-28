import { notFound } from "next/navigation";
import { getPlayer, getPlayers, getMatches, getBattingLeaderboard, getBowlingLeaderboard } from "@/lib/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function generateStaticParams() {
  return getPlayers().map((p) => ({ id: p.id }));
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) notFound();

  const battingStats = getBattingLeaderboard().find((b) => b.playerId === id);
  const bowlingStats = getBowlingLeaderboard().find((b) => b.playerId === id);

  // Recent performances
  const matches = getMatches().filter((m) => m.result !== "Upcoming");
  const recentPerformances = matches
    .map((m) => {
      const bat = m.batting?.find((b) => b.playerId === id);
      const bowl = m.bowling?.find((b) => b.playerId === id);
      if (!bat && !bowl) return null;
      return { match: m, batting: bat, bowling: bowl };
    })
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Player header */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-3xl font-bold bg-primary/10">
            {player.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{player.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{player.role}</Badge>
            {player.jerseyNumber && <span className="text-muted-foreground">#{player.jerseyNumber}</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {player.battingStyle}
            {player.bowlingStyle && ` · ${player.bowlingStyle}`}
          </p>
        </div>
      </div>

      {player.bio && (
        <p className="text-muted-foreground max-w-2xl">{player.bio}</p>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {battingStats && (
          <Card>
            <CardHeader>
              <CardTitle>Batting Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Matches", value: battingStats.matches },
                  { label: "Runs", value: battingStats.runs },
                  { label: "Average", value: battingStats.average.toFixed(1) },
                  { label: "High Score", value: battingStats.highScore },
                  { label: "50s", value: battingStats.fifties },
                  { label: "4s / 6s", value: `${battingStats.fours} / ${battingStats.sixes}` },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {bowlingStats && bowlingStats.wickets > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Bowling Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Wickets", value: bowlingStats.wickets },
                  { label: "Overs", value: bowlingStats.overs },
                  { label: "Economy", value: bowlingStats.economy.toFixed(1) },
                  { label: "Average", value: bowlingStats.average.toFixed(1) },
                  { label: "Best", value: bowlingStats.bestFigures },
                  { label: "Runs", value: bowlingStats.runs },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Recent performances */}
      {recentPerformances.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Performances</h2>
          <div className="space-y-3">
            {recentPerformances.map((perf) => {
              if (!perf) return null;
              return (
                <Card key={perf.match.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">vs {perf.match.opponent}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(perf.match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        {perf.batting && (
                          <span className="font-semibold">{perf.batting.runs} ({perf.batting.balls})</span>
                        )}
                        {perf.bowling && (
                          <span className="font-semibold">{perf.bowling.wickets}/{perf.bowling.runs} ({perf.bowling.overs} ov)</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
