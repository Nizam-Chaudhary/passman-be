import type { MultipartFile } from "@fastify/multipart";

import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { db } from "../../db/index.js";
import { files } from "../../db/schema/schema.js";
import env from "../../shared/config/env.js";
import { s3 } from "../../shared/config/s3.js";
import { validFileTypesSchema } from "./file.schema.js";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "../../shared/lib/httpError.js";

export async function uploadFile(fileData: MultipartFile | undefined) {
  if (!fileData) {
    throw new UnprocessableEntityError("File is required");
  }

  // validate file type
  try {
    validFileTypesSchema.parse(fileData.mimetype);
  } catch {
    throw new UnprocessableEntityError("File is required");
  }

  // Sanitize filename
  const sanitizedFilename = fileData.filename
    .replace(/[^a-z0-9.-]/gi, "_") // Replace special chars with underscore
    .toLowerCase(); // Convert to lowercase

  if (sanitizedFilename !== fileData.filename) {
    fileData.filename = sanitizedFilename;
  }

  const file = await fileData.toBuffer();

  const fileKey = `${Date.now()}-${fileData.filename}`;
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: fileKey,
    Body: file,
    ContentType: fileData.mimetype,
  });

  const response = await s3.send(command);

  if (response.$metadata.httpStatusCode !== 200) {
    throw new BadRequestError("File upload failed");
  }

  const url = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;

  const uploadedFile = await db
    .insert(files)
    .values({
      fileKey,
      url,
    })
    .returning();

  return {
    status: "success",
    message: "File uploaded successfully",
    data: uploadedFile[0],
  };
}

export async function deleteFiles(keys: string[]) {
  const command = new DeleteObjectsCommand({
    Bucket: env.S3_BUCKET,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  });

  await s3.send(command);
}
