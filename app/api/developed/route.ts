import { filterByQuery, json, parseListQuery, shapeList, textOf } from "../../lib/api";
import { developed } from "../../lib/data";

export async function GET(request: Request) {
  const query = parseListQuery(request);
  const filtered = filterByQuery(developed, query.q, (item) =>
    textOf(item.title, item.platform, item.language, item.tools, item.description, item.year),
  );
  return json(shapeList(filtered, query));
}
