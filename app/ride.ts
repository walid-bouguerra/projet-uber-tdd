export type Ride = {
    riderId: string;
    price: number;
    status: RideStatus;
}

export type RideStatus = "WAITING_FOR_DRIVER" | "CANCELLED";