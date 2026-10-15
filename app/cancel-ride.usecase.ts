import { Ride } from "./ride";
import { RideRepository } from "./ride.repository";

export class CancelRideUsecase {
    constructor(private readonly rideRepository: RideRepository) {}

    execute(rideId: string): boolean {
        const ride = this.rideRepository.findById(rideId)!;
        if (ride.status === "CANCELLED") return false;

        const cancelledRide: Ride = { ...ride, status: "CANCELLED" };
        if (ride.status === "DRIVER_ON_THE_WAY") cancelledRide.cancellationFee = 5;
        this.rideRepository.update(cancelledRide);
        return true;
    }
}