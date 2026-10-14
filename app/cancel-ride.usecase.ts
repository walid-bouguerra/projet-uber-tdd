import { RideRepository } from "./ride.repository";

export class CancelRideUsecase {
    constructor(private readonly rideRepository: RideRepository) {}

    execute(rideId: string): boolean {
        const ride = this.rideRepository.findById(rideId)!;
        if (ride.status === "CANCELLED") return false;
        this.rideRepository.update({ ...ride, status: "CANCELLED" });
        return true;
    }
}