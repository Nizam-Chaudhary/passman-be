import { compare, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users } from "../db/schema/user";
import AppError from "../lib/appError";
import env from "../lib/env";
import {
    SignInUserInput,
    SignUpUserInput,
    UpdateUserInput,
} from "../schemas/user";
import { generateOtp, generateSalt } from "../utils/generator";

class UserService {
    async signUpUser(input: SignUpUserInput) {
        const alreadyRegistered = await db.query.users.findFirst({
            columns: {
                id: true,
            },
            where: eq(users.email, input.email),
        });

        if (alreadyRegistered) {
            const newLocal = "Email already registered";
            throw new AppError("EMAIL_ALREADY_REGISTERED", newLocal, 400);
        }

        const hashedPassword = await hash(input.password, env.SALT_ROUNDS);

        const otp = generateOtp();

        const user = await db
            .insert(users)
            .values({
                email: input.email,
                userName: input.userName,
                password: hashedPassword,
                otp: otp,
                isVerified: true,
                saltValue: generateSalt(),
            })
            .returning();

        return {
            status: "success",
            message: "User signed up successfully",
            data: user[0],
        };
    }

    async signInUser(input: SignInUserInput) {
        const userData = await db.query.users.findFirst({
            columns: {
                id: true,
                userName: true,
                email: true,
                password: true,
                isVerified: true,
                saltValue: true,
            },
            where: eq(users.email, input.email),
        });

        if (!userData) {
            throw new AppError(
                "USER_NOT_REGISTERED",
                "Email not registered. Please register first!",
                401,
                true
            );
        }

        if (!userData?.isVerified) {
            throw new AppError(
                "USER_NOT_VERIFIED",
                "Email not verified",
                401,
                true
            );
        }
        const isMatch =
            userData && (await compare(input.password, userData.password));

        if (!userData || !isMatch) {
            throw new AppError(
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                401,
                true
            );
        }

        return {
            id: userData.id,
            email: userData.email,
            userName: userData.userName,
        };
    }

    async getUser(id: number) {
        const userData = await db.query.users.findFirst({
            columns: {
                id: true,
                userName: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
            where: eq(users.id, id),
        });

        return {
            status: "success",
            data: userData,
        };
    }

    async updateUser(id: number, input: UpdateUserInput) {
        const user = await db
            .update(users)
            .set({
                userName: input.userName,
            })
            .where(eq(users.id, id))
            .returning();

        return {
            status: "success",
            message: "user name updated successfully",
            data: user[0],
        };
    }
}

export default new UserService();
