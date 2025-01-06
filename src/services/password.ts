import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { passwords } from "../db/schema/password";
import AppError from "../lib/appError";
import { AddPasswordInput, ImportPasswordsInput } from "../schemas/password";

class PasswordService {
    async addPassword(userId: number, input: AddPasswordInput) {
        const password = await db
            .insert(passwords)
            .values({
                userId: userId,
                appName: input.appName,
                email: input.email,
                username: input.username,
                iv: input.iv,
                password: input.password,
                baseUrl: input.baseUrl,
                specificUrl: input.specificUrl,
                faviconUrl: input.faviconUrl,
                notes: input.notes,
            })
            .returning();

        return {
            status: "success",
            message: "password added successfully",
            data: password[0],
        };
    }

    async getPasswords(userId: number, key: string) {
        const passwordsData = await db.query.passwords.findMany({
            where: eq(passwords.userId, userId),
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
            .set(input)
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

    async importPasswords(
        userId: number,
        inputPasswords: ImportPasswordsInput
    ) {
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
