import { z } from "zod";

export const responseSchema = z.object({
    status: z.string(),
    message: z.string(),
});

export const idParamsSchema = z.object({
    id: z.number().min(1),
});

export type IdParamsType = z.infer<typeof idParamsSchema>;
