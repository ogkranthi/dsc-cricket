"use client";

import Link from "next/link";
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
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-green-900/30 bg-[#0a0f1a]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center font-black text-white text-sm tracking-tighter shadow-lg shadow-green-900/30">
            DSC
          </div>
          <div className="hidden sm:block">
            <p className="font-extrabold text-lg tracking-tight text-white leading-none">DSC CRICKET</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-semibold">Est. 2024</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-xs font-bold tracking-wider transition-all relative ${
                pathname === link.href
                  ? "text-green-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-green-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-[#0a0f1a] border-green-900/30">
            <SheetTitle className="text-lg font-bold mb-6 text-white">DSC CRICKET</SheetTitle>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-bold tracking-wider transition-all ${
                    pathname === link.href
                      ? "bg-green-600/20 text-green-400 border-l-2 border-green-500"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
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
