export class QueryError extends Error {
  constructor(
    public code: string,
    public error: unknown,
  ) {
    super(code);
  }
}
