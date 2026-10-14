export class CalculateRidePriceUsecase {
    execute(from: string, to: string): number {
        if (from === "OUTSIDE") return 0;
        return 2;
    }
}