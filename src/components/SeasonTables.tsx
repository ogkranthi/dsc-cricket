"use client";

import { useState } from "react";
import type seasonData from "@/data/season-2026.json";

type Season = typeof seasonData;
type Player = Season["players"][number] | Season["leagues"][number]["players"][number];
type View = "Batting" | "Bowling" | "Fielding" | "Results";

const views: View[] = ["Batting", "Bowling", "Fielding", "Results"];
const overs = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;
const rate = (value?: number | null) => value == null ? "—" : value.toFixed(2);

type Column = { label: string; value: (p: Player) => React.ReactNode };
const columns: Record<Exclude<View, "Results">, Column[]> = {
  Batting: [
    { label: "Runs", value: (p) => p.runs },
    { label: "Innings", value: (p) => p.innings },
    { label: "Not out", value: (p) => p.notOuts },
    { label: "Balls", value: (p) => p.ballsFaced },
    { label: "Top score", value: (p) => p.highScore ?? "—" },
    { label: "Average", value: (p) => rate(p.average) },
    { label: "Strike rate", value: (p) => rate(p.strikeRate) },
    { label: "4s", value: (p) => p.fours },
    { label: "6s", value: (p) => p.sixes },
    { label: "Ducks", value: (p) => p.ducks },
  ],
  Bowling: [
    { label: "Wickets", value: (p) => p.wickets },
    { label: "Overs", value: (p) => overs(p.ballsBowled) },
    { label: "Runs conceded", value: (p) => p.runsConceded },
    { label: "Economy", value: (p) => rate(p.economy) },
    { label: "Best figures", value: (p) => p.bestBowling ?? "—" },
  ],
  Fielding: [
    { label: "Catches", value: (p) => p.catches },
    { label: "Stumpings", value: (p) => p.stumpings },
    { label: "Run-outs", value: (p) => p.runOuts },
  ],
};

function fieldingTotal(player: Player) {
  return player.catches + player.stumpings + player.runOuts;
}

const headerCell = "whitespace-nowrap px-3 py-3 text-left text-xs font-bold text-slate-300";
const dataCell = "px-3 py-2.5 text-sm text-slate-300";

export function SeasonTables({ season }: { season: Season }) {
  const [leagueId, setLeagueId] = useState("all");
  const [view, setView] = useState<View>("Batting");
  const league = season.leagues.find((item) => item.id === leagueId);
  const players = league?.players ?? season.players;
  const matches = season.matches.filter((match) => !league || match.league === league.id);
  const rows = view === "Batting"
    ? players.filter((p) => p.innings > 0).sort((a, b) => b.runs - a.runs || a.name.localeCompare(b.name))
    : view === "Bowling"
      ? players.filter((p) => p.ballsBowled > 0 || p.wickets > 0).sort((a, b) => b.wickets - a.wickets || (a.economy ?? Infinity) - (b.economy ?? Infinity) || a.name.localeCompare(b.name))
      : players.filter((p) => fieldingTotal(p) > 0).sort((a, b) => fieldingTotal(b) - fieldingTotal(a) || a.name.localeCompare(b.name));

  return (
    <section aria-labelledby="season-tables" className="space-y-4">
      <h2 id="season-tables" className="text-2xl font-extrabold text-white">Season tables</h2>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
          Competition
          <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)} className="w-full sm:w-60 rounded-lg bg-[#0e1117] border border-white/15 px-3 py-2 text-white">
            <option value="all">All competitions</option>
            {season.leagues.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        <div role="group" aria-label="Table view" className="flex flex-wrap gap-2">
          {views.map((tab) => (
            <button key={tab} type="button" onClick={() => setView(tab)} aria-pressed={view === tab}
              className={`rounded-lg px-3 py-2 text-sm font-bold border ${view === tab ? "text-[#13100b] bg-[#ff8c2a] border-[#ff8c2a]" : "text-slate-300 bg-white/5 border-white/10 hover:text-white"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      {league && (
        <p className="text-sm text-slate-400">
          {league.format} · {league.completed} completed{league.abandoned ? ` · ${league.abandoned} abandoned` : ""}
          {league.won !== null && league.lost !== null ? ` · ${league.won} wins, ${league.lost} losses` : ""}
        </p>
      )}
      {view === "Results" ? (
        <div className="space-y-3">
          {(!league || league.id === "t10-blast") && <p className="text-sm text-slate-400">T10 Blast match outcomes are withheld while the results are checked.</p>}
          {matches.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-white/10" role="region" aria-label="Match results" tabIndex={0}>
              <table className="w-full min-w-[30rem] border-collapse">
                <caption className="sr-only">{league?.label ?? "All competitions"} match results</caption>
                <thead className="bg-white/5"><tr>
                  {["Competition", "Opponent", "Outcome", "Details"].map((label) => <th key={label} scope="col" className={headerCell}>{label}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-white/10">
                  {matches.map((match) => (
                    <tr key={match.number}>
                      <td className={dataCell}>{season.leagues.find((item) => item.id === match.league)?.label}</td>
                      <th scope="row" className={`${dataCell} font-semibold text-left`}>{match.opponent}</th>
                      <td className={`${dataCell} capitalize ${match.result === "won" ? "text-emerald-400" : match.result === "lost" ? "text-rose-400" : "text-slate-300"}`}>{match.result}</td>
                      <td className={dataCell}>{match.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {matches.length > 0 && <p className="text-xs text-slate-400">Match dates and full scorecards are not included in this season summary.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10" role="region" aria-label={`${view} stats`} tabIndex={0}>
          <table className="w-full border-collapse">
            <caption className="sr-only">{league?.label ?? "All competitions"} {view.toLowerCase()} statistics</caption>
            <thead className="bg-white/5"><tr>
              <th scope="col" className={headerCell}>Player</th>
              {columns[view].map(({ label }) => <th key={label} scope="col" className={headerCell}>{label}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((player) => (
                <tr key={player.name}>
                  <th scope="row" className={`${dataCell} whitespace-nowrap font-semibold text-left`}>{player.name}</th>
                  {columns[view].map(({ label, value }) => <td key={label} className={`${dataCell} whitespace-nowrap tabular-nums`}>{value(player)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
