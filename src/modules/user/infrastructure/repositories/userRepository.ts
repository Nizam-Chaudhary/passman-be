import { eq, ilike } from "drizzle-orm";
import { UserRepository } from "../../domain/repositories/userRepository.js";
import {
  CreateUser,
  UpdateUser,
  User,
  UserWithFile,
} from "../../types/user.js";
import { DB } from "../../../../db/index.js";
import { users } from "../../../../db/schema/schema.js";
import { Transaction } from "../../../../shared/domain/repositories/transaction.js";
import { DrizzleTx } from "../../../../shared/domain/types/drizzle.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@inject("Db") private readonly db: DB) {
    console.log("Registered user Repo");
  }

  getConnection(tx?: Transaction) {
    return tx ? (tx as unknown as DrizzleTx) : this.db;
  }

  async createUser(
    user: CreateUser,
    options?: { tx?: Transaction }
  ): Promise<User> {
    const connection = this.getConnection(options?.tx);

    const createdUser = (
      await connection.insert(users).values(user).returning()
    )[0];

    return {
      id: createdUser.id,
      email: createdUser.email,
      userName: createdUser.userName,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
      masterKey: createdUser.masterKey,
      recoveryKey: createdUser.recoveryKey,
    };
  }

  async updateUserById(
    id: number,
    user: UpdateUser,
    options?: { tx?: Transaction }
  ): Promise<User | undefined> {
    const connection = this.getConnection(options?.tx);

    const updatedUser = await connection
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) return undefined;

    return {
      id: updatedUser[0].id,
      email: updatedUser[0].email,
      userName: updatedUser[0].userName,
      createdAt: updatedUser[0].createdAt,
      updatedAt: updatedUser[0].updatedAt,
      masterKey: updatedUser[0].masterKey,
      recoveryKey: updatedUser[0].recoveryKey,
    };
  }

  async getUserById(
    id: number,
    options?: { tx?: Transaction }
  ): Promise<UserWithFile | undefined> {
    const connection = this.getConnection(options?.tx);

    const user = await connection.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        file: true,
      },
    });

    if (!user) return undefined;

    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      masterKey: user.masterKey,
      recoveryKey: user.recoveryKey,
      file: user.file,
    };
  }

  async getUserByEmail(
    email: string,
    options?: { tx?: Transaction }
  ): Promise<UserWithFile | undefined> {
    const connection = this.getConnection(options?.tx);

    const user = await connection.query.users.findFirst({
      where: ilike(users.email, email),
      with: {
        file: true,
      },
    });

    if (!user) return undefined;

    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      masterKey: user.masterKey,
      recoveryKey: user.recoveryKey,
      file: user.file,
    };
  }
}
