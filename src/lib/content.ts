import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface Player {
  id: string;
  name: string;
  role: "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";
  battingStyle: string;
  bowlingStyle?: string;
  photo?: string;
  bio?: string;
  jerseyNumber?: number;
  captain?: boolean;
  viceCaptain?: boolean;
}

export interface BattingInning {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  howOut: string;
  strikeRate: number;
}

export interface BowlingInning {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  venue: string;
  matchType: string;
  result: "Won" | "Lost" | "Tied" | "No Result" | "Upcoming";
  dscScore?: string;
  opponentScore?: string;
  tossWinner?: string;
  tossDecision?: string;
  aiReport?: string;
  motm?: string;
  motmReason?: string;
  batting?: BattingInning[];
  bowling?: BowlingInning[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  content: string;
}

export interface Fixture {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  matchType: string;
  status: "upcoming" | "completed" | "cancelled";
}

function readMdxFiles<T>(subdir: string): T[] {
  const dir = path.join(contentDir, subdir);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const id = file.replace(/\.mdx?$/, "");
    return { id, ...data, content } as T;
  });
}

export function getPlayers(): Player[] {
  return readMdxFiles<Player>("players");
}

export function getPlayer(id: string): Player | undefined {
  return getPlayers().find((p) => p.id === id);
}

export function getMatches(): Match[] {
  const matches = readMdxFiles<Match>("matches");
  return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getMatch(id: string): Match | undefined {
  return getMatches().find((m) => m.id === id);
}

export function getPosts(): Post[] {
  const posts = readMdxFiles<Post>("posts");
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getSchedule(): Fixture[] {
  const dir = path.join(contentDir, "schedule");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const allFixtures: Fixture[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = matter(raw);
    if (data.fixtures && Array.isArray(data.fixtures)) {
      allFixtures.push(...data.fixtures);
    }
  }

  return allFixtures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Computed stats
export interface BattingLeader {
  playerId: string;
  playerName: string;
  matches: number;
  runs: number;
  innings: number;
  highScore: number;
  average: number;
  strikeRate: number;
  fifties: number;
  fours: number;
  sixes: number;
}

export interface BowlingLeader {
  playerId: string;
  playerName: string;
  matches: number;
  overs: number;
  wickets: number;
  runs: number;
  bestFigures: string;
  average: number;
  economy: number;
}

export function getBattingLeaderboard(): BattingLeader[] {
  const matches = getMatches().filter((m) => m.result !== "Upcoming");
  const statsMap = new Map<string, BattingLeader>();

  for (const match of matches) {
    if (!match.batting) continue;
    for (const inn of match.batting) {
      const existing = statsMap.get(inn.playerId) || {
        playerId: inn.playerId,
        playerName: inn.playerName,
        matches: 0,
        runs: 0,
        innings: 0,
        highScore: 0,
        average: 0,
        strikeRate: 0,
        fifties: 0,
        fours: 0,
        sixes: 0,
      };
      existing.matches += 1;
      existing.innings += 1;
      existing.runs += inn.runs;
      existing.fours += inn.fours;
      existing.sixes += inn.sixes;
      if (inn.runs > existing.highScore) existing.highScore = inn.runs;
      if (inn.runs >= 50) existing.fifties += 1;
      statsMap.set(inn.playerId, existing);
    }
  }

  const leaders = Array.from(statsMap.values()).map((s) => ({
    ...s,
    average: s.innings > 0 ? Math.round((s.runs / s.innings) * 100) / 100 : 0,
    strikeRate: 0, // would need total balls
  }));

  return leaders.sort((a, b) => b.runs - a.runs);
}

export function getBowlingLeaderboard(): BowlingLeader[] {
  const matches = getMatches().filter((m) => m.result !== "Upcoming");
  const statsMap = new Map<string, BowlingLeader & { bestW: number; bestR: number }>();

  for (const match of matches) {
    if (!match.bowling) continue;
    for (const inn of match.bowling) {
      const existing = statsMap.get(inn.playerId) || {
        playerId: inn.playerId,
        playerName: inn.playerName,
        matches: 0,
        overs: 0,
        wickets: 0,
        runs: 0,
        bestFigures: "0/0",
        average: 0,
        economy: 0,
        bestW: 0,
        bestR: 999,
      };
      existing.matches += 1;
      existing.overs += inn.overs;
      existing.wickets += inn.wickets;
      existing.runs += inn.runs;
      if (inn.wickets > existing.bestW || (inn.wickets === existing.bestW && inn.runs < existing.bestR)) {
        existing.bestW = inn.wickets;
        existing.bestR = inn.runs;
        existing.bestFigures = `${inn.wickets}/${inn.runs}`;
      }
      statsMap.set(inn.playerId, existing);
    }
  }

  const leaders = Array.from(statsMap.values()).map((s) => ({
    ...s,
    average: s.wickets > 0 ? Math.round((s.runs / s.wickets) * 100) / 100 : 0,
    economy: s.overs > 0 ? Math.round((s.runs / s.overs) * 100) / 100 : 0,
  }));

  return leaders.sort((a, b) => b.wickets - a.wickets);
}

// Team stats summary
export function getTeamStats() {
  const matches = getMatches().filter((m) => m.result !== "Upcoming");
  return {
    played: matches.length,
    won: matches.filter((m) => m.result === "Won").length,
    lost: matches.filter((m) => m.result === "Lost").length,
    tied: matches.filter((m) => m.result === "Tied").length,
    noResult: matches.filter((m) => m.result === "No Result").length,
  };
}
