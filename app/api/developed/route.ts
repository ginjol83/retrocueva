import { developed } from "../../lib/data";

export async function GET() {
  return Response.json(developed);
}
