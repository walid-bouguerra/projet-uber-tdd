import { Clock } from "./clock";
import { EstimateAlreadyUsedError } from "./estimate-already-used.error";
import { EstimateExpiredError } from "./estimate-expired.error";
import { EstimateNotFoundError } from "./estimate-not-found.error";
import { EstimateRepository } from "./estimate.repository";
import { IDGenerator } from "./id-generator";
import { Ride } from "./ride";
import { RideRepository } from "./ride.repository";

export class BookRideFromEstimateUsecase {
    constructor(
        private readonly estimateRepository: EstimateRepository,
        private readonly rideRepository: RideRepository,
        private readonly idGenerator: IDGenerator,
        private readonly clock: Clock,
    ) {}

    execute(token: string): Ride {
        const estimate = this.estimateRepository.findByToken(token);
        if (!estimate) throw new EstimateNotFoundError();
        if (this.clock.now() > estimate.expiresAt) throw new EstimateExpiredError();
        if (estimate.used) throw new EstimateAlreadyUsedError();

        const ride: Ride = {
            id: this.idGenerator.generate(),
            riderId: estimate.riderId,
            price: estimate.price,
            status: "WAITING_FOR_DRIVER",
        };
        this.rideRepository.save(ride);

        this.estimateRepository.update({ ...estimate, used: true });
        return ride;
    }
}
