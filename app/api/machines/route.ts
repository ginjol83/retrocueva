import machines from '../../../db/machines.json';

export async function GET() {
  return new Response(JSON.stringify(machines), {
    headers: { "Content-Type": "application/json" },
  });
}