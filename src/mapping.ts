import { log } from "@graphprotocol/graph-ts";
import { EventList } from "./pb/sf/substreams/cosmos/v1/EventList";
import { Protobuf } from 'as-proto/assembly';
import { EVENT_TYPES } from "./constant";
import { handleMarketDeployed } from "./binary-market";

export function handleEvents(bytes: Uint8Array): void {
    const eventList: EventList = Protobuf.decode<EventList>(bytes, EventList.decode);
    const events = eventList.events;

    log.info("Protobuf decoded, length: {}", [events.length.toString()]);

    for (let i = 0; i < events.length; i++) {
        const event = events[i].event;
        if (event == null || EVENT_TYPES.indexOf(event.type) == -1) {
            return;
        }
        
        // Filter by event types
        if (event == null) { // should be filtered by substreams
            continue;
        }

        if (event.type == "wasm-MarketDeployed") {
            handleMarketDeployed(event);
        }
    }
}