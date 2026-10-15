import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";
import { Clock } from "./clock";
import { EstimateRepository } from "./estimate.repository";
import { IDGenerator } from "./id-generator";
import { Rider } from "./rider";
import { Estimate } from "./estimate";

export class EstimateRideUsecase {
    constructor(
        private readonly calculateRidePrice: CalculateRidePriceUsecase,
        private readonly idGenerator: IDGenerator,
        private readonly clock: Clock,
        private readonly estimateRepository: EstimateRepository,
    ) {}

    execute(
        rider: Rider,
        from: string,
        to: string,
        distance: number,
        options: { uberX?: boolean } = {},
    ): Estimate {
        const price = this.calculateRidePrice.execute(from, to, distance, { ...options, riderBirthDate: rider.birthDate });
        const expiresAt = new Date(this.clock.now().getTime() + 5 * 60 * 1000);
        const estimate: Estimate = { riderId: rider.id, price, token: this.idGenerator.generate(), expiresAt };
        this.estimateRepository.save(estimate);
        return estimate;
    }
}