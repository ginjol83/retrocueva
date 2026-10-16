import { articles } from "../../lib/data";

export async function GET() {
  return Response.json(articles);
}
