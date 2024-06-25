import { VaultPosition } from "../../generated/schema";
import { ZERO_BD } from "../constant";

export const generateVaultPositionId = (
  vault_address: string,
  user_address: string
): string => {
  return vault_address + "/" + user_address;
};

export const getVaultPosition = (
  vault_address: string,
  user_address: string
): VaultPosition => {
  let id = generateVaultPositionId(vault_address, user_address);
  let vaultPosition = VaultPosition.load(id);

  if (vaultPosition == null) {
    vaultPosition = new VaultPosition(id);
    vaultPosition.vault = vault_address;
    vaultPosition.investAmount = ZERO_BD;
    vaultPosition.shareAmount = ZERO_BD;
    vaultPosition.owner = user_address;
    vaultPosition.save();
  }
  return vaultPosition;
};
