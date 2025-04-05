import { Transaction } from "../../../../shared/domain/repositories/transaction";
import { CreateUser, UpdateUser, User, UserWithFile } from "../../types/user";

export interface UserRepository {
  /**
   * Creates a new user
   * @param user - The user data conforming to CreateUserDTO
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the creation operation
   * @returns A Promise that resolves to the UserDTO if returning is true, undefined otherwise
   */
  createUser(
    user: CreateUser,
    options?: {
      tx?: Transaction;
    }
  ): Promise<User>;

  /**
   * Updates an existing user
   * @param id - The ID of the user to update
   * @param user - The user data to update conforming to UpdateUserDTO
   * @param options - Options object containing returning flag
   * @param options.tx - The transaction to use for the update operation
   * @returns A Promise that resolves to the updated UserDTO if returning is true, undefined otherwise
   */
  updateUserById(
    id: number,
    user: UpdateUser,
    options?: {
      tx?: Transaction;
    }
  ): Promise<User | undefined>;

  /**
   * Gets a user by their ID
   * @param id - The ID of the user to retrieve
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the select operation
   * @returns A Promise that resolves to the UserDTO or undefined if not found
   */
  getUserById(
    id: number,
    options?: {
      tx?: Transaction;
    }
  ): Promise<UserWithFile | undefined>;

  /**
   * Gets a user by their email address
   * @param email - The email address of the user to retrieve
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the select operation
   * @returns A Promise that resolves to the UserDTO or undefined if not found
   */
  getUserByEmail(
    email: string,
    options?: {
      tx?: Transaction;
    }
  ): Promise<UserWithFile | undefined>;
}
