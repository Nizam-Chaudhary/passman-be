import { z } from "zod";

export const responseSchema = z.object({
    status: z.string(),
    message: z.string(),
});

export const idParamsSchema = z.object({
    id: z.coerce.number().min(1),
});

export const errorSchema = z.object({
    status: z.string().default("error"),
    message: z.string().default("something went wrong"),
    stack: z.string().optional(),
});

export type IdParamsType = z.infer<typeof idParamsSchema>;
