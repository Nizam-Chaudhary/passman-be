import { container } from "tsyringe";
import { PinoLoggerService } from "./shared/infrastructure/services/logger/pinoLoggerService.js";
import { db } from "./db/index.js";
import { VaultRepositoryImpl } from "./modules/vault/infrasctrucutre/repositories/vaultRepository.js";
import { UserRepositoryImpl } from "./modules/user/infrastructure/repositories/userRepository.js";
import { DrizzleTransactionManager } from "./shared/infrastructure/database/drizzleTransactionManager.js";
import { VaultController } from "./modules/vault/presentation/controllers/vault.controller.js";
import { UserController } from "./modules/user/presentation/controllers/userController.js";

// export const TOKENS = {
//   LoggingService: "LoggingService",
//   Logger: "Logger",
//   Db: "Db",
//   VaultRepository: "VaultRepository",
//   UserRepository: "UserRepository",
//   TransactionManager: "TransactionManager",
// };

// shared
container.register("LoggingService", { useClass: PinoLoggerService });
container.register("Db", { useValue: db });

// repository
container.register("VaultRepository", { useValue: VaultRepositoryImpl });
container.register("UserRepository", { useValue: UserRepositoryImpl });

// controllers
container.register("VaultController", { useValue: VaultController });
container.register("UserController", { useValue: UserController });

// transaction manager
container.register("TransactionManager", {
  useValue: DrizzleTransactionManager,
});
console.log("registered DI");
