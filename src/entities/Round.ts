import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Market, Round } from "../../generated/schema";
import { ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../constant";
import { getBlockTimeForEpoch } from "../helper";
import { getMarket } from "./Market";

const generateRoundId = (marketAddress: string, epoch: BigInt): string => {
  return marketAddress + "/" + epoch.toString();
};

export const getRound = (marketAddress: string, epoch: BigInt): Round => {
  let id = generateRoundId(marketAddress, epoch);

  let market = getMarket(marketAddress);
  let round = Round.load(id);
  if (round == null) {
    round = new Round(id);
    round.market = marketAddress;
    round.epoch = epoch;

    round.totalAmount = ZERO_BD;
    round.bullAmount = ZERO_BD;
    round.bearAmount = ZERO_BD;

    round.totalBets = ZERO_BI;
    round.bullBets = ZERO_BI;
    round.bearBets = ZERO_BI;

    const duration = BigInt.fromI32(60);
    round.estimatedStartTime = getBlockTimeForEpoch(
      market.genesisStartTime,
      epoch
    );
    round.estimatedLockTime = round.estimatedStartTime.plus(duration);
    round.estimatedEndTime = round.estimatedLockTime.plus(duration);
    round.save();
  }

  return round;
};
