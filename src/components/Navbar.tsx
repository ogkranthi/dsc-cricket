"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const links = [
  { href: "/season-2026", label: "Season stats" },
  { href: "/matches", label: "Scorecards" },
  { href: "/schedule", label: "Fixtures" },
  { href: "/players", label: "Squad" },
  { href: "/news", label: "News" },
  { href: "/dcl", label: "DCL" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) || (href === "/season-2026" && pathname === "/leaderboard");

  return (
    <header className="broadcast-nav sticky top-0 z-50 border-b border-[#30435a] bg-[#091421]/97 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="DSC Cricket home" className="flex shrink-0 items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={34} height={34} className="rounded-full" />
          <span className="font-black tracking-tight text-white">DSC <span className="text-[#ffac68]">Cricket</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}
              className={`rounded px-3 py-2 text-sm font-bold transition-colors ${active(href) ? "bg-[#ff8c2a]/10 text-[#ffac68]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/party" aria-current={active("/party") ? "page" : undefined}
            className="rounded border border-[#ff8c2a]/50 bg-[#ff8c2a]/10 px-3 py-1.5 text-xs font-extrabold text-[#ffac68] hover:bg-[#ff8c2a]/20">
            Party trivia <span aria-hidden="true">↗</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger aria-label="Open navigation" className="inline-flex size-10 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white lg:hidden">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </SheetTrigger>
            <SheetContent side="right" className="broadcast-nav w-64 border-[#34455a] bg-[#0b1725]">
              <SheetTitle className="mb-4 text-base font-black tracking-tight text-white">DSC Cricket</SheetTitle>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-0.5">
                {[{ href: "/", label: "Home" }, ...links, { href: "/party", label: "Party trivia" }].map(({ href, label }) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active(href) ? "page" : undefined}
                    className={`rounded-lg px-3 py-3 text-sm font-bold transition-colors ${active(href) ? "bg-[#ff8c2a]/10 text-[#ffac68]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
