import { EstimateRepository } from "./estimate.repository";
import { IDGenerator } from "./id-generator";
import { RideRepository } from "./ride.repository";

export class BookRideFromEstimateUsecase {
    constructor(
        private readonly estimateRepository: EstimateRepository,
        private readonly rideRepository: RideRepository,
        private readonly idGenerator: IDGenerator,
    ) {}

    execute(token: string): void {
        const estimate = this.estimateRepository.findByToken(token)!;

        this.rideRepository.save({
            id: this.idGenerator.generate(),
            riderId: estimate.riderId,
            price: estimate.price,
            status: "WAITING_FOR_DRIVER",
        });
    }
}