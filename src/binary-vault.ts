import { BigDecimal } from "@graphprotocol/graph-ts";
import { VAULT_ADDRESS, ZERO_BD } from "./constant";
import { getVault } from "./entities/Vault";
import { Event } from "./pb/sf/cosmos/type/v2/Event";
import { getVaultPosition } from "./entities/VaultPosition";

export const handleOwnerChanged = (event: Event): void => {
  let owner = "";

  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "new_owner") {
      owner = attr.value;
    }
  }

  let vault = getVault();
  vault.admin = owner;

  vault.save();
};

export const handleMarketupdated = (event: Event): void => {
  let market = "";
  let value = false;
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "market") {
      market = attr.value;
    } else if (attr.key == "value") {
      value = attr.value == "true";
    }
  }

  let vault = getVault();
  if (value == true) {
    vault.market = market;
  } else {
    vault.market = "";
  }

  vault.save();
};

export const handleLiquidityAdded = (event: Event): void => {
  let user_address = "";
  let amount = ZERO_BD;
  let share = ZERO_BD;

  let value = false;
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "user") {
      user_address = attr.value;
    } else if (attr.key == "amount") {
      amount = BigDecimal.fromString(attr.value);
    } else if (attr.key == "share") {
      share = BigDecimal.fromString(attr.value);
    }
  }

  // Update vault
  let vault = getVault();
  vault.totalShares = vault.totalShares.plus(share);
  vault.totalStakedAmount = vault.totalStakedAmount.plus(amount);
  vault.totalInvestedAmount = vault.totalInvestedAmount.plus(amount);
  vault.save();

  // Update vault position of user
  let vaultPosition = getVaultPosition(VAULT_ADDRESS, user_address);
  vaultPosition.investAmount = vaultPosition.investAmount.plus(amount);
  vaultPosition.shareAmount = vaultPosition.shareAmount.plus(share);
  vaultPosition.save();
};

export const handleLiquidityRemoved = (event: Event): void => {
  let user_address = "";
  let amount = ZERO_BD;
  let share = ZERO_BD;

  let value = false;
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "user") {
      user_address = attr.value;
    } else if (attr.key == "amount") {
      amount = BigDecimal.fromString(attr.value);
    } else if (attr.key == "share") {
      share = BigDecimal.fromString(attr.value);
    }
  }

  // Update vault
  let vault = getVault();
  vault.totalStakedAmount = vault.totalStakedAmount.minus(amount);
  vault.totalInvestedAmount = vault.totalInvestedAmount.minus(amount);
  vault.totalShares = vault.totalShares.minus(amount);
  vault.save();

  // Update vault position of user
  let vaultPosition = getVaultPosition(VAULT_ADDRESS, user_address);
  vaultPosition.investAmount = vaultPosition.investAmount.minus(amount);
  vaultPosition.shareAmount = vaultPosition.shareAmount.minus(share);
  vaultPosition.save();
};
