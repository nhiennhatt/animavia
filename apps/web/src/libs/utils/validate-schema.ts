import z, { ZodType } from "zod";

export const validateSchema = async (obj: object, Schema: ZodType) => {
  const validation = await z.safeParseAsync(Schema, obj);

  if (!validation.success)
    return {
      success: false,
      error: z.flattenError(validation.error),
    };

  return {
    success: true,
    data: validation.data,
  };
};
