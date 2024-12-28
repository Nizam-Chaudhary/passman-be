import { z } from "zod";

export const statusSchema = z.enum(["success", "fail", "error"]);

export const responseSchema = z.object({
    status: statusSchema,
    message: z.string(),
});

export const idParamsSchema = z.object({
    id: z.coerce.number().min(1),
});

export const errorSchema = z.object({
    status: statusSchema.default("error"),
    message: z.string().default("something went wrong"),
    stack: z.string().optional(),
});

export type IdParamsType = z.infer<typeof idParamsSchema>;
