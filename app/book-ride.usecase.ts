import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";
import { RideRepository } from "./ride.repository";

export type Rider = {
    id: string;
    balance: number;
};

export class BookRideUsecase {
    constructor(
        private readonly calculateRidePrice: CalculateRidePriceUsecase,
        private readonly rideRepository: RideRepository
    ) {}

    execute(rider: Rider, from: string, to: string, distance: number): boolean {
        const riderRides = this.rideRepository.findByRiderId(rider.id);
        if (riderRides.some((ride) => ride.status === "WAITING_FOR_DRIVER")) return false;

        const ridePrice = this.calculateRidePrice.execute(from, to, distance);
        if (rider.balance < ridePrice) return false;

        this.rideRepository.save({ riderId: rider.id, price: ridePrice, status: "WAITING_FOR_DRIVER" });
        return true;
    }
}