import { CancelRideUsecase } from "@/cancel-ride.usecase";
import { FakeRideRepository } from "./fake-ride.repository";
import { StubClock } from "./stub-clock";

describe("Cancel a ride", () => {
    let cancelRide: CancelRideUsecase;
    let rideRepository: FakeRideRepository;
    let clock: StubClock;
    const rider = { id: "rider-1", balance: 10, birthDate: new Date("1990-01-01T00:00:00") };

    beforeEach(() => {
        // Arrange
        rideRepository = new FakeRideRepository();
        clock = new StubClock();
        cancelRide = new CancelRideUsecase(rideRepository, clock);
    });

    it("cancels a ride waiting for a driver", () => {
        // Arrange
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-1", price: 2, status: "WAITING_FOR_DRIVER" }];

        // Act
        const isCancelled = cancelRide.execute(rider, "ride-1");

        // Assert
        expect(rideRepository.rides).toEqual([{ id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED" }]);
        expect(isCancelled).toBe(true);
    });

    it("cannot cancel a ride already cancelled", () => {
        // Arrange
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED" }];

        // Act
        const isCancelled = cancelRide.execute(rider, "ride-1");

        // Assert
        expect(isCancelled).toBe(false);
    });

    it("charges a 5 euros fee when the driver is on the way", () => {
        // Arrange
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-1", price: 2, status: "DRIVER_ON_THE_WAY" }];

        // Act
        cancelRide.execute(rider, "ride-1");

        // Assert
        expect(rideRepository.rides).toEqual([{ id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED", cancellationFee: 5 }]);
    });

    it("cancellation is free on the rider's birthday", () => {
        // Arrange
        const rider = { id: "rider-1", balance: 10, birthDate: new Date("2000-10-15T00:00:00") };
        clock.date = new Date("2026-10-15T10:00:00");
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-1", price: 2, status: "DRIVER_ON_THE_WAY" }];

        // Act
        cancelRide.execute(rider, "ride-1");

        // Assert
        expect(rideRepository.rides).toEqual([{ id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED" }]);
    });
});