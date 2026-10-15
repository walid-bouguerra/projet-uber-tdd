export type Ride = {
    id: string;
    riderId: string;
    price: number;
    status: RideStatus;
    cancellationFee?: number;
}

export type RideStatus = "WAITING_FOR_DRIVER" | "CANCELLED" | "DRIVER_ON_THE_WAY";