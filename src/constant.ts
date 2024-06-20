import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const VAULT_ADDRESS = "inj1xmj4t3la5uxzh502lr5l34rxmp50jammdkgj5n";
export const MARKET_ADDRESS = "inj1juklwzneugw0k6ehelqanqgd22p5xvak8jenxw";

export enum EVENT_TYPES {
  MarketDeployed = "wasm-MarketDeployed",
  VaultSet = "wasm-VaultSet",
  OperatorSet = "wasm-OperatorSet",
  TransferOwnership = "wasm-TransferOwnership",
  MinBetAmountSet = "wasm-MinBetAmountSet",
  GenesisStart = "wasm-GenesisStart",
  RoundLocked = "wasm-RoundLocked",
  RoundEnded = "wasm-RoundEnded",
  RoundStarted = "wasm-RoundStarted",
  PositionOpened = "wasm-PositionOpened",
  Claimed = "wasm-Claimed",
  GenesisTimeSet = "wasm-GenesisTimeSet",
  OwnerChagned = "wasm-OwnerChanged",
  MarketUpdated = "wasm-MarketUpdated",
  TokenChagned = "wasm-TokenChanged",
  LiquidityAdded = "wasm-LiquidityAdded",
  LiquidityRemoved = "wasm-LiquidityRemoved",
}

export const ZERO_BI = BigInt.zero();
export const ZERO_BD = BigDecimal.zero();
export const ZERO_ADDRESS = Address.zero();