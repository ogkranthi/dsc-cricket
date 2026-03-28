"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const links = [
  { href: "/", label: "HOME" },
  { href: "/matches", label: "MATCHES" },
  { href: "/players", label: "SQUAD" },
  { href: "/leaderboard", label: "STATS" },
  { href: "/news", label: "NEWS" },
  { href: "/schedule", label: "FIXTURES" },
  { href: "/dcl", label: "DCL" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#08090d]/90 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.svg" alt="DSC Cricket" width={34} height={34} className="rounded-full" />
          <div className="hidden sm:block">
            <p className="font-extrabold text-[15px] tracking-tight text-white leading-none">DSC</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#ff8c2a] font-semibold">Est. 2023</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-2 text-[11px] font-bold tracking-wider transition-colors relative ${
                pathname === link.href
                  ? "text-[#ff8c2a]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#ff8c2a] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </SheetTrigger>
          <SheetContent side="right" className="w-60 bg-[#08090d] border-white/[0.04]">
            <SheetTitle className="text-base font-extrabold mb-6 text-white tracking-tight">DSC CRICKET</SheetTitle>
            <nav className="flex flex-col gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-[12px] font-bold tracking-wider transition-colors ${
                    pathname === link.href
                      ? "bg-[#ff8c2a]/10 text-[#ff8c2a]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
