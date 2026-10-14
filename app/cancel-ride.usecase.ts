import { RideRepository } from "./ride.repository";

export class CancelRideUsecase {
    constructor(private readonly rideRepository: RideRepository) {}

    execute(rideId: string): void {
        const ride = this.rideRepository.findById(rideId)!;
        this.rideRepository.update({ ...ride, status: "CANCELLED" });
    }
}