import { getMachine, machines } from "../../../lib/data";
import { notFoundJson, parseId } from "../../../lib/http";

export function generateStaticParams() {
  return machines.map((machine) => ({ id: String(machine.id) }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/machines/[id]">,
) {
  const { id } = await ctx.params;
  const parsed = parseId(id);
  const machine = parsed === null ? undefined : getMachine(parsed);
  if (!machine) return notFoundJson();
  return Response.json(machine);
}
