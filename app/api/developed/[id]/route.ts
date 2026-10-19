import { json } from "../../../lib/api";
import { developed, getDeveloped } from "../../../lib/data";
import { notFoundJson, parseId } from "../../../lib/http";

export function generateStaticParams() {
  return developed.map((item) => ({ id: String(item.id) }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/developed/[id]">,
) {
  const { id } = await ctx.params;
  const parsed = parseId(id);
  const item = parsed === null ? undefined : getDeveloped(parsed);
  if (!item) return notFoundJson();
  return json(item);
}
