import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";
import { Clock } from "./clock";
import { IDGenerator } from "./id-generator";
import { Rider } from "./rider";

export class EstimateRideUsecase {
    constructor(
        private readonly calculateRidePrice: CalculateRidePriceUsecase,
        private readonly idGenerator: IDGenerator,
        private readonly clock: Clock,
    ) {}

    execute(
        rider: Rider,
        from: string,
        to: string,
        distance: number,
        options: { uberX?: boolean } = {},
    ): { price: number; token: string; expiresAt: Date } {
        const price = this.calculateRidePrice.execute(from, to, distance, { ...options, riderBirthDate: rider.birthDate });
        const expiresAt = new Date(this.clock.now().getTime() + 5 * 60 * 1000);
        return { price, token: this.idGenerator.generate(), expiresAt };
    }
}