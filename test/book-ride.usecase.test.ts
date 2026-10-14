import { BookRideUsecase } from "@/book-ride.usecase";
import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";

describe("Book a ride", () => {
    let bookRide: BookRideUsecase;

    beforeEach(() => {
        // Arrange
        bookRide = new BookRideUsecase(new CalculateRidePriceUsecase());
    });

    it("a rider cannot book a ride without enough funds", () => {
        // Arrange
        const rider = {balance: 1};

        // Act
        const isBooked = bookRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(isBooked).toBe(false);
    });

    it("a rider can book a ride with enough funds", () => {
        // Arrange
        const rider = {balance: 2};

        // Act
        const isBooked = bookRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(isBooked).toBe(true);
    });
})