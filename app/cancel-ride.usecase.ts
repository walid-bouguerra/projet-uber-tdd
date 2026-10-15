import { Clock } from "./clock";
import { Ride } from "./ride";
import { RideRepository } from "./ride.repository";
import { Rider } from "./rider";

export class CancelRideUsecase {
    constructor(
        private readonly rideRepository: RideRepository,
        private readonly clock: Clock
    ) {}

    execute(rider: Rider, rideId: string): boolean {
        const ride = this.rideRepository.findById(rideId)!;
        if (ride.status === "CANCELLED") return false;
        const today = this.clock.now();
        const isBirthday =
            today.getDate() === rider.birthDate.getDate() &&
            today.getMonth() === rider.birthDate.getMonth();

        const cancelledRide: Ride = { ...ride, status: "CANCELLED" };
        if (ride.status === "DRIVER_ON_THE_WAY" && !isBirthday) cancelledRide.cancellationFee = 5;
        this.rideRepository.update(cancelledRide);
        return true;
    }
}