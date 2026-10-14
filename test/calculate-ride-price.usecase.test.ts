import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";

describe("Calculate ride price", () => {
    let calculateRidePrice: CalculateRidePriceUsecase;

    beforeEach(() => {
        // Arrange
        calculateRidePrice = new CalculateRidePriceUsecase();
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
})