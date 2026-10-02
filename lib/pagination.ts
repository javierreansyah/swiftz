/** TMDB only supports positive integer pages up to 500. */
export function parsePage(value: string | null): number {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? Math.min(500, Math.max(1, page)) : 1;
}
