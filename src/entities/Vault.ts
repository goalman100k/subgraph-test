import { Address } from "@graphprotocol/graph-ts";
import { Vault } from "../../generated/schema";
import { MARKET_ADDRESS, VAULT_ADDRESS, ZERO_ADDRESS, ZERO_BD } from "../constant";

export const getVault = (): Vault => {
  let vault = Vault.load(VAULT_ADDRESS);
  if (vault == null) {
    vault = new Vault(VAULT_ADDRESS);
    vault.address = Address.fromString(VAULT_ADDRESS);
    vault.market = MARKET_ADDRESS;
    vault.totalShares = ZERO_BD;
    vault.totalStakedAmount = ZERO_BD;
    vault.totalInvestedAmount = ZERO_BD;
    vault.feeAccrued = ZERO_BD;
    vault.admin = ZERO_ADDRESS.toHex();
    vault.save();
  }

  return vault;
};
