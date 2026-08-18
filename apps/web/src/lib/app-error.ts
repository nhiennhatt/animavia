export class AppError extends Error {
  code: string;
  error?: unknown;
  constructor(message: string, code: string, error?: unknown) {
    super(message);
    this.code = code;
    this.error = error;
  }
}
