import { NotFoundError } from "../../../../shared/lib/httpError";
import { UserRepository } from "../../domain/repositories/userRepository";
import { MESSAGES } from "../../domain/constants/messages";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserByIdUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: UserRepository
  ) {}

  async execute(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }
}
