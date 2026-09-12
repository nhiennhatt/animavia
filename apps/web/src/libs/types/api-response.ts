export type APIResponse<T> =
  | {
      success: true;
      data: T;
      code: string;
    }
  | {
      success: false;
      error: unknown;
      code: string;
    };
