import { NotFoundError } from "../../../../shared/lib/httpError";
import { UserRepository } from "../../domain/repositories/userRepository";
import { MESSAGES } from "../../domain/constants/messages";
import { UpdateUser } from "../../types/user";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUserByIdUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: UserRepository
  ) {}

  async execute(id: number, data: UpdateUser) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    if (data.fileId) {
      // TODO: delete existing file from aws
    }

    const updatedUser = await this.userRepository.updateUserById(id, data);

    return updatedUser;
  }
}
