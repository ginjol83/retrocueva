import { filterByQuery, json, parseListQuery, shapeList, textOf } from "../../lib/api";
import { serials } from "../../lib/data";

export async function GET(request: Request) {
  const query = parseListQuery(request);
  const filtered = filterByQuery(serials, query.q, (row) =>
    textOf(
      row.serial,
      row.machine,
      row.pattern,
      row.source,
      row.notes,
      row.parts.map((part) => `${part.label} ${part.value}`).join(" "),
    ),
  );
  return json(shapeList(filtered, query));
}
