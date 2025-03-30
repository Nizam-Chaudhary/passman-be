import { z } from "zod";

export const idParamsSchema = z
  .object({
    id: z.coerce.number().min(1),
  })
  .describe("Schema for ID parameters requiring positive numbers");

export type IdParams = z.infer<typeof idParamsSchema>;
