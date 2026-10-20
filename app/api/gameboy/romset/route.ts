import { json, parseListQuery, shapeList } from "../../../lib/api";
import { stripAccents } from "../../../lib/gameboy";
import { gbRomset } from "../../../lib/gameboy-romset";

export async function GET(request: Request) {
  const query = parseListQuery(request, 50);
  const needle = stripAccents(query.q.toLowerCase());
  const filtered = needle
    ? gbRomset.filter((entry) =>
        [entry.ntsc, entry.pal, entry.jp].some((title) =>
          stripAccents(title.toLowerCase()).includes(needle),
        ),
      )
    : gbRomset;
  return json(shapeList(filtered, query));
}
