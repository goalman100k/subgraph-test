import { BigInt } from "@graphprotocol/graph-ts";
import { MARKET_ADDRESS, VAULT_ADDRESS } from "./constant";
import { Event } from "./pb/sf/cosmos/type/v2/Event";

export const isValidEventSource = (event: Event): bool => {
  let contract_addr = "";
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];

    if (attr.key == "_contract_address") {
      contract_addr = attr.value;
    }
  }

  return contract_addr == MARKET_ADDRESS || contract_addr == VAULT_ADDRESS;
};

export const getBlockTimeForEpoch = (genesisStartTime: BigInt, epoch: BigInt): BigInt => {
  const duration = BigInt.fromI32(60);
  return genesisStartTime.plus(epoch.times(duration));
}