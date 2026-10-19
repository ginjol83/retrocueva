import { json } from "../../../lib/api";
import { games, getGame } from "../../../lib/data";
import { notFoundJson, parseId } from "../../../lib/http";

export function generateStaticParams() {
  return games.map((game) => ({ id: String(game.id) }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/games/[id]">,
) {
  const { id } = await ctx.params;
  const parsed = parseId(id);
  const game = parsed === null ? undefined : getGame(parsed);
  if (!game) return notFoundJson();
  return json(game);
}
