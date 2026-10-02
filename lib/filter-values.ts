export type SearchParamsReader = Pick<URLSearchParams, "get">;

export function finiteRange(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  if (value === null || value.trim() === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(max, Math.max(min, number))
    : fallback;
}

export function positiveId(value: string) {
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value));
}

export function optionValue(
  value: string | null,
  options: readonly string[],
  fallback: string,
) {
  return value !== null && options.includes(value) ? value : fallback;
}

export function isoDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? value
    : undefined;
}

export function decodeFilterLabel(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
