import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { MultipartFile } from "@fastify/multipart";
import { db } from "../../db";
import { files } from "../../db/schema/schema";
import AppError from "../../lib/appError";
import env from "../../lib/env";
import { s3 } from "../../lib/s3";
import { validFileTypesSchema } from "./file.schema";

export const uploadFile = async (fileData: MultipartFile | undefined) => {
  if (!fileData) {
    throw new AppError("FILE_REQUIRED", "File is required", 400);
  }

  // validate file type
  validFileTypesSchema.parse(fileData.mimetype);

  // Sanitize filename
  const sanitizedFilename = fileData.filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace special chars with underscore
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
    throw new AppError("FILE_UPLOAD_FAILED", "File upload failed", 400);
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
};

export const deleteFiles = async (keys: string[]) => {
  const command = new DeleteObjectsCommand({
    Bucket: env.S3_BUCKET,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  });

  await s3.send(command);
};
