export type Ride = {
    id: string;
    riderId: string;
    price: number;
    status: RideStatus;
    cancellationFee?: number;
    driver?: Driver;
}

export type Driver = {
    id: string;
    name: string;
};

export type RideStatus = "WAITING_FOR_DRIVER" | "CANCELLED" | "DRIVER_ON_THE_WAY";