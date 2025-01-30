import { compare, compareSync, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { vaults } from "../db/schema/schema";
import { users } from "../db/schema/users";
import AppError from "../lib/appError";
import env from "../lib/env";
import {
  CreateMasterKeyBody,
  SignInUserInput,
  SignUpUserInput,
  UpdateUserInput,
  VerifyMasterPasswordBody,
  VerifyUserEmailBody,
} from "../schemas/user";
import { generateOtp } from "../utils/generator";

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

    return await db.transaction(async (tx) => {
      const user = await tx
        .insert(users)
        .values({
          email: input.email,
          userName: input.userName,
          password: hashedPassword,
          otp: otp,
          isVerified: false,
        })
        .returning();

      await tx.insert(vaults).values({
        name: "Default",
        userId: user[0].id,
      });

      return {
        status: "success",
        message: "User signed up successfully",
        data: user[0],
      };
    });
  }

  async signInUser(input: SignInUserInput) {
    const userData = await db.query.users.findFirst({
      columns: {
        id: true,
        userName: true,
        email: true,
        password: true,
        masterKey: true,
        isVerified: true,
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

    if (!userData.isVerified) {
      throw new AppError(
        "EMAIL_NOT_VERIFIED",
        "Email not verified. Please verify first!",
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
      masterKey: userData.masterKey,
      isVerified: userData.isVerified,
    };
  }

  async refreshToken(id: number) {
    const userData = await db.query.users.findFirst({
      columns: {
        id: true,
        userName: true,
        email: true,
        masterKey: true,
      },
      where: eq(users.id, id),
    });

    if (!userData) {
      throw new AppError("UNAUTORIZED", "Refresh token is invalid", 401);
    }

    return {
      id: userData.id,
      email: userData.email,
      userName: userData.userName,
      masterKeyCreated: !!userData.masterKey,
    };
  }

  async verifyUserEmail(input: VerifyUserEmailBody) {
    const userData = await db.query.users.findFirst({
      columns: {
        id: true,
        email: true,
        otp: true,
      },
      where: eq(users.email, input.email),
    });

    if (!userData) {
      throw new AppError(
        "USER_NOT_REGISTERED",
        "Email not registered. Please register first!",
        400
      );
    }

    if (input.otp !== userData.otp) {
      throw new AppError("INVALID_OTP", "Invalid OTP", 400);
    }

    await db
      .update(users)
      .set({
        isVerified: true,
      })
      .where(eq(users.id, userData.id));

    return {
      status: "success",
      message: "Email verified successfully",
    };
  }

  async getUser(id: number) {
    const userData = await db.query.users.findFirst({
      columns: {
        id: true,
        userName: true,
        email: true,
        masterKey: true,
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
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return {
      status: "success",
      message: "user name updated successfully",
      data: user[0],
    };
  }

  async createMasterKey(id: number, input: CreateMasterKeyBody) {
    const hashedMasterPassword = await hash(
      input.masterPassword,
      env.SALT_ROUNDS
    );

    const userPassword = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: true,
      },
    });

    if (!userPassword?.password) {
      throw new AppError("USER_NOT_FOUND", "user not found", 400);
    }
    if (compareSync(input.masterPassword, userPassword.password)) {
      throw new AppError(
        "MASTER_PASSWORD_AND_PASSWORD_MATCH",
        "Master password and user password cannot be same",
        400
      );
    }

    const user = await db
      .update(users)
      .set({
        masterPassword: hashedMasterPassword,
        masterKey: input.masterKey,
        recoveryKey: input.recoveryKey,
      })
      .where(eq(users.id, id));

    return {
      status: "success",
      message: "Master key created successfully",
    };
  }

  async verifyMasterPassword(id: number, input: VerifyMasterPasswordBody) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        masterKey: true,
        masterPassword: true,
      },
    });

    if (!user?.masterPassword) {
      throw new AppError(
        "MASTER_PASSWORD_NOT_EXISTS",
        "Master password not created yet",
        400
      );
    }

    const isMasterPasswordValid = compareSync(
      input.masterPassword,
      user.masterPassword
    );

    if (!isMasterPasswordValid) {
      throw new AppError(
        "INCORRECT_MASTER_PASSWORD",
        "Incorrect master password",
        400
      );
    }

    return {
      status: "success",
      message: "Master password verified successfully",
      data: {
        masterKey: user.masterKey,
      },
    };
  }
}

export default new UserService();
