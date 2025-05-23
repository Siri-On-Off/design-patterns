import { Subscriber, ParkingEvent } from "./interfaces.js";

export class Display implements Subscriber {
  update(event: ParkingEvent): void {
    const action = event.type === "enter" ? "entered" : "left";
    console.log(
      `A car ${action} the lot ${event.lotName}: ${event.occupied}/${event.capacity} occupied.`
    );
  }
}
