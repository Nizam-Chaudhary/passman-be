import { container } from "tsyringe";
import { PinoLoggerService } from "./shared/infrastructure/services/logger/pinoLoggerService";
import { db } from "./db/index";
import { VaultRepositoryImpl } from "./modules/vault/infrasctrucutre/repositories/vaultRepository";
import { UserRepositoryImpl } from "./modules/user/infrastructure/repositories/userRepository";
import { DrizzleTransactionManager } from "./shared/infrastructure/database/drizzleTransactionManager";
// shared
container.register("LoggerService", { useClass: PinoLoggerService });
container.register("Db", { useValue: db });

// repository
container.register("VaultRepository", { useClass: VaultRepositoryImpl });
container.register("UserRepository", { useClass: UserRepositoryImpl });

// transaction manager
container.register("TransactionManager", {
  useClass: DrizzleTransactionManager,
});
