import * as z from "zod";

export const LoginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export interface ILoginBodySchema extends z.infer<typeof LoginBodySchema> {}

