import { ConflictError } from "../../../../shared/lib/httpError.js";
import { UserRepository } from "../../domain/repositories/userRepository.js";
import { CreateUserBody } from "../../types/user.js";
import { MESSAGES } from "../../domain/constants/messages.js";
import { hashSync } from "bcrypt";
import env from "../../../../shared/config/env.js";
import { generateOtp } from "../../../../utils/generator.js";
import { TransactionManager } from "../../../../shared/domain/repositories/transactionManager.js";
import { VaultRepository } from "../../../../modules/vault/domain/repositories/vaultRepository.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: UserRepository,

    @inject("VaultRepository")
    private readonly vaultRepository: VaultRepository,

    @inject("TransactionManager")
    private readonly transactionManager: TransactionManager
  ) {}

  async execute(user: CreateUserBody) {
    const isEmailRegistered = await this.isEmailRegistered(user.email);

    if (isEmailRegistered) {
      throw new ConflictError(MESSAGES.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = hashSync(user.password, env.SALT_ROUNDS);

    const otp = generateOtp();

    let createdUser;

    await this.transactionManager.run(async (tx) => {
      createdUser = await this.userRepository.createUser(
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
          userId: createdUser.id,
        },
        { tx }
      );
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
