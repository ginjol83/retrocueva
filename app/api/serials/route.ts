import { serials } from "../../lib/data";

export async function GET() {
  return Response.json(serials);
}
