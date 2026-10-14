export class CalculateRidePriceUsecase {
    execute(from: string, to: string, distance: number): number {
        let basePrice = 2;
        if (from === "OUTSIDE") basePrice = 0;
        else if (to === "OUTSIDE") basePrice = 10;
        
        return basePrice + distance * 0.5;  
    }
}