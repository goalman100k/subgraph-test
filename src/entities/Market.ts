import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";
import { ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../constant";

export const getMarket = (id: string): Market => {
  let market = Market.load(id);
  if (market == null) {
    market = new Market(id);
    market.address = Address.fromString(id);
    market.totalUsers = ZERO_BI;
    market.totalBets = ZERO_BI;
    market.totalBetsBull = ZERO_BI;
    market.totalBetsBear = ZERO_BI;
    market.totalAmount = ZERO_BD;
    market.totalBullAmount = ZERO_BD;
    market.totalBearAmount = ZERO_BD;
    market.minBetAmount = ZERO_BI;

    market.owner = ZERO_ADDRESS.toHex();
    market.operator = ZERO_ADDRESS.toHex();

    market.genesisStartTime = ZERO_BI;
    market.vault = ZERO_ADDRESS.toHex();
    market.save();
  }

  return market;
};
