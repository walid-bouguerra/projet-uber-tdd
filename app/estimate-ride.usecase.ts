import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";
import { IDGenerator } from "./id-generator";

export class EstimateRideUsecase {
    constructor(
        private readonly calculateRidePrice: CalculateRidePriceUsecase,
        private readonly idGenerator: IDGenerator
    ) {}

    execute(from: string, to: string, distance: number): { price: number, token: string } {
        const price = this.calculateRidePrice.execute(from, to, distance);
        return { price, token: this.idGenerator.generate() };
    }
}
