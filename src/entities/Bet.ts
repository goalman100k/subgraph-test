import { BigInt } from "@graphprotocol/graph-ts";
import { Bet } from "../../generated/schema";
import { ZERO_BD, ZERO_BI } from "../constant";

export const generateBetId = (market_address: string, epoch: BigInt, user_address: string): string => {
    return market_address + '/' + user_address + '/' + epoch.toString();
}

export const getBet = (market_address: string, user_address: string, epoch: BigInt): Bet => {
    let id = generateBetId(market_address, epoch, user_address);
    let bet = Bet.load(id);
    if (bet == null) {
        bet = new Bet(id);
        bet.market = market_address;
        bet.round = epoch.toString();
        bet.user = user_address;
        bet.amount = ZERO_BD;
        bet.position = "Bull";
        bet.claimed = false;
        bet.claimedAmount = ZERO_BD;
        bet.createdAt = ZERO_BI;
        bet.updatedAt = ZERO_BI;
        bet.isReverted = false;

        bet.save();
    }

    return bet;
}