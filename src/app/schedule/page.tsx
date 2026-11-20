import { getSchedule } from "@/lib/content";
import { UpcomingFixtures } from "@/components/UpcomingFixtures";

export const metadata = { title: "Fixtures | DSC Cricket" };

export default function SchedulePage() {
  const fixtures = getSchedule();
  const completed = fixtures.filter((f) => f.status === "completed");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">FIXTURES</h1>
        <p className="text-sm text-slate-500">Season schedule and results</p>
      </div>

      <UpcomingFixtures fixtures={fixtures} />

      {completed.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">Completed</h2>
          <div className="space-y-3">
            {completed.map((f) => (
              <div key={f.id} className="rounded-xl gradient-card border border-slate-800/50 p-5 opacity-60">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-300">DSC vs {f.opponent}</p>
                    <p className="text-xs text-slate-600">{f.venue}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-600">
                      {new Date(f.date).toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
