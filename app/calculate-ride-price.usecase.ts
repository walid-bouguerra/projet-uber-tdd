import { Clock } from "./clock";
import { isBirthday } from "./is-birthday";

export class CalculateRidePriceUsecase {
    constructor(private readonly clock: Clock){}

    execute(from: string, to: string, distance: number, options: { uberX?: boolean, riderBirthDate?: Date } = {}): number {
        let basePrice = 2;
        if (from === "OUTSIDE") basePrice = 0;
        else if (to === "OUTSIDE") basePrice = 10;
        let price = basePrice + distance * 0.5;
        const today = this.clock.now();
        const isChristmasDay = today.getDate() === 25 && today.getMonth() === 11;
        const riderHasBirthday = isBirthday(options.riderBirthDate, today);
        if (isChristmasDay) price *= 2;
        if (options.uberX && !riderHasBirthday) price += 5;
        return price;
    }
}