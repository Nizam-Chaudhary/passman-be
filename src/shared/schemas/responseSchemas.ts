import { z } from "zod";

export const statusSchema = z
  .enum(["success", "fail", "error"])
  .describe("Response status indicating success, failure or error");

export const responseSchema = z
  .object({
    status: statusSchema,
    message: z.string(),
  })
  .describe("Generic response schema with status and message");

export const errorResponseSchema = z
  .union([
    z.object({
      status: statusSchema.default("error"),
      message: z.string().default("something went wrong"),
      issues: z.any().optional().nullable().default(null),
    }),
    z.object({
      status: statusSchema.default("error"),
      message: z.string().default("something went wrong"),
    }),
  ])
  .describe("Error response schema with optional issues");
