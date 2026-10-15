import { CancelRideUsecase } from "@/cancel-ride.usecase";
import { FakeRideRepository } from "./fake-ride.repository";

describe("Cancel a ride", () => {
    let cancelRide: CancelRideUsecase;
    let rideRepository: FakeRideRepository;

    beforeEach(() => {
        // Arrange
        rideRepository = new FakeRideRepository();
        cancelRide = new CancelRideUsecase(rideRepository);
    });

    it("cancels a ride waiting for a driver", () => {
        // Arrange
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-1", price: 2, status: "WAITING_FOR_DRIVER" }];

        // Act
        const isCancelled = cancelRide.execute("ride-1");

        // Assert
        expect(rideRepository.rides).toEqual([{ id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED" }]);
        expect(isCancelled).toBe(true);
    });

    it("cannot cancel a ride already cancelled", () => {
        // Arrange
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED" }];

        // Act
        const isCancelled = cancelRide.execute("ride-1");

        // Assert
        expect(isCancelled).toBe(false);
    });

    it("charges a 5 euros fee when the driver is on the way", () => {
        // Arrange
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-1", price: 2, status: "DRIVER_ON_THE_WAY" }];

        // Act
        cancelRide.execute("ride-1");

        // Assert
        expect(rideRepository.rides).toEqual([{ id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED", cancellationFee: 5 }]);
    });
});