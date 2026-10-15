import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";
import { IDGenerator } from "./id-generator";
import { RideRepository } from "./ride.repository";
import { Rider } from "./rider";

export class BookRideUsecase {
    constructor(
        private readonly calculateRidePrice: CalculateRidePriceUsecase,
        private readonly rideRepository: RideRepository,
        private readonly idGenerator: IDGenerator,
    ) {}

    execute(rider: Rider, from: string, to: string, distance: number): boolean {
        const riderRides = this.rideRepository.findByRiderId(rider.id);
        if (riderRides.some((ride) => ride.status === "WAITING_FOR_DRIVER")) return false;

        const ridePrice = this.calculateRidePrice.execute(from, to, distance);
        if (rider.balance < ridePrice) return false;

        this.rideRepository.save({ id: this.idGenerator.generate(), riderId: rider.id, price: ridePrice, status: "WAITING_FOR_DRIVER" });
        return true;
    }
}