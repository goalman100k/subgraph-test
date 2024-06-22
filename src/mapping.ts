import { log } from "@graphprotocol/graph-ts";
import { EventList } from "./pb/sf/substreams/cosmos/v1/EventList";
import { Protobuf } from "as-proto/assembly";
import { EVENT_TYPES } from "./constant";
import {
  handleClaimed,
  handleGenesisStart,
  handleGenesisTimeSet,
  handleMarketDeployed,
  handleMinBetAmountSet,
  handleOperatorSet,
  handlePositionOpened,
  handleRoundEnded,
  handleRoundLocked,
  handleRoundStarted,
  handleTransferOwnership,
  handleVaultSet,
} from "./binary-market";
import {
  handleLiquidityAdded,
  handleLiquidityRemoved,
  handleMarketupdated,
  handleOwnerChanged,
} from "./binary-vault";
import { isValidEventSource } from "./helper";

export function handleEvents(bytes: Uint8Array): void {
  const eventList: EventList = Protobuf.decode<EventList>(
    bytes,
    EventList.decode
  );
  const events = eventList.events;

  log.info("Protobuf decoded, length: {}", [events.length.toString()]);

  for (let i = 0; i < events.length; i++) {
    const event = events[i].event;
    if (event == null || EVENT_TYPES.indexOf(event.type) == -1) {
      return;
    }

    // Filter by event types
    if (event == null) {
      // should be filtered by substreams
      continue;
    }
    if (!isValidEventSource(event)) {
      continue;
    }

    if (event.type == "wasm-MarketDeployed") {
      handleMarketDeployed(event);
    } else if (event.type == "wasm-VaultSet") {
      handleVaultSet(event);
    } else if (event.type == "wasm-OperatorSet") {
      handleOperatorSet(event);
    } else if (event.type == "wasm-TransferOwnership") {
      handleTransferOwnership(event);
    } else if (event.type == "wasm-MinBetAmountSet") {
      handleMinBetAmountSet(event);
    } else if (event.type == "wasm-GenesisStart") {
      handleGenesisStart(event);
    } else if (event.type == "wasm-RoundLocked") {
      handleRoundLocked(event);
    } else if (event.type == "wasm-RoundEnded") {
      handleRoundEnded(event);
    } else if (event.type == "wasm-RoundStarted") {
      handleRoundStarted(event);
    } else if (event.type == "wasm-PositionOpened") {
      handlePositionOpened(event);
    } else if (event.type == "wasm-Claimed") {
      handleClaimed(event);
    } else if (event.type == "wasm-GenesisTimeSet") {
      handleGenesisTimeSet(event);
    } else if (event.type == "wasm-OwnerChagned") {
      handleOwnerChanged(event);
    } else if (event.type == "wasm-MarketUpdated") {
      handleMarketupdated(event);
    } else if (event.type == "wasm-TokenChanged") {
    } else if (event.type == "wasm-LiquidityAdded") {
      handleLiquidityAdded(event);
    } else if (event.type == "wasm-LiquidityRemoved") {
      handleLiquidityRemoved(event);
    }
  }
}
