import { Address } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";
import { ZERO_BD } from "../constant";

export const getUser = (user_address: string): User => {
    let user = User.load(user_address);
    if (user == null) {
        user = new User(user_address);
        user.address = user_address;
        user.wholeBetAmount = ZERO_BD;
        user.wholePayoutAmount = ZERO_BD;

        user.invest = ZERO_BD;
        user.balance = ZERO_BD;
        user.profit_lose = ZERO_BD;
        user.roi = ZERO_BD;
        user.save();
    }

    return user;
}