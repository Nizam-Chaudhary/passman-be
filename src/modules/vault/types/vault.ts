import { z } from "zod";
import {
  addUpdateVaultBodySchema,
  selectVaultsSchema,
} from "../presentation/schemas/vaultSchema";

export type Vault = z.infer<typeof selectVaultsSchema>;

export type CreateUpdateVault = z.infer<typeof addUpdateVaultBodySchema>;
