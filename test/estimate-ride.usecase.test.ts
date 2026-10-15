
import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";
import { StubClock } from "./stub-clock";
import { EstimateRideUsecase } from "@/estimate-ride.usecase";
import { StubIDGenerator } from "./stub-id-generator";

describe("Estimate a ride", () => {
    let estimateRide: EstimateRideUsecase;
    let clock: StubClock;
    let idGenerator: StubIDGenerator;
    const rider = { id: "rider-1", balance: 10, birthDate: new Date("1990-01-01T00:00:00") };

    beforeEach(() => {
        // Arrange
        clock = new StubClock();
        idGenerator = new StubIDGenerator();
        estimateRide = new EstimateRideUsecase(new CalculateRidePriceUsecase(clock), idGenerator, clock);
    });

    it("returns the estimated price", () => {
        // Act
        const estimate = estimateRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(estimate.price).toBe(2);
    });

    it("generates a token for the estimate", () => {
        // Arrange
        idGenerator.id = "token-1";

        // Act
        const estimate = estimateRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(estimate.token).toBe("token-1");
    });

    it("expires 5 minutes after the estimate", () => {
        // Arrange
        clock.date = new Date("2026-06-15T10:00:00");

        // Act
        const estimate = estimateRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(estimate.expiresAt).toEqual(new Date("2026-06-15T10:05:00"));
    });

    it("includes the UberX fee in the estimate", () => {
        // Arrange
        const rider = { id: "rider-1", balance: 10, birthDate: new Date("1990-01-01T00:00:00") };

        // Act
        const estimate = estimateRide.execute(rider, "PARIS", "PARIS", 0, { uberX: true });

        // Assert
        expect(estimate.price).toBe(7);
    });
});
