export type Ride = {
    id: string;
    riderId: string;
    price: number;
    status: RideStatus;
    cancellationFee?: number;
    driverId?: string;
    driver?: Driver;
    createdAt?: Date;
}

export type Driver = {
    id: string;
    name: string;
    carType?: string;
    available?: boolean;
    createdAt?: Date;
};

export type RideStatus = "WAITING_FOR_DRIVER" | "CANCELLED" | "DRIVER_ON_THE_WAY";