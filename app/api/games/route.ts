import { filterByQuery, json, parseListQuery, shapeList, textOf } from "../../lib/api";
import { games } from "../../lib/data";

export async function GET(request: Request) {
  const query = parseListQuery(request);
  const filtered = filterByQuery(games, query.q, (game) =>
    textOf(
      game.title,
      game.platform,
      game.genre,
      game.publisher,
      game.code,
      game.region,
      game.year,
    ),
  );
  return json(shapeList(filtered, query));
}
