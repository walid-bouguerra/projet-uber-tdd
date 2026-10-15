import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";
import { Clock } from "./clock";
import { IDGenerator } from "./id-generator";

export class EstimateRideUsecase {
    constructor(
        private readonly calculateRidePrice: CalculateRidePriceUsecase,
        private readonly idGenerator: IDGenerator,
        private readonly clock: Clock,
    ) {}

    execute(from: string, to: string, distance: number): { price: number, token: string, expiresAt: Date } {
        const price = this.calculateRidePrice.execute(from, to, distance);
        const expiresAt = new Date(this.clock.now().getTime() + 5 * 60 * 1000);
        return { price, token: this.idGenerator.generate(), expiresAt };
    }
}
