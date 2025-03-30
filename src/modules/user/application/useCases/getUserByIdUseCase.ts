import { NotFoundError } from "../../../../shared/lib/httpError.js";
import { UserRepository } from "../../domain/repositories/userRepository.js";
import { MESSAGES } from "../../domain/constants/messages.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserByIdUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: UserRepository
  ) {
    console.log("Get by id user use case");
  }

  async execute(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }
}
