import { z } from "zod";

export const responseSchema = z.object({
    status: z.string(),
    message: z.string(),
});

export const idParamsSchema = z.object({
    id: z.number().min(1),
});

export const errorSchema = z.union([
    z.object({
        status: z.string(),
        message: z.string(),
    }),
    z.object({
        status: z.string(),
        message: z.string(),
        stack: z.string(),
    }),
]);

export type IdParamsType = z.infer<typeof idParamsSchema>;
