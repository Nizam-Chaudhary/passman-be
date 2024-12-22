import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { passwords } from "../db/schema/password";
import AppError from "../lib/appError";
import {
    AddPasswordInput,
    ImportPasswordsInput,
    SelectPasswordsModel,
} from "../schemas/password";
import { decryptPassword, encryptPassword } from "../utils/passwordEncryption";

class PasswordService {
    async addPassword(userId: number, input: AddPasswordInput, key: string) {
        const encryptedData = encryptPassword(input.password, key);

        await db.insert(passwords).values({
            userId: userId,
            appName: input.appName,
            email: input.email,
            username: input.username,
            iv: encryptedData.iv,
            password: encryptedData.content,
            baseUrl: input.baseUrl,
            specificUrl: input.specificUrl,
            faviconUrl: input.faviconUrl,
            notes: input.notes,
        });

        return {
            status: "success",
            message: "password added successfully",
        };
    }

    async getPasswords(userId: number, key: string) {
        const passwordsData = (
            await db.query.passwords.findMany({
                where: eq(passwords.userId, userId),
            })
        ).map((password: SelectPasswordsModel) => {
            const decryptedPassword = decryptPassword(
                password.iv,
                password.password,
                key
            );

            return {
                ...password,
                password: decryptedPassword,
            };
        });

        return {
            status: "success",
            data: passwordsData,
        };
    }

    async getPassword(userId: number, key: string, id: number) {
        const password = await db.query.passwords.findFirst({
            where: and(eq(passwords.id, id), eq(passwords.userId, userId)),
        });

        if (!password) {
            throw new AppError("PASSWORD_NOT_FOUND", "Password not found", 400);
        }
        password.password = decryptPassword(
            password.iv,
            password.password,
            key
        );

        return {
            status: "success",
            data: password,
        };
    }

    async updatePassword(
        id: number,
        input: AddPasswordInput,
        userId: number,
        key: string
    ) {
        const password = await db.query.passwords.findFirst({
            where: and(eq(passwords.id, id), eq(passwords.userId, userId)),
        });

        if (!password) {
            throw new AppError("PASSWORD_NOT_FOUND", "password not found", 400);
        }

        const encryptedData = encryptPassword(input.password, key);

        await db.update(passwords).set({
            password: encryptedData.content || password.password,
            iv: encryptedData.iv || password.iv,
            email: input.email || password.email,
            username: input.username || password.username,
            appName: input.appName || password.appName,
            baseUrl: input.baseUrl || password.baseUrl,
            specificUrl: input.specificUrl || password.specificUrl,
            faviconUrl: input.faviconUrl || password.faviconUrl,
            notes: input.notes || password.notes,
        });

        return {
            status: "success",
            message: "password updated successfully",
        };
    }

    async deletePassword(id: number, userId: number) {
        await db
            .delete(passwords)
            .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));

        return {
            status: "success",
            message: "password deleted successfully",
        };
    }

    async importPasswords(
        userId: number,
        inputPasswords: ImportPasswordsInput,
        key: string
    ) {
        const inputData = inputPasswords.map((input) => {
            const encryptedData = encryptPassword(input.password, key);

            return {
                userId: userId,
                appName: input.appName,
                email: input.email,
                username: input.username,
                iv: encryptedData.iv,
                password: encryptedData.content,
                baseUrl: input.baseUrl,
                specificUrl: input.specificUrl,
                faviconUrl: input.faviconUrl,
                notes: input.notes,
            };
        });

        await db.insert(passwords).values(inputData);

        return {
            status: "success",
            message: "passwords imported successfully",
        };
    }
}

export default new PasswordService();
