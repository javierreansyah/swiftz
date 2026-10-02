export class TMDBError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TMDBError";
    this.status = status;
  }
}

export function isTMDBNotFound(error: unknown): boolean {
  return error instanceof TMDBError && error.status === 404;
}
