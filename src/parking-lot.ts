import { Publisher, Subscriber, ParkingEvent } from "./interfaces.js";

export class ParkingLot implements Publisher {
  public occupied = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number
  ) {}

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  notify(event: ParkingEvent): void {
    this.subscribers.forEach((s) => s.update(event));
  }

  enter(): void {
    if (this.isFull()) throw new Error("the parking lot is full");
    this.occupied++;
    this.notify({
      type: "enter",
      lotName: this.name,
      occupied: this.occupied,
      capacity: this.capacity,
    });
  }

  exit(): void {
    if (this.isEmpty()) throw new Error("the parking lot is empty");
    this.occupied--;
    this.notify({
      type: "exit",
      lotName: this.name,
      occupied: this.occupied,
      capacity: this.capacity,
    });
  }

  isFull(): boolean {
    return this.occupied === this.capacity;
  }

  isEmpty(): boolean {
    return this.occupied === 0;
  }
}
