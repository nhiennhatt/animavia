export type ApiResponse<T> = {
  code: string;
  data: T;
  error?: unknown;
};

export type AppServerResponse<T> =
  | { code: string; success: true; data: T; error?: never }
  | { code: string; success: false; data?: never; error: unknown };
