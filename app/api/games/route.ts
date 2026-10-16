import games from '../../../db/games.json';

export async function GET() {
  return new Response(JSON.stringify(games), {
    headers: { "Content-Type": "application/json" },
  });
}