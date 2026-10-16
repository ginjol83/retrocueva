import { videos } from "../../lib/data";

export async function GET() {
  return Response.json(videos);
}
