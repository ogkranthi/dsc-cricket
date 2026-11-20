"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import type { Fixture } from "@/lib/content";

function easternDate() {
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => date.find((value) => value.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  window.addEventListener("focus", onChange);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", onChange);
  };
}

export function UpcomingFixtures({ fixtures, nextOnly = false }: { fixtures: Fixture[]; nextOnly?: boolean }) {
  // Do not bake a potentially expired fixture into the static HTML.
  const today = useSyncExternalStore(subscribe, easternDate, () => "");
  const upcoming = today ? fixtures.filter((fixture) => fixture.status === "upcoming" && fixture.date >= today) : [];

  return (
    <section>
      <h2 className="section-label text-[#ff8c2a] mb-3">{nextOnly ? "Next Match" : "Upcoming"}</h2>
      {upcoming.length === 0 ? (
        <p className="text-sm text-slate-400">No upcoming fixture listed.</p>
      ) : (
        <div className="space-y-3">
          {(nextOnly ? upcoming.slice(0, 1) : upcoming).map((fixture) => (
            <div key={fixture.id} className="rounded-xl bg-gradient-to-r from-[#0e1117] via-[#15120d] to-[#0e1117] p-5 border border-[#ff8c2a]/10 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <Image src="/logo.svg" alt="DSC" width={48} height={48} className="rounded-xl" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#ff8c2a] font-bold">VS</p>
                  <p className="text-lg font-extrabold text-white tracking-tight">{fixture.opponent}</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <time dateTime={fixture.date} className="text-sm font-bold text-white">
                  {new Date(fixture.date).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" })}
                </time>
                <p className="text-xs text-slate-400 mt-0.5">{fixture.time} &middot; {fixture.venue}</p>
                <span className="inline-block mt-1.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#ff8c2a]/10 text-[#ff8c2a]">{fixture.matchType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
