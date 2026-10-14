export class CalculateRidePriceUsecase {
    execute(from: string, to: string): number {
        if (from === "OUTSIDE") return 0;
        if (to === "OUTSIDE") return 10;
        return 2;
    }
}