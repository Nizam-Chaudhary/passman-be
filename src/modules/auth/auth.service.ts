import { compare, compareSync, hash, hashSync } from "bcrypt";
import { eq, ilike } from "drizzle-orm";
import type {
  CreateMasterKeyBody,
  SignInUserInput,
  UpdateMasterPasswordBody,
  VerifyMasterPasswordBody,
  VerifyUserEmailBody,
} from "./auth.schema";

import moment from "moment";

import { users } from "../../db/schema/schema";
// import * as userTemplates from "../../templates/user";
import { Database } from "src/db";
import env from "../../shared/config/env";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../shared/lib/httpError";
import { generateOtp } from "../../utils/generator";
const db = new Database().connection;

class AuthService {
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
      where: ilike(users.email, input.email),
    });

    if (!userData) {
      throw new NotFoundError("Email not registered");
    }

    if (!userData.isVerified) {
      throw new BadRequestError("Email not verified. Please verify first!");
    }

    const isMatch =
      userData && (await compare(input.password, userData.password));

    if (!userData || !isMatch) {
      throw new BadRequestError("Invalid email or password");
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
      throw new NotFoundError("Refresh token is invalid");
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
        updatedAt: true,
      },
      where: ilike(users.email, input.email),
    });

    if (!userData) {
      throw new NotFoundError("Email not registered");
    }

    if (moment(userData.updatedAt).isBefore(moment().subtract(5, "minutes"))) {
      throw new BadRequestError("OTP expired");
    }
    if (input.otp !== userData.otp) {
      throw new BadRequestError("Invalid OTP");
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
      throw new NotFoundError("Email not registered");
    }

    // if (compareSync(input.masterPassword, userPassword.password)) {
    //   throw new AppError(
    //     "MASTER_PASSWORD_AND_PASSWORD_MATCH",
    //     "Master password and user password cannot be same",
    //     400
    //   );
    // }

    await db
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
      throw new NotFoundError("Master password not created yet");
    }

    const isMasterPasswordValid = compareSync(
      input.masterPassword,
      user.masterPassword
    );

    if (!isMasterPasswordValid) {
      throw new UnprocessableEntityError("Incorrect master password");
    }

    return {
      status: "success",
      message: "Master password verified successfully",
      data: {
        masterKey: user.masterKey,
      },
    };
  }

  async resendOtp(email: string) {
    const user = await db.query.users.findFirst({
      where: ilike(users.email, email),
    });

    if (!user) {
      throw new NotFoundError("Email not registered");
    }

    if (moment(user.updatedAt).isAfter(moment().subtract(2, "minutes"))) {
      throw new ForbiddenError("OTP resend limit reached");
    }

    const otp = generateOtp();

    const updateOtp = await db
      .update(users)
      .set({
        otp,
      })
      .where(ilike(users.email, email));

    if (!updateOtp.rowCount || updateOtp.rowCount <= 0) {
      throw new BadRequestError("Error sending otp");
    }

    // const emailBody = userTemplates.resendOtp({ otp });

    // sendMail({
    //   toAddresses: email,
    //   subject: "Passman's OTP (One time password)",
    //   emailBody,
    // });

    return {
      status: "success",
      message: "otp sent successfully",
    };
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const user = await db.query.users.findFirst({
      where: ilike(users.email, email),
    });

    if (!user) {
      throw new NotFoundError("Email not registered");
    }

    if (moment(user.updatedAt).isAfter(moment().subtract(2, "minutes"))) {
      throw new ForbiddenError("Email sending limit reached");
    }

    // const url = `${env.FE_URL}/reset-password/update?token=${token}`;
    // const emailBody = userTemplates.resetLoginPassword({ url });

    // sendMail({
    //   toAddresses: email,
    //   subject: "Reset login password",
    //   emailBody,
    // });

    return {
      status: "success",
      message: "reset password email sent successfully",
    };
  }

  async resetPassword(email: string, password: string) {
    const hashedPassword = hashSync(password, env.SALT_ROUNDS);

    const passwordUpdate = await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(ilike(users.email, email));

    if (!passwordUpdate.rowCount || passwordUpdate.rowCount <= 0) {
      throw new NotFoundError("Email not registered");
    }

    return {
      status: "success",
      message: "password updated successfully",
    };
  }

  async updateMasterPassword(userId: number, body: UpdateMasterPasswordBody) {
    const hashedMasterPassword = await hash(
      body.masterPassword,
      env.SALT_ROUNDS
    );

    const updateUser = await db
      .update(users)
      .set({
        ...body,
        masterPassword: hashedMasterPassword,
      })
      .where(eq(users.id, userId));

    if (!updateUser.rowCount || updateUser.rowCount <= 0) {
      throw new NotFoundError("Email not registered");
    }

    return {
      status: "success",
      message: "master password updated successfully",
    };
  }
}

export default new AuthService();
