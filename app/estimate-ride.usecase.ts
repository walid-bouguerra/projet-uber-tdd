import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";

export class EstimateRideUsecase {
    constructor(private readonly calculateRidePrice: CalculateRidePriceUsecase) {}

    execute(from: string, to: string, distance: number): { price: number } {
        const price = this.calculateRidePrice.execute(from, to, distance);
        return { price };
    }
}
