import { Ride } from "./ride";
import { RideRepository } from "./ride.repository";

export class ListRiderRidesUsecase {
    constructor(private readonly rideRepository: RideRepository) {}

    execute(riderId: string): Ride[] {
        return this.rideRepository.findByRiderId(riderId);
    }
}
