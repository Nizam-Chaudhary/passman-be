import { hashSync } from "bcrypt";
import { LoggerService } from "src/shared/domain/services/loggerService";
import { inject, injectable } from "tsyringe";
import { VaultRepository } from "../../../../modules/vault/domain/repositories/vaultRepository";
import env from "../../../../shared/config/env";
import { TransactionManager } from "../../../../shared/domain/repositories/transactionManager";
import { ConflictError } from "../../../../shared/lib/httpError";
import { generateOtp } from "../../../../utils/generator";
import { MESSAGES } from "../../domain/constants/messages";
import { UserRepository } from "../../domain/repositories/userRepository";
import { CreateUserBody } from "../../types/user";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: UserRepository,

    @inject("VaultRepository")
    private readonly vaultRepository: VaultRepository,

    @inject("TransactionManager")
    private readonly transactionManager: TransactionManager,

    @inject("LoggerService")
    private readonly logger: LoggerService
  ) {}

  async execute(user: CreateUserBody) {
    this.logger.log(user, "User");
    const isEmailRegistered = await this.isEmailRegistered(user.email);

    if (isEmailRegistered) {
      throw new ConflictError(MESSAGES.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = hashSync(user.password, env.SALT_ROUNDS);

    const otp = generateOtp();

    const createdUser = await this.transactionManager.run(async (tx) => {
      const userData = await this.userRepository.createUser(
        {
          ...user,
          otp,
          password: hashedPassword,
          isVerified: false,
        },
        { tx }
      );

      await this.vaultRepository.createVault(
        {
          name: "Default",
          userId: userData.id,
        },
        { tx }
      );

      return userData;
    });

    // TODO: Send email with OTP
    // sendMail({
    //   toAddresses: input.email,
    //   subject: "Passman account verfication OTP",
    //   emailBody: signUpEmailBody,
    // });

    return createdUser;
  }

  async isEmailRegistered(email: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (user == null) {
      return false;
    }

    return true;
  }
}
