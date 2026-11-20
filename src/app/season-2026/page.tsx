import Link from "next/link";
import season from "@/data/season-2026.json";
import { SeasonTables } from "@/components/SeasonTables";

export const metadata = {
  title: "2026 Season | DSC Cricket",
  description: "DSC’s 2026 match results, batting, bowling and fielding across four competitions.",
};

export default function SeasonPage() {
  const { summary, leagues } = season;
  const metrics = [
    { value: summary.completed, label: "Matches completed" },
    { value: summary.abandoned, label: "Abandoned" },
    { value: summary.playersUsed, label: "Players used" },
    { value: leagues.length, label: "Competitions" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header className="overflow-hidden rounded-2xl border border-slate-700/70 bg-[#07111d]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.19em] text-slate-300 uppercase sm:px-8">
          <span><span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-[#ff8c2a]" />DSC Match Centre</span>
          <span className="text-[#ffb56d]">Season archive</span>
        </div>
        <div className="bg-[radial-gradient(ellipse_at_top_right,#203956,transparent_62%)] px-5 py-8 sm:px-8 sm:py-11">
          <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[#ffb56d] uppercase">Deccan Sports Club</p>
          <h1 className="text-5xl leading-none font-black tracking-tight text-white uppercase italic sm:text-7xl">DSC 2026</h1>
          <p className="mt-4 max-w-lg text-sm text-slate-300 sm:text-base">Match results and the batting, bowling and fielding numbers behind the season.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
            <a href="#season-tables" className="rounded-lg bg-[#ff8c2a] px-4 py-2.5 text-[#07111d] hover:bg-[#ffb56d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb56d]">Explore the stats</a>
            <Link href="/party" className="rounded-lg border border-white/20 px-4 py-2.5 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb56d]">Play the season quiz</Link>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
          {metrics.map(({ value, label }) => (
            <div key={label} className="bg-[#101a28] px-5 py-4 sm:px-8">
              <dt className="font-mono text-[10px] font-bold tracking-widest text-slate-300 uppercase">{label}</dt>
              <dd className="mt-1 text-3xl font-black text-white tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <SeasonTables season={season} />
      <p className="text-sm text-slate-400">
        Past seasons: <Link href="/matches" className="text-[#ffb56d] underline underline-offset-4">Scorecard archive</Link> <span aria-hidden="true">·</span> <Link href="/leaderboard" className="text-[#ffb56d] underline underline-offset-4">Historical player stats</Link>
      </p>
    </div>
  );
}
