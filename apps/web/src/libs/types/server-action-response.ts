export type ServerActionResponse<T> =
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
