import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";

describe("Calculate ride price", () => {
    it("costs 2 euros from Paris to Paris", () => {
        // Arrange
        const calculateRidePrice = new CalculateRidePriceUsecase();

        // Act
        const price = calculateRidePrice.execute("PARIS", "PARIS");

        // Assert
        expect(price).toBe(2);
    })
})