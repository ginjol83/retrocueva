import { filterByQuery, json, parseListQuery, shapeList, textOf } from "../../lib/api";
import { machines } from "../../lib/data";

export async function GET(request: Request) {
  const query = parseListQuery(request);
  const filtered = filterByQuery(machines, query.q, (machine) =>
    textOf(
      machine.name,
      machine.manufacturer,
      machine.cpu,
      machine.ram,
      machine.storage,
      machine.serial,
      machine.platforms?.join(" "),
      machine.year,
    ),
  );
  return json(shapeList(filtered, query));
}
