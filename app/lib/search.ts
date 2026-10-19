import {
  articles,
  developed,
  games,
  machines,
  normalize,
  type Article,
  type DevelopedGame,
  type Game,
  type Machine,
} from "./data";
import { gbUnits, type GbUnit } from "./gameboy";

export interface SearchResults {
  machines: Machine[];
  games: Game[];
  articles: Article[];
  developed: DevelopedGame[];
  serials: GbUnit[];
  total: number;
}

const matches = (needle: string, ...fields: (string | number | undefined)[]) =>
  fields.some(
    (field) =>
      field !== undefined && normalize(String(field)).includes(needle),
  );

export const EMPTY_RESULTS: SearchResults = {
  machines: [],
  games: [],
  articles: [],
  developed: [],
  serials: [],
  total: 0,
};

export const searchAll = (query: string): SearchResults => {
  const q = normalize(query);
  if (!q) return EMPTY_RESULTS;

  const found = {
    machines: machines.filter((machine) =>
      matches(
        q,
        machine.name,
        machine.manufacturer,
        machine.cpu,
        machine.ram,
        machine.storage,
        machine.serial,
        machine.platforms?.join(" "),
        machine.year,
      ),
    ),
    games: games.filter((game) =>
      matches(
        q,
        game.title,
        game.platform,
        game.genre,
        game.publisher,
        game.code,
        game.year,
      ),
    ),
    articles: articles.filter((article) =>
      matches(
        q,
        article.title,
        article.magazine,
        article.issue,
        article.summary,
        article.author,
        article.year,
      ),
    ),
    developed: developed.filter((item) =>
      matches(
        q,
        item.title,
        item.platform,
        item.language,
        item.tools,
        item.description,
        item.year,
      ),
    ),
    serials: gbUnits.filter((unit) =>
      matches(q, unit.serial, unit.model, unit.boardRevision),
    ),
  };

  const total =
    found.machines.length +
    found.games.length +
    found.articles.length +
    found.developed.length +
    found.serials.length;

  return { ...found, total };
};
