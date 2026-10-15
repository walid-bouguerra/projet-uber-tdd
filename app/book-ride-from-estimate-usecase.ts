import { Clock } from "./clock";
import { EstimateExpiredError } from "./estimate-expired.error";
import { EstimateRepository } from "./estimate.repository";
import { IDGenerator } from "./id-generator";
import { RideRepository } from "./ride.repository";

export class BookRideFromEstimateUsecase {
    constructor(
        private readonly estimateRepository: EstimateRepository,
        private readonly rideRepository: RideRepository,
        private readonly idGenerator: IDGenerator,
        private readonly clock: Clock,
    ) {}

    execute(token: string): void {
        const estimate = this.estimateRepository.findByToken(token)!;
        if (this.clock.now() > estimate.expiresAt) throw new EstimateExpiredError();

        this.rideRepository.save({
            id: this.idGenerator.generate(),
            riderId: estimate.riderId,
            price: estimate.price,
            status: "WAITING_FOR_DRIVER",
        });
    }
}