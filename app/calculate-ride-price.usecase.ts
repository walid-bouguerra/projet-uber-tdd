import { Clock } from "./clock";

export class CalculateRidePriceUsecase {
    constructor(private readonly clock: Clock){}

    execute(from: string, to: string, distance: number): number {
        let basePrice = 2;
        if (from === "OUTSIDE") basePrice = 0;
        else if (to === "OUTSIDE") basePrice = 10;
        const price = basePrice + distance * 0.5;
        const today = this.clock.now();
        const isChristmasDay = today.getDate() === 25 && today.getMonth() === 11;
        return isChristmasDay ? price * 2 : price;
    }
}