import Image from "next/image";
import Link from "next/link";
import { getMatches, getSchedule, getPosts, getSeasons } from "@/lib/content";
import season2026 from "@/data/season-2026.json";
import { UpcomingFixtures } from "@/components/UpcomingFixtures";
import { SeasonHighlights } from "@/components/SeasonHighlights";

const number = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });

function OvalGraphic() {
  return (
    <svg aria-hidden="true" className="broadcast-oval" viewBox="0 0 600 480" fill="none">
      <defs>
        <linearGradient id="oval-fade" x1="158" y1="36" x2="550" y2="435" gradientUnits="userSpaceOnUse">
          <stop stopColor="#91ccde" stopOpacity=".28" />
          <stop offset="1" stopColor="#89bbc8" stopOpacity=".04" />
        </linearGradient>
        <pattern id="outfield-stripes" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="20" height="40" fill="#73bfc4" fillOpacity=".06" />
        </pattern>
      </defs>
      <g transform="rotate(-19 305 240)">
        <ellipse cx="305" cy="240" rx="278" ry="214" stroke="url(#oval-fade)" strokeDasharray="2 7" />
        <ellipse cx="305" cy="240" rx="252" ry="190" fill="url(#outfield-stripes)" stroke="url(#oval-fade)" strokeWidth="2" />
        <ellipse cx="305" cy="240" rx="206" ry="153" stroke="url(#oval-fade)" />
        <path d="M53 240h504M305 50v380" stroke="url(#oval-fade)" strokeDasharray="3 8" />
        <rect x="260" y="130" width="90" height="220" rx="2" stroke="#ffd099" strokeOpacity=".32" fill="#f9a75e" fillOpacity=".06" strokeWidth="2" />
        <path d="M251 153h108m-108 173h108M275 130v33m60-33v33m-60 154v33m60-33v33" stroke="#ffd099" strokeOpacity=".4" />
      </g>
    </svg>
  );
}

function SectionHeader({ number, title, href, link }: { number: string; title: string; href?: string; link?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 pb-3">
      <h2 className="flex items-center gap-3 text-xl font-black tracking-tight text-white sm:text-2xl">
        <span className="broadcast-kicker text-[#ff8c2a]">{number}</span>
        {title}
      </h2>
      {href && <Link href={href} className="broadcast-text-link">{link} <span aria-hidden="true">↗</span></Link>}
    </div>
  );
}

