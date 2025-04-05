import { ConflictError } from "../../../../shared/lib/httpError";
import { UserRepository } from "../../domain/repositories/userRepository";
import { CreateUserBody } from "../../types/user";
import { MESSAGES } from "../../domain/constants/messages";
import { hashSync } from "bcrypt";
import env from "../../../../shared/config/env";
import { generateOtp } from "../../../../utils/generator";
import { TransactionManager } from "../../../../shared/domain/repositories/transactionManager";
import { VaultRepository } from "../../../../modules/vault/domain/repositories/vaultRepository";
import { inject, injectable } from "tsyringe";
import { LoggerService } from "src/shared/domain/services/loggerService";

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

    let createdUser;

    createdUser = await this.userRepository.createUser({
      ...user,
      otp,
      password: hashedPassword,
      isVerified: false,
    });

    this.logger.log(createdUser, "createdUser");

    await this.vaultRepository.createVault({
      name: "Default",
      userId: createdUser.id,
    });

    // await this.transactionManager.run(async (tx) => {
    //   this.logger.log("Starting transaction in createUserUseCase");
    //   createdUser = await this.userRepository.createUser(
    //     {
    //       ...user,
    //       otp,
    //       password: hashedPassword,
    //       isVerified: false,
    //     },
    //     { tx }
    //   );

    //   this.logger.log(createdUser, "createdUser");

    //   await this.vaultRepository.createVault(
    //     {
    //       name: "Default",
    //       userId: createdUser.id,
    //     },
    //     { tx }
    //   );
    // });

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
