import { BigDecimal } from "@graphprotocol/graph-ts";
import { VAULT_ADDRESS, ZERO_ADDRESS, ZERO_BD } from "./constant";
import { getVault } from "./entities/Vault";
import { isValidEventSource } from "./helper";
import { Event } from "./pb/sf/cosmos/type/v2/Event";
import { getVaultPosition } from "./entities/VaultPosition";

export const handleOwnerChanged = (event: Event): void => {
  if (!isValidEventSource(event)) {
    return;
  }

  let owner = ZERO_ADDRESS.toHex();

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
  if (!isValidEventSource(event)) {
    return;
  }

  let market = ZERO_ADDRESS.toHex();
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
    vault.market = ZERO_ADDRESS.toHex();
  }

  vault.save();
};

export const handleLiquidityAdded = (event: Event): void => {
  if (!isValidEventSource(event)) {
    return;
  }

  let user_address = ZERO_ADDRESS.toHex();
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
  if (!isValidEventSource(event)) {
    return;
  }

  let user_address = ZERO_ADDRESS.toHex();
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
