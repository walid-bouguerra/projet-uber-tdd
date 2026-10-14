import { CalculateRidePriceUsecase } from "./calculate-ride-price.usecase";

export type Rider = {
    balance: number;
};

export class BookRideUsecase {

    constructor(private readonly calculateRidePrice: CalculateRidePriceUsecase) {}

    execute(rider: Rider, from: string, to: string, distance: number): boolean {
        const ridePrice = this.calculateRidePrice.execute(from, to, distance);
        return rider.balance >= ridePrice;
    }
}