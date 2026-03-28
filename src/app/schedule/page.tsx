import { getSchedule } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Fixtures | DSC Cricket" };

export default function SchedulePage() {
  const fixtures = getSchedule();
  const upcoming = fixtures.filter((f) => f.status === "upcoming");
  const completed = fixtures.filter((f) => f.status === "completed");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">FIXTURES</h1>
        <p className="text-sm text-slate-500">Season schedule and results</p>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-4">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((f) => (
              <div key={f.id} className="rounded-xl gradient-card border border-[#213661]/30 p-5 hover:border-orange-600/30 transition-colors">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg gradient-navy flex items-center justify-center font-black text-white text-xs shadow-lg">
                      DSC
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">vs {f.opponent}</p>
                      <p className="text-xs text-slate-500">{f.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-white text-sm">
                        {new Date(f.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                      <p className="text-xs text-slate-500">{f.time}</p>
                    </div>
                    <Badge className="bg-orange-500/15 text-orange-400 border-orange-600/30">{f.matchType}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                      {new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
