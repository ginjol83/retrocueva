import { articles, getArticle } from "../../../lib/data";
import { notFoundJson, parseId } from "../../../lib/http";

export function generateStaticParams() {
  return articles.map((article) => ({ id: String(article.id) }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/articles/[id]">,
) {
  const { id } = await ctx.params;
  const parsed = parseId(id);
  const article = parsed === null ? undefined : getArticle(parsed);
  if (!article) return notFoundJson();
  return Response.json(article);
}
