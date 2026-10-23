import machinesData from "../../db/machines.json";
import gamesData from "../../db/games.json";
import articlesData from "../../db/articles.json";
import samarucData from "../../db/samaruc.json";
import developedData from "../../db/developed.json";
import aboutData from "../../db/about.json";
import serialsData from "../../db/serials.json";
import videosData from "../../db/videos.json";
import tallerData from "../../db/taller.json";

export interface Machine {
  id: number;
  name: string;
  manufacturer: string;
  year: number;
  cpu: string;
  ram: string;
  storage: string;
  description: string;
  image?: string;
  platforms?: string[];
  serial: string;
  condition: string;
  acquired: number;
  location: string;
  notes: string;
}

export interface Game {
  id: number;
  title: string;
  platform: string;
  year: number;
  genre: string;
  publisher?: string;
  region?: string;
  code?: string;
  description: string;
  image?: string;
  condition?: string;
  acquired?: number;
  location?: string;
  notes?: string;
}

export interface ArticleSpec {
  label: string;
  value: string;
}

export interface ArticleScore {
  label: string;
  value: number;
}

export type ArticleBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "img"; src: string; alt: string; caption?: string; width?: number; height?: number };

export interface ArticleSection {
  heading?: string;
  blocks: ArticleBlock[];
}

export interface Article {
  id: number;
  title: string;
  magazine: string;
  issue?: string;
  year: number;
  summary: string;
  link?: string;
  magazineUrl?: string;
  magazineLabel?: string;
  author?: string;
  cover?: string;
  lead?: string;
  specs?: ArticleSpec[];
  sections?: ArticleSection[];
  scores?: ArticleScore[];
  credits?: string;
  instagram?: string;
}

export type ProjectBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "table"; headers: string[]; rows: string[][] };

export interface ProjectSection {
  heading: string;
  blocks: ProjectBlock[];
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ProjectDownload {
  label: string;
  description?: string;
  url: string;
}

export interface Project {
  name: string;
  title: string;
  lead: string;
  author: string;
  year: number;
  version: string;
  license: string;
  platforms: string[];
  stack: string[];
  sections: ProjectSection[];
  screenshots?: ProjectScreenshot[];
  logo?: string;
  link?: string;
  downloads?: ProjectDownload[];
}

export interface DevelopedGame {
  id: number;
  title: string;
  platform: string;
  year?: number;
  language: string;
  tools: string;
  description: string;
  link?: string;
  image?: string;
}

export interface Member {
  name: string;
  role: string;
  bio: string | string[];
  avatar?: string;
}

export interface Highlight {
  label: string;
  value: string;
}

export interface About {
  intro: string[];
  members: Member[];
  highlights: Highlight[];
}

export interface SerialPart {
  label: string;
  value: string;
}

export interface Serial {
  id: number;
  serial: string;
  machine: string;
  parts: SerialPart[];
  pattern?: string;
  source?: string;
  notes?: string;
}

export interface TallerImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface TallerSection {
  id: number;
  title: string;
  description: string;
  images: TallerImage[];
}


export const machines = machinesData as Machine[];
export const games = gamesData as Game[];
export const articles = articlesData as Article[];
export const samaruc = samarucData as Project;
export const developed = developedData as DevelopedGame[];
export const about = aboutData as About;
export const serials = serialsData as Serial[];
export interface Video {
  id: string;
  title: string;
  channel?: string;
  duration?: string;
}

export const videos = videosData as Video[];
export const taller = tallerData as TallerSection[];



const ACCENTS: Record<string, string> = {
  "Commodore 64": "#8b9cff",
  "ZX Spectrum": "#ff2e97",
  "NES": "#ff4747",
  "NES (Nintendo Entertainment System)": "#ff4747",
  "Atari 2600": "#ffb000",
  "Amstrad CPC": "#39ff14",
  "BBC Micro": "#00f0ff",
  "Casio MX-10": "#ff7a45",
  "Thomson MO5": "#5aa9ff",
  "PortÃ¡til 486": "#c9a0ff",
  "Game Boy": "#9be15d",
  "Atari XE": "#ffb000",
  "CAAD": "#ffb000",
  "Retro Gamer": "#ff2e97",
  "MicromanÃ­a": "#5aa9ff",
  "MicroHobby": "#39ff14",
};


const CODES: Record<string, string> = {
  "Commodore 64": "C64",
  "ZX Spectrum": "ZX",
  "NES (Nintendo Entertainment System)": "NES",
  "Atari 2600": "VCS",
  "Amstrad CPC": "CPC",
  "Casio MX-10": "MX",
  "Thomson MO5": "MO5",
  "PortÃ¡til 486": "486",
};

export const accent = (key: string): string => ACCENTS[key] ?? "#00f0ff";

export const code = (key: string): string =>
  CODES[key] ?? key.slice(0, 3).toUpperCase();

export const getMachine = (id: number): Machine | undefined =>
  machines.find((m) => m.id === id);

export const getGame = (id: number): Game | undefined =>
  games.find((g) => g.id === id);

export const getArticle = (id: number): Article | undefined =>
  articles.find((a) => a.id === id);

export const getSerial = (id: number): Serial | undefined =>
  serials.find((s) => s.id === id);

export const getDeveloped = (id: number): DevelopedGame | undefined =>
  developed.find((d) => d.id === id);

export const getVideo = (id: string): Video | undefined =>
  videos.find((v) => v.id === id);

export const gamesOnPlatform = (platform: string, excludeId?: number): Game[] =>
  games.filter((g) => g.platform === platform && g.id !== excludeId);

export const normalize = (value: string) => value.toLowerCase().trim();

export const machinePlatforms = (machine: Machine): string[] =>
  machine.platforms?.length ? machine.platforms : [machine.name];

export const gamesForMachine = (machine: Machine): Game[] => {
  const platforms = machinePlatforms(machine).map(normalize);
  return games.filter((game) => platforms.includes(normalize(game.platform)));
};

export const machinesForPlatform = (platform: string): Machine[] => {
  const target = normalize(platform);
  return machines.filter((machine) =>
    machinePlatforms(machine).some((item) => normalize(item) === target),
  );
};

export const serialsForMachine = (machine: Machine): Serial[] => {
  const name = normalize(machine.name);
  return serials.filter((row) => normalize(row.machine) === name);
};

const articleText = (article: Article): string =>
  [
    article.title,
    article.summary,
    article.lead ?? "",
    ...(article.sections ?? []).flatMap((section) => [
      section.heading ?? "",
      ...section.blocks.flatMap((block) =>
        block.kind === "p"
          ? [block.text]
          : block.kind === "ul"
            ? block.items
            : [block.caption ?? "", block.alt],
      ),
    ]),
  ].join(" ");

export const articlesMentioning = (term: string): Article[] => {
  const needle = normalize(term);
  if (needle.length < 4) return [];
  return articles.filter((article) =>
    normalize(articleText(article)).includes(needle),
  );
};

export const entitiesMentionedIn = (
  article: Article,
): { games: Game[]; machines: Machine[] } => {
  const text = normalize(articleText(article));
  return {
    games: games.filter(
      (game) => game.title.length >= 4 && text.includes(normalize(game.title)),
    ),
    machines: machines.filter((machine) =>
      text.includes(normalize(machine.name)),
    ),
  };
};


