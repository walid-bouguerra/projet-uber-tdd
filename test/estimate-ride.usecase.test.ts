
import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";
import { StubClock } from "./stub-clock";
import { EstimateRideUsecase } from "@/estimate-ride.usecase";

describe("Estimate a ride", () => {
    let estimateRide: EstimateRideUsecase;
    let clock: StubClock;

    beforeEach(() => {
        // Arrange
        clock = new StubClock();
        estimateRide = new EstimateRideUsecase(new CalculateRidePriceUsecase(clock));
    });

    it("returns the estimated price", () => {
        // Act
        const estimate = estimateRide.execute("PARIS", "PARIS", 0);

        // Assert
        expect(estimate.price).toBe(2);
    });
});
