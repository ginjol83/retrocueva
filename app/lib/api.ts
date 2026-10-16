import { normalize } from "./data";

const CACHE_CONTROL =
  "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400";

export const json = (data: unknown, init?: ResponseInit): Response =>
  Response.json(data, {
    ...init,
    headers: {
      "Cache-Control": CACHE_CONTROL,
      ...(init?.headers ?? {}),
    },
  });

export interface ListQuery {
  q: string;
  page: number;
  perPage: number;
  paginate: boolean;
}

export const parseListQuery = (
  request: Request,
  defaultPerPage = 50,
): ListQuery => {
  const { searchParams } = new URL(request.url);
  const hasPage = searchParams.has("page");
  const hasPerPage = searchParams.has("perPage") || searchParams.has("per_page");
  const rawPage = Number(searchParams.get("page"));
  const rawPerPage = Number(
    searchParams.get("perPage") ?? searchParams.get("per_page"),
  );
  return {
    q: (searchParams.get("q") ?? "").trim(),
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    perPage:
      Number.isInteger(rawPerPage) && rawPerPage > 0 && rawPerPage <= 100
        ? rawPerPage
        : defaultPerPage,
    paginate: hasPage || hasPerPage,
  };
};

export const filterByQuery = <T>(
  items: T[],
  q: string,
  text: (item: T) => string,
): T[] => {
  const needle = normalize(q);
  if (!needle) return items;
  return items.filter((item) => normalize(text(item)).includes(needle));
};

export interface ListResponse<T> {
  total: number;
  page: number;
  perPage: number;
  pages: number;
  items: T[];
}

export const shapeList = <T>(
  items: T[],
  query: ListQuery,
): T[] | ListResponse<T> => {
  if (!query.paginate) return items;
  const start = (query.page - 1) * query.perPage;
  return {
    total: items.length,
    page: query.page,
    perPage: query.perPage,
    pages: Math.max(1, Math.ceil(items.length / query.perPage)),
    items: items.slice(start, start + query.perPage),
  };
};

export const textOf = (...fields: (string | number | undefined)[]): string =>
  fields.filter((field) => field !== undefined).join(" ");
