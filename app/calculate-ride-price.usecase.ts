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
        const isMorningRushHour = today.getHours() >= 8 && today.getHours() < 9;
        const isEveningRushHour = today.getHours() >= 18 && today.getHours() < 20;
        if (isChristmasDay) price *= 2;
        if (isMorningRushHour || isEveningRushHour) price *= 1.5;
        if (options.uberX && !riderHasBirthday) price += 5;
        return price;
    }
}