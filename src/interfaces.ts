export interface Subscriber {
  update(event: ParkingEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(event: ParkingEvent): void;
}

export interface ParkingEvent {
  type: "enter" | "exit";
  lotName: string;
  occupied: number;
  capacity: number;
}
