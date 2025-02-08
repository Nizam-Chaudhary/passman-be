import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema/schema";
import { UpdateUserInput } from "./user.schema";

class UserService {
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
}

export default new UserService();
