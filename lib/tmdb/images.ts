const TMDB_IMAGE =
  /^https:\/\/image\.tmdb\.org\/t\/p\/(?:w\d+|h\d+|original)(\/[^?#]+)$/;
// Supported TMDB CDN width transforms, shared across media types.
const IMAGE_WIDTHS = [92, 154, 185, 300, 342, 500, 780, 1280] as const;

export function getTMDBSrcSet(src: string): string | undefined {
  const match = TMDB_IMAGE.exec(src);
  if (!match || /\.svg$/i.test(match[1])) return undefined;
  return IMAGE_WIDTHS.map(
    (width) => `https://image.tmdb.org/t/p/w${width}${match[1]} ${width}w`,
  ).join(", ");
}

export function tmdbImageUrl(
  path: string | null | undefined,
  width = 1280,
): string | undefined {
  return path ? `https://image.tmdb.org/t/p/w${width}${path}` : undefined;
}
