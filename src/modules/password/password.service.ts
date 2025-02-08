import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../../db";
import { passwords } from "../../db/schema/schema";
import AppError from "../../lib/appError";
import { AddPasswordInput, ImportPasswordsInput } from "./password.schema";

class PasswordService {
  async addPassword(userId: number, input: AddPasswordInput) {
    const password = await db
      .insert(passwords)
      .values({
        vaultId: input.vaultId,
        userId: userId,
        site: input.site,
        username: input.username,
        password: input.password,
        faviconUrl: input.faviconUrl,
        note: input.note,
      })
      .returning();

    return {
      status: "success",
      message: "password added successfully",
      data: password[0],
    };
  }

  async getPasswords(userId: number, vaultId: number, search?: string) {
    const searchCondition = search
      ? or(
          ilike(passwords.site, `%${search}%`),
          ilike(passwords.username, `%${search}%`),
          ilike(passwords.note, `%${search}%`)
        )
      : undefined;

    const passwordsData = await db.query.passwords.findMany({
      where: and(
        eq(passwords.userId, userId),
        eq(passwords.vaultId, vaultId),
        searchCondition
      ),
      orderBy: [desc(passwords.updatedAt)],
    });

    return {
      status: "success",
      data: passwordsData,
    };
  }

  async getPassword(userId: number, id: number) {
    const password = await db.query.passwords.findFirst({
      where: and(eq(passwords.id, id), eq(passwords.userId, userId)),
    });

    if (!password) {
      throw new AppError("PASSWORD_NOT_FOUND", "Password not found", 404);
    }

    return {
      status: "success",
      data: password,
    };
  }

  async updatePassword(id: number, input: AddPasswordInput, userId: number) {
    const password = await db.query.passwords.findFirst({
      where: and(eq(passwords.id, id), eq(passwords.userId, userId)),
    });

    if (!password) {
      throw new AppError("PASSWORD_NOT_FOUND", "password not found", 400);
    }

    const updatedPassword = await db
      .update(passwords)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(passwords.id, id))
      .returning();

    return {
      status: "success",
      message: "password updated successfully",
      data: updatedPassword[0],
    };
  }

  async deletePassword(id: number, userId: number) {
    const password = await db
      .delete(passwords)
      .where(and(eq(passwords.id, id), eq(passwords.userId, userId)))
      .returning();

    return {
      status: "success",
      message: "password deleted successfully",
      data: password[0],
    };
  }

  async importPasswords(userId: number, inputPasswords: ImportPasswordsInput) {
    const allPasswords = inputPasswords.map((password) => ({
      ...password,
      userId,
    }));
    const importedPasswords = await db
      .insert(passwords)
      .values(allPasswords)
      .returning();

    return {
      status: "success",
      message: "passwords imported successfully",
      data: importedPasswords,
    };
  }
}

export default new PasswordService();
