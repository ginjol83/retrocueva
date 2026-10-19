import { json } from "../../../lib/api";
import { getSerial, serials } from "../../../lib/data";
import { notFoundJson, parseId } from "../../../lib/http";

export function generateStaticParams() {
  return serials.map((row) => ({ id: String(row.id) }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/serials/[id]">,
) {
  const { id } = await ctx.params;
  const parsed = parseId(id);
  const row = parsed === null ? undefined : getSerial(parsed);
  if (!row) return notFoundJson();
  return json(row);
}
