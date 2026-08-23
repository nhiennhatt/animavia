import * as z from "zod";
import { createTimezoneSchemas } from "zod-timezone-validation";

const { CoercedCanonicalTimezoneSchema } = createTimezoneSchemas();

export const LoginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export interface ILoginBodySchema extends z.infer<typeof LoginBodySchema> {}

export const exchangeGoogleTokenSchema = z.object({
  code: z.string(),
  timezone: CoercedCanonicalTimezoneSchema.default(() =>
    CoercedCanonicalTimezoneSchema.parse("Asia/Ho_Chi_Minh"),
  ),
});

export interface ExchangeExchangeGoogleTokenSchema extends z.infer<
  typeof exchangeGoogleTokenSchema
> {}
