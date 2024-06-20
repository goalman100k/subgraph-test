import { isValidEventSource } from "./helper";
import { Event } from "./pb/sf/cosmos/type/v2/Event";
import { MARKET_ADDRESS } from "./constant";
import { getMarket } from "./entities/Market";

export const handleMarketDeployed = (event: Event): void => {
  // Filter by contract address
  if (isValidEventSource(event)) {
    return;
  }
  let market = getMarket(MARKET_ADDRESS);
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "owner") {
      market.owner = attr.value;
    } else if (attr.key == "operator") {
      market.operator = attr.value;
    }
  }

  market.save();
};
