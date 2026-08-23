import z from "zod";

export async function validateSchemaAsync<T>(
  object: unknown,
  Schema: z.ZodType<T>,
): Promise<
  | { success: false; error: ReturnType<typeof z.flattenError<T>> }
  | { success: true; data: T }
> {
  const validation = await Schema.safeParseAsync(object);

  if (!validation.success) {
    return { success: false, error: z.flattenError(validation.error) };
  }

  return {
    success: true,
    data: validation.data,
  };
}
