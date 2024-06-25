import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const VAULT_ADDRESS = "inj1xmj4t3la5uxzh502lr5l34rxmp50jammdkgj5n";
export const MARKET_ADDRESS = "inj1juklwzneugw0k6ehelqanqgd22p5xvak8jenxw";

export const EVENT_TYPES = [
  "wasm-MarketDeployed",
  "wasm-VaultSet",
  "wasm-OperatorSet",
  "wasm-TransferOwnership",
  "wasm-MinBetAmountSet",
  "wasm-GenesisStart",
  "wasm-RoundLocked",
  "wasm-RoundEnded",
  "wasm-RoundStarted",
  "wasm-PositionOpened",
  "wasm-Claimed",
  "wasm-GenesisTimeSet",
  "wasm-OwnerChanged",
  "wasm-MarketUpdated",
  "wasm-TokenChanged",
  "wasm-LiquidityAdded",
  "wasm-LiquidityRemoved",
]

export const ZERO_BI = BigInt.zero();
export const ZERO_BD = BigDecimal.zero();

export const ONE_BI = BigInt.fromI32(1);
export const ONE_BD = BigDecimal.fromString("1");