import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DSC Cricket",
  description: "Official website of DSC Cricket Team — match reports, stats, news, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/5 py-10 bg-[#060a12]">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="DSC" width={36} height={36} className="rounded-full" />
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">DSC CRICKET</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest">Est. 2023 &middot; Massachusetts</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <a href="https://youtube.com/@dsc-ma" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-red-500 transition-colors" aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://cricclubs.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-green-500 transition-colors text-xs font-bold tracking-wider uppercase">CricClubs</a>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-[11px] text-slate-700">Deccan Sports Club &copy; {new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
