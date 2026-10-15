import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";
import { StubClock } from "./stub-clock";
import { EstimateRideUsecase } from "@/estimate-ride.usecase";
import { StubIDGenerator } from "./stub-id-generator";
import { FakeEstimateRepository } from "./fake-estimate.repository";

describe("Estimate a ride", () => {
    let estimateRide: EstimateRideUsecase;
    let clock: StubClock;
    let idGenerator: StubIDGenerator;
    let estimateRepository: FakeEstimateRepository;
    const rider = { id: "rider-1", balance: 10, birthDate: new Date("1990-01-01T00:00:00") };

    beforeEach(() => {
        // Arrange
        clock = new StubClock();
        idGenerator = new StubIDGenerator();
        estimateRepository = new FakeEstimateRepository();
        estimateRide = new EstimateRideUsecase(new CalculateRidePriceUsecase(clock), idGenerator, clock, estimateRepository);
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
        // Act
        const estimate = estimateRide.execute(rider, "PARIS", "PARIS", 0, { uberX: true });

        // Assert
        expect(estimate.price).toBe(7);
    });

    it("offers the UberX fee in the estimate on the rider's birthday", () => {
        // Arrange
        const rider = { id: "rider-1", balance: 10, birthDate: new Date("1990-06-15T00:00:00") };
        clock.date = new Date("2026-06-15T10:00:00");

        // Act
        const estimate = estimateRide.execute(rider, "PARIS", "PARIS", 0, { uberX: true });

        // Assert
        expect(estimate.price).toBe(2);
    });

    it("includes the rush hour surcharge in the estimate", () => {
        // Arrange
        clock.date = new Date("2026-06-15T08:30:00");

        // Act
        const estimate = estimateRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(estimate.price).toBe(3);
    });

    it("saves the estimate", () => {
        // Arrange
        idGenerator.id = "token-1";
        clock.date = new Date("2026-06-15T10:00:00");

        // Act
        estimateRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(estimateRepository.estimates).toEqual([
            { token: "token-1", riderId: "rider-1", price: 2, expiresAt: new Date("2026-06-15T10:05:00") },
        ]);
    });
});
