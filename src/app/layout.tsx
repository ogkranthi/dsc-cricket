import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-green-900/20 py-8 bg-[#080c14]">
          <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center font-black text-white text-[10px]">
                DSC
              </div>
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
                DSC Cricket &copy; {new Date().getFullYear()}
              </p>
            </div>
            <p className="text-xs text-slate-600">Powered by Passion, Built with love</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
