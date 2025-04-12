import moment from "moment";
import { UserRepository } from "src/modules/user/domain/repositories/userRepository";
import { BadRequestError, NotFoundError } from "src/shared/lib/httpError";
import { inject, injectable } from "tsyringe";
import { MESSAGES } from "../../domain/constants/messages";
import { VerifyUserEmailBody } from "../../presentation/schemas/authSchema";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: VerifyUserEmailBody) {
    const user = await this.userRepository.getUserByEmail(input.email);

    if (!user) {
      throw new NotFoundError(MESSAGES.EMAIL_NOT_REGISTERED);
    }

    if (this.isOtpExpired(user.updatedAt)) {
      throw new BadRequestError(MESSAGES.OTP_EXPIRED);
    }
  }

  isOtpExpired(otpUpdatedAt: Date) {
    return moment(otpUpdatedAt).isBefore(moment().subtract(5, "minutes"));
  }
}
