import { filterByQuery, json, parseListQuery, shapeList, textOf } from "../../lib/api";
import { videos } from "../../lib/data";

export async function GET(request: Request) {
  const query = parseListQuery(request);
  const filtered = filterByQuery(videos, query.q, (video) =>
    textOf(video.title, video.channel, video.duration, video.id),
  );
  return json(shapeList(filtered, query));
}
