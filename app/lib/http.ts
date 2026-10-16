export const notFoundJson = () =>
  Response.json({ error: "Not found" }, { status: 404 });

export const parseId = (raw: string): number | null => {
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
};
