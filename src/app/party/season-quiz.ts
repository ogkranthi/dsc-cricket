import season from "@/data/season-2026.json";

export type Question = {
  category: string;
  prompt: string;
  options: string[];
  correct: number;
  detail: string;
};

export type SeasonFact = { label: string; value: string; detail: string };

const count = (value: number) => value.toLocaleString("en-US");
const topRuns = [...season.players].sort((a, b) => b.runs - a.runs);
const topWickets = [...season.players].sort((a, b) => b.wickets - a.wickets);
const sixes = season.players.reduce((total, player) => total + player.sixes, 0);
const mcl = season.leagues.find((league) => league.id === "mcl");
const largestWin = season.matches.reduce((best, match) => {
  const runs = match.league === "mcl" && match.result === "won" ? Number(match.note?.match(/^DSC won by (\d+) runs\b/)?.[1] ?? 0) : 0;
  return runs > best.runs ? { runs, opponent: match.opponent } : best;
}, { runs: 0, opponent: "" });

const abandoned = season.matches.find((match) => match.result === "abandoned");

const numberChoices = (answer: number, offsets: number[]) =>
  offsets.map((offset) => count(answer + offset));

export const questions: Question[] = [
  {
    category: "The warm-up",
    prompt: "How many matches did DSC complete this season?",
    options: numberChoices(season.summary.completed, [-6, 0, 1, 6]),
    correct: 1,
    detail: `${season.summary.completed} completed matches. The abandoned game${abandoned ? ` against ${abandoned.opponent}` : ""} is a separate entry.`,
  },
  {
    category: "Batting end",
    prompt: "Who topped the DSC run charts across all four leagues?",
    options: [topRuns[1].name, topRuns[2].name, topRuns[3].name, topRuns[0].name],
    correct: 3,
    detail: `${topRuns[0].name} finished with ${count(topRuns[0].runs)} runs. ${mcl?.players.find((player) => player.name === topRuns[0].name)?.runs ?? 0} of those came in MCL.`,
  },
  {
    category: "Bowling end",
    prompt: "Who took the most wickets for DSC this season?",
    options: [topWickets[0].name, topWickets[1].name, topWickets[2].name, topWickets[3].name],
    correct: 0,
    detail: `${topWickets[0].name} took ${topWickets[0].wickets} wickets. ${topWickets[1].name} was next with ${topWickets[1].wickets}.`,
  },
  {
    category: "Over the rope",
    prompt: "How many sixes did DSC hit across all four leagues?",
    options: numberChoices(sixes, [-50, -18, 0, 22]),
    correct: 2,
    detail: `${count(sixes)} sixes, or ${count(sixes * 6)} runs in sixes alone. That’s a lot of time looking for the ball.`,
  },
  {
    category: "Scoreboard pressure",
    prompt: `How many runs did DSC win by against ${largestWin.opponent} in the MCL?`,
    options: numberChoices(largestWin.runs, [-52, -30, -12, 0]),
    correct: 3,
    detail: `DSC won by ${largestWin.runs} runs, their biggest MCL win by runs in the season archive.`,
  },
  {
    category: "The final ball",
    prompt: "How many players represented DSC this season?",
    options: numberChoices(season.summary.playersUsed, [-7, 0, 4, 7]),
    correct: 1,
    detail: `${season.summary.playersUsed} different players across the four leagues. That’s more than three playing XIs.`,
  },
];

export const facts: SeasonFact[] = [
  { label: "Runs off the bat", value: count(season.summary.runs), detail: "Total runs credited to DSC batters. Extras not included." },
  { label: "Wickets taken", value: count(season.summary.wickets), detail: "Wickets credited to DSC bowlers across four leagues." },
  { label: "Caught!", value: count(season.players.reduce((total, player) => total + player.catches, 0)), detail: "That includes the catches taken behind the stumps." },
];