export default function HomePage() {
  const { summary, leagues, players } = season2026;
  const archive = getMatches().filter((match) => match.result !== "Upcoming").slice(0, 3);
  const latestPost = getPosts()[0];
  const leaders = [
    { title: "Batting", stat: "runs", rows: [...players].sort((a, b) => b.runs - a.runs).slice(0, 3).map((p) => ({ name: p.name, value: p.runs })) },
    { title: "Bowling", stat: "wickets", rows: [...players].sort((a, b) => b.wickets - a.wickets).slice(0, 3).map((p) => ({ name: p.name, value: p.wickets })) },
  ];
  const metrics = [
    { label: "Completed", value: summary.completed },
    { label: "Abandoned", value: summary.abandoned },
    { label: "Players", value: summary.playersUsed },
    { label: "Competitions", value: leagues.length },
  ];

  return (
    <div className="broadcast-home">
      <section className="broadcast-hero" aria-labelledby="club-title">
        <div className="broadcast-hero-media" aria-hidden="true"><OvalGraphic /></div>
        <div className="relative mx-auto grid max-w-6xl gap-9 px-4 pt-5 pb-7 sm:px-6 sm:pt-7 md:grid-cols-[1.12fr_.88fr] md:items-center md:gap-6 md:pt-10 md:pb-11">
          <div className="min-w-0">
            <div className="broadcast-kicker flex items-center gap-2.5 text-slate-300">
              <span className="inline-flex bg-[#ff8c2a] px-2 py-1 text-[#09131f]">DSC</span> Massachusetts · Est. 2023
            </div>
            <h1 id="club-title" className="broadcast-display mt-5 text-white">
              Deccan<br />Sports Club<span className="text-[#ff8c2a]">.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
              Season stats, match scorecards and the stories behind the numbers.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/season-2026" className="broadcast-button">2026 season <span aria-hidden="true">↗</span></Link>
              <Link href="/party" className="broadcast-button broadcast-button-ghost">Play party trivia <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="broadcast-panel relative overflow-hidden">
            <div className="broadcast-ribbon flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <span className="broadcast-kicker text-white">Season scoreboard</span>
              <span className="broadcast-kicker text-[#ffac68]">2026</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
              <Image src="/logo.svg" alt="" width={42} height={42} className="shrink-0 rounded-full" />
              <div>
                <div className="text-lg font-black tracking-tight text-white">Deccan Sports Club</div>
                <p className="text-xs text-slate-400">Across all four competitions</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
              {metrics.map(({ label, value }) => (
                <div key={label} className="broadcast-metric flex min-w-0 flex-col-reverse gap-1 px-4 py-3 sm:px-3 lg:px-4">
                  <dt className="text-[0.66rem] font-semibold text-slate-400">{label}</dt>
                  <dd className="text-3xl leading-none font-black tabular-nums text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs text-slate-300 sm:px-5">
              <span><strong className="font-extrabold tabular-nums text-white">{number.format(summary.runs)}</strong> player runs</span>
              <span><strong className="font-extrabold tabular-nums text-white">{number.format(summary.wickets)}</strong> wickets</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
        <section className="broadcast-party-banner flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5" aria-labelledby="party-heading">
          <div>
            <p className="broadcast-kicker text-[#ffac68]">Year-end party</p>
            <h2 id="party-heading" className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">How well do you know DSC?</h2>
            <p className="mt-1 text-sm text-slate-300">Put your season memory to the test with interactive cricket trivia.</p>
          </div>
          <Link href="/party" className="broadcast-button shrink-0">Start the quiz <span aria-hidden="true">→</span></Link>
        </section>

        <section aria-label="2026 player leaders">
          <SectionHeader number="01" title="2026 player leaders" href="/season-2026" link="All player stats" />
          <div className="grid gap-3 md:grid-cols-2">
            {leaders.map(({ title, stat, rows }) => (
              <div key={title} className="broadcast-panel overflow-hidden">
                <h3 className="broadcast-ribbon broadcast-kicker px-4 py-3 text-white">{title}</h3>
                <ol className="divide-y divide-white/10">
                  {rows.map((player, i) => (
                    <li key={player.name} className="grid grid-cols-[2.3rem_1fr_auto] items-center gap-2 px-4 py-2.5">
                      <span aria-hidden="true" className={`broadcast-kicker ${i === 0 ? "text-[#ffac68]" : "text-slate-400"}`}>0{i + 1}</span>
                      <span className="text-sm font-bold text-white">{player.name}</span>
                      <span className="text-right text-xs text-slate-400"><strong className="mr-1 text-lg font-black tabular-nums text-white">{player.value}</strong> {stat}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Match centre">
          <SectionHeader number="02" title="Match centre" href="/season-2026" link="2026 results and stats" />
          <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_17rem]">
            <div className="order-2 lg:order-1">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="broadcast-kicker text-slate-300">Archived scorecards</h3>
                <Link href="/matches" className="broadcast-text-link">All scorecards <span aria-hidden="true">↗</span></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {archive.map((match) => (
                  <Link key={match.id} href={`/matches/${match.id}`} className="broadcast-panel broadcast-card-link block overflow-hidden">
                    <div className="broadcast-ribbon flex flex-wrap items-center justify-between gap-1.5 px-3 py-2">
                      <time dateTime={match.date} className="text-[0.65rem] font-bold text-slate-300">{date.format(new Date(match.date))}</time>
                      <span className={`rounded px-1.5 py-0.5 text-[0.63rem] font-black uppercase ${match.result === "Won" ? "badge-won" : match.result === "Lost" ? "badge-lost" : "bg-white/10 text-slate-300"}`}>
                        {match.result}
                      </span>
                    </div>
                    <div className="space-y-2 px-3 py-3 text-xs">
                      <div className="flex justify-between gap-1">
                        <span className="font-black text-[#ffac68]">DSC</span><strong className="shrink-0 text-right tabular-nums text-white">{match.dscScore ?? "—"}</strong>
                      </div>
                      <div className="flex justify-between gap-1">
                        <span className="min-w-0 font-bold text-slate-300">{match.opponent}</span><strong className="shrink-0 text-right tabular-nums text-slate-100">{match.opponentScore ?? "—"}</strong>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <aside className="broadcast-panel order-1 p-4 lg:order-2">
              <UpcomingFixtures fixtures={getSchedule()} nextOnly />
              <Link href="/schedule" className="broadcast-text-link mt-3 inline-flex">Fixtures <span aria-hidden="true">↗</span></Link>
            </aside>
          </div>
        </section>

        {getSeasons().map((season) => <SeasonHighlights key={season.year} season={season} />)}

        {latestPost && (
          <section aria-label="Club news">
            <SectionHeader number="03" title="Club news" href="/news" link="All news" />
            <Link href={`/news/${latestPost.slug}`} className="broadcast-panel broadcast-card-link block p-5">
              <span className="broadcast-kicker text-[#ffac68]">{latestPost.category}</span>
              <h3 className="mt-2 text-lg font-black tracking-tight text-white">{latestPost.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{latestPost.excerpt}</p>
              <time dateTime={latestPost.date} className="mt-3 inline-block text-xs font-semibold text-slate-400">{date.format(new Date(latestPost.date))}</time>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
