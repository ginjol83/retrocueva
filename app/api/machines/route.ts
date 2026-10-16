import { machines } from "../../lib/data";

export async function GET() {
  return Response.json(machines);
}
