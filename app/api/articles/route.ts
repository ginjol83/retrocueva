import { filterByQuery, json, parseListQuery, shapeList, textOf } from "../../lib/api";
import { articles } from "../../lib/data";

export async function GET(request: Request) {
  const query = parseListQuery(request);
  const filtered = filterByQuery(articles, query.q, (article) =>
    textOf(
      article.title,
      article.magazine,
      article.issue,
      article.summary,
      article.author,
      article.year,
    ),
  );
  return json(shapeList(filtered, query));
}
