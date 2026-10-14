import { BookRideUsecase } from "@/book-ride.usecase";
import { CalculateRidePriceUsecase } from "@/calculate-ride-price.usecase";
import { FakeRideRepository } from "./fake-ride.repository";

describe("Book a ride", () => {
    let bookRide: BookRideUsecase;
    let rideRepository: FakeRideRepository;

    beforeEach(() => {
        // Arrange
        rideRepository = new FakeRideRepository();
        bookRide = new BookRideUsecase(new CalculateRidePriceUsecase(), rideRepository);
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

    it("saves the ride when the rider has enough funds", () => {
        // Arrange
        const rider = { balance: 2 };

        // Act
        bookRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(rideRepository.rides).toEqual([{ price: 2 }]);
    });

    it("does not save the ride without enough funds", () => {
        // Arrange
        const rider = { balance: 1 };

        // Act
        bookRide.execute(rider, "PARIS", "PARIS", 0);

        // Assert
        expect(rideRepository.rides).toEqual([]);
    });
})