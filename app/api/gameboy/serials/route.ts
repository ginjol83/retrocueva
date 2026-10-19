import { json } from "../../../lib/api";
import { resolveSerial } from "../../../lib/gameboy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) {
    return json(
      { error: "Falta el parámetro q. Ej.: ?q=GH3783310" },
      { status: 400 },
    );
  }
  const result = resolveSerial(q);
  return json({ query: q, ...result });
}
