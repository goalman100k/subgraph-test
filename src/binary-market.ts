import { Event } from "./pb/sf/cosmos/type/v2/Event";
import {
  MARKET_ADDRESS,
  ONE_BI,
  ZERO_ADDRESS,
  ZERO_BD,
  ZERO_BI,
} from "./constant";
import { getMarket } from "./entities/Market";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { getRound } from "./entities/Round";
import { getUser } from "./entities/User";
import { getTotalBet } from "./entities/TotalBet";
import { getBet } from "./entities/Bet";

export const handleMarketDeployed = (event: Event): void => {
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

export const handleVaultSet = (event: Event): void => {
  let market = getMarket(MARKET_ADDRESS);
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "vault") {
      market.vault = attr.value;
    }
  }

  market.save();
};

export const handleOperatorSet = (event: Event): void => {
  let market = getMarket(MARKET_ADDRESS);
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "operator") {
      market.operator = attr.value;
    }
  }

  market.save();
};

export const handleTransferOwnership = (event: Event): void => {
  let market = getMarket(MARKET_ADDRESS);
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "owner") {
      market.owner = attr.value;
    }
  }

  market.save();
};

export const handleMinBetAmountSet = (event: Event): void => {
  let market = getMarket(MARKET_ADDRESS);
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "amount") {
      market.minBetAmount = BigInt.fromString(attr.value);
    }
  }

  market.save();
};

export const handleGenesisStart = (event: Event): void => {
  let market = getMarket(MARKET_ADDRESS);
  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "timestamp") {
      market.genesisStartTime = BigInt.fromString(attr.value);
    }
  }

  market.save();
};

export const handleRoundLocked = (event: Event): void => {
  let epoch = ZERO_BI;
  let lock_price = ZERO_BD;
  let lock_time = ZERO_BI;

  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "epoch") {
      epoch = BigInt.fromString(attr.value);
    } else if (attr.key == "lock_price") {
      lock_price = BigDecimal.fromString(attr.value);
    } else if (attr.key == "timestamp") {
      lock_time = BigInt.fromString(attr.value);
    }
  }

  let round = getRound(MARKET_ADDRESS, epoch);
  round.lockPrice = lock_price;
  round.lockAt = lock_time;

  round.save();
};

export const handleRoundEnded = (event: Event): void => {
  let epoch = ZERO_BI;
  let close_price = ZERO_BD;
  let close_time = ZERO_BI;

  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "epoch") {
      epoch = BigInt.fromString(attr.value);
    } else if (attr.key == "close_price") {
      close_price = BigDecimal.fromString(attr.value);
    } else if (attr.key == "timestamp") {
      close_time = BigInt.fromString(attr.value);
    }
  }

  let round = getRound(MARKET_ADDRESS, epoch);
  round.closePrice = close_price;
  round.endAt = close_time;

  round.save();
};

export const handleRoundStarted = (event: Event): void => {
  let epoch = ZERO_BI;
  let start_time = ZERO_BI;

  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "epoch") {
      epoch = BigInt.fromString(attr.value);
    } else if (attr.key == "timestamp") {
      start_time = BigInt.fromString(attr.value);
    }
  }

  let round = getRound(MARKET_ADDRESS, epoch);
  round.startAt = start_time;

  round.save();
};

export const handlePositionOpened = (event: Event): void => {
  let epoch = ZERO_BI;
  let user_address = ZERO_ADDRESS.toHex();
  let amount = ZERO_BD;
  let position = "Bull";

  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "epoch") {
      epoch = BigInt.fromString(attr.value);
    } else if (attr.key == "user") {
      user_address = attr.value;
    } else if (attr.key == "amount") {
      amount = BigDecimal.fromString(attr.value);
    } else if (attr.key == "position") {
      position = attr.value == "0" ? "Bull" : "Bear";
    }
  }

  let round = getRound(MARKET_ADDRESS, epoch);
  let user = getUser(user_address);
  let market = getMarket(MARKET_ADDRESS);

  // Update user
  user.wholeBetAmount = user.wholeBetAmount.plus(amount);
  user.save();

  // update round
  // Update market
  round.totalBets = round.totalBets.plus(ONE_BI);
  round.totalAmount = round.totalAmount.plus(amount);
  market.totalAmount = market.totalAmount.plus(amount);
  market.totalBets = market.totalBets.plus(ONE_BI);

  if (position == "Bull") {
    round.bullAmount = round.bullAmount.plus(amount);
    round.bullBets = round.bullBets.plus(ONE_BI);
    market.totalBullAmount = market.totalBullAmount.plus(amount);
    market.totalBetsBull = market.totalBetsBull.plus(ONE_BI);
  } else {
    round.bearAmount = round.bearAmount.plus(amount);
    round.bearBets = round.bearBets.plus(ONE_BI);
    market.totalBearAmount = market.totalBearAmount.plus(amount);
    market.totalBetsBear = market.totalBetsBear.plus(ONE_BI);
  }
  round.save();
  market.save();

  // Update total bet
  let totalBet = getTotalBet(MARKET_ADDRESS, user_address);
  totalBet.amount = totalBet.amount.plus(amount);
  totalBet.count = totalBet.count.plus(ONE_BI);
  totalBet.save();

  // Update bet
  let bet = getBet(MARKET_ADDRESS, user_address, epoch);
  bet.amount = amount;
  bet.position = position;
  bet.save();
};

export const handleClaimed = (event: Event): void => {
  let epoch = ZERO_BI;
  let user_address = ZERO_ADDRESS.toHex();
  let amount = ZERO_BD;

  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "user") {
      user_address = attr.value;
    } else if (attr.key == "amount") {
      amount = BigDecimal.fromString(attr.value);
    } else if (attr.key == "epoch") {
      epoch = BigInt.fromString(attr.value);
    }
  }

  let bet = getBet(MARKET_ADDRESS, user_address, epoch);
  bet.claimed = true;
  bet.claimedAmount = amount;
  bet.save();
};

export const handleGenesisTimeSet = (event: Event): void => {
  let genesis_time = ZERO_BI;

  for (let i = 0; i < event.attributes.length; ++i) {
    const attr = event.attributes[i];
    if (attr.key == "genesiss_time") {
      genesis_time = BigInt.fromString(attr.value);
    }
  }

  let market = getMarket(MARKET_ADDRESS);
  market.genesisStartTime = genesis_time;

  market.save();
};
