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
      <header>
        <p className="section-label text-[#ff8c2a] mb-2">Season archive</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">DSC 2026</h1>
        <p className="mt-3 text-sm text-slate-400">Results and player statistics from the 2026 club season.</p>
      </header>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(({ value, label }) => (
          <div key={label} className="gradient-card rounded-xl border border-white/10 p-4">
            <dt className="text-xs font-semibold text-slate-400">{label}</dt>
            <dd className="mt-1 text-3xl font-black stat-number">{value}</dd>
          </div>
        ))}
      </dl>
      <SeasonTables season={season} />
      <p className="text-sm text-slate-400">
        Looking for older matches? <Link href="/matches" className="text-[#ff8c2a] underline underline-offset-4">Browse the scorecard archive</Link>.
      </p>
    </div>
  );
}
