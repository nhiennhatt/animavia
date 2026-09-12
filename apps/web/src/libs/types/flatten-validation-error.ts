import z from "zod";

export type FlattenValidationError<T extends z.ZodType> = ReturnType<
  typeof z.flattenError<z.infer<T>>
>;
