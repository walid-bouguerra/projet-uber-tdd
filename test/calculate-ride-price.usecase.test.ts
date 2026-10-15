import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";
import { StubClock } from "./stub-clock";

describe("Calculate ride price", () => {
    let calculateRidePrice: CalculateRidePriceUsecase;
    let clock: StubClock;
    beforeEach(() => {
        // Arrange
        clock = new StubClock();
        calculateRidePrice = new CalculateRidePriceUsecase(clock);
    });

    it("costs 2 euros from Paris to Paris", () => {
        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0);

        // Assert
        expect(price).toBe(2);
    })

    it("costs 0 euros from outside to Paris", () => {
        // Act
        const price = calculateRidePrice.execute("OUTSIDE", "PARIS", 0);

        // Assert
        expect(price).toBe(0);
    })

    it("costs 10 euros from Paris to outside", () => {
        // Act
        const price = calculateRidePrice.execute("PARIS", "OUTSIDE", 0);

        // Assert
        expect(price).toBe(10);
    })

    it("adds 0.5 euros per kilometer", () => {
        // Act
        const price = calculateRidePrice.execute("PARIS", "OUTSIDE", 2);

        // Assert
        expect(price).toBe(11);
    })

    it("doubles the price on Christmas day", () => {
        // Arrange
        clock.date = new Date("2026-12-25T10:00:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0);

        // Assert
        expect(price).toBe(4);
    });

    it("doubles the total price on Christmas day, kilometers included", () => {
        // Arrange
        clock.date = new Date("2026-12-25T10:00:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 2);

        // Assert
        expect(price).toBe(6);
    });

    it("does not double the price on another day of December", () => {
        // Arrange
        clock.date = new Date("2026-12-24T10:00:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 2);

        // Assert
        expect(price).toBe(3);
    });

    it("does not double the price on the 25th of another month", () => {
        // Arrange
        clock.date = new Date("2026-11-25T10:00:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 2);

        // Assert
        expect(price).toBe(3);
    });

    it("adds 5 euros for an UberX ride", () => {
        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0, { uberX: true });

        // Assert
        expect(price).toBe(7);
    });

    it("offers the UberX fee on the rider's birthday", () => {
        // Arrange
        clock.date = new Date("2026-10-15T10:00:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0, {
            uberX: true,
            riderBirthDate: new Date("2000-10-15T00:00:00"),
        });

        // Assert
        expect(price).toBe(2);
    });

    it("adds 50% during the morning rush hour", () => {
        // Arrange
        clock.date = new Date("2026-06-15T08:30:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0);

        // Assert
        expect(price).toBe(3);
    });

    it("adds 50% during the evening rush hour", () => {
        // Arrange
        clock.date = new Date("2026-06-15T18:30:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0);

        // Assert
        expect(price).toBe(3);
    });

    it("does not add 50% at 9:00", () => {
        // Arrange
        clock.date = new Date("2026-06-15T09:00:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0);

        // Assert
        expect(price).toBe(2);
    });

    it("does not add 50% at 20:00", () => {
        // Arrange
        clock.date = new Date("2026-06-15T20:00:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0);

        // Assert
        expect(price).toBe(2);
    });


    it("combines the rush hour surcharge with Christmas", () => {
        // Arrange
        clock.date = new Date("2026-12-25T08:30:00");

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS", 0);

        // Assert
        expect(price).toBe(6);
    });
})