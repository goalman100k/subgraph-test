import { TotalBet } from "../../generated/schema";
import { ZERO_BD, ZERO_BI } from "../constant";

export const generateTotalBetId = (market_address: string, user_address: string): string => {
    return market_address + '/' + user_address;
}
export const getTotalBet = (market_address: string, user_addresss: string): TotalBet => {
    let id = generateTotalBetId(market_address, user_addresss);
    let totalBet = TotalBet.load(id);

    if (totalBet == null) {
        totalBet = new TotalBet(id);

        totalBet.user = user_addresss;
        totalBet.amount = ZERO_BD;
        totalBet.count = ZERO_BI;
        totalBet.market = market_address;
        totalBet.save();
    }

    return totalBet;
}