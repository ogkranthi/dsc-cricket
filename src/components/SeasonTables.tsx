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
  const [name, setName] = useState("");
  const league = season.leagues.find((item) => item.id === leagueId);
  const players = (league?.players ?? season.players).filter((p) => p.name.toLowerCase().includes(name.trim().toLowerCase()));
  const matches = season.matches.filter((match) => !league || match.league === league.id);
  const rows = view === "Batting"
    ? players.filter((p) => p.innings > 0).sort((a, b) => b.runs - a.runs || a.name.localeCompare(b.name))
    : view === "Bowling"
      ? players.filter((p) => p.ballsBowled > 0 || p.wickets > 0).sort((a, b) => b.wickets - a.wickets || (a.economy ?? Infinity) - (b.economy ?? Infinity) || a.name.localeCompare(b.name))
      : players.filter((p) => fieldingTotal(p) > 0).sort((a, b) => fieldingTotal(b) - fieldingTotal(a) || a.name.localeCompare(b.name));

  return (
    <section aria-labelledby="season-tables" className="space-y-4">
      <h2 id="season-tables" className="scroll-mt-24 text-2xl font-black tracking-tight text-white uppercase">Season tables</h2>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
          Competition
          <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)} className="w-full sm:w-60 rounded-lg bg-[#0e1117] border border-white/15 px-3 py-2 text-white">
            <option value="all">All competitions</option>
            {season.leagues.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        <div role="group" aria-label="Table view" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {views.map((tab) => (
            <button key={tab} type="button" onClick={() => setView(tab)} aria-pressed={view === tab}
              className={`rounded-lg px-3 py-2.5 text-sm font-bold border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb56d] ${view === tab ? "text-[#07111d] bg-[#ff8c2a] border-[#ff8c2a]" : "text-slate-200 bg-[#101a28] border-white/15 hover:text-white hover:bg-white/10"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      {view !== "Results" && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-slate-300">
            Find a player
            <input type="search" value={name} onChange={(event) => setName(event.target.value)} placeholder="Search by name" className="w-full rounded-lg border border-white/15 bg-[#101a28] px-3 py-2 text-white placeholder:text-slate-400 sm:w-60" />
          </label>
          <p className="text-xs text-slate-400" aria-live="polite">{rows.length} {rows.length === 1 ? "player" : "players"}</p>
        </div>
      )}
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
            <ul aria-label="Match results" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <li key={match.number} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#101a28] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[10px] font-bold tracking-wider text-slate-300 uppercase">{season.leagues.find((item) => item.id === match.league)?.label}</p>
                    <span className={`rounded px-2 py-1 text-[10px] font-extrabold tracking-wider uppercase ${match.result === "won" ? "bg-emerald-400/15 text-emerald-200" : match.result === "lost" ? "bg-rose-400/15 text-rose-200" : "bg-white/10 text-slate-200"}`}>{match.result}</span>
                  </div>
                  <p className="font-bold text-white">DSC vs {match.opponent}</p>
                  {match.note && <p className="text-sm text-slate-300">{match.note}</p>}
                </li>
              ))}
            </ul>
          )}
          {matches.length > 0 && <p className="text-xs text-slate-400">Match dates and full scorecards are not included in this season summary.</p>}
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-[#101a28] p-5 text-sm text-slate-300">No players match this view.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10" role="region" aria-label={`${view} stats`} tabIndex={0}>
          <table className="w-full border-collapse">
            <caption className="sr-only">{league?.label ?? "All competitions"} {view.toLowerCase()} statistics</caption>
            <thead className="bg-white/5"><tr>
              <th scope="col" className={`${headerCell} sticky left-0 z-[1] bg-[#162233]`}>Player</th>
              {columns[view].map(({ label }) => <th key={label} scope="col" className={headerCell}>{label}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((player) => (
                <tr key={player.name} className="odd:bg-[#0d1521] even:bg-[#121d2c]">
                  <th scope="row" className={`${dataCell} sticky left-0 max-w-36 bg-inherit font-semibold text-left text-white sm:max-w-none sm:whitespace-nowrap`}>{player.name}</th>
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
