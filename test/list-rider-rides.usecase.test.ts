import { ListRiderRidesUsecase } from "@/list-rider-rides.usecase";
import { FakeRideRepository } from "./fake-ride.repository";

describe("List a rider's rides", () => {
    let listRiderRides: ListRiderRidesUsecase;
    let rideRepository: FakeRideRepository;

    beforeEach(() => {
        // Arrange
        rideRepository = new FakeRideRepository();
        listRiderRides = new ListRiderRidesUsecase(rideRepository);
    });

    it("returns no ride when the rider has never booked", () => {
        // Act
        const rides = listRiderRides.execute("rider-1");

        // Assert
        expect(rides).toEqual([]);
    });

    it("returns the rider's rides with their driver", () => {
        // Arrange
        rideRepository.rides = [
            { id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED" },
            {
                id: "ride-2",
                riderId: "rider-1",
                price: 7,
                status: "DRIVER_ON_THE_WAY",
                driver: { id: "driver-1", name: "Paul" },
            },
        ];

        // Act
        const rides = listRiderRides.execute("rider-1");

        // Assert
        expect(rides).toEqual([
            { id: "ride-1", riderId: "rider-1", price: 2, status: "CANCELLED" },
            {
                id: "ride-2",
                riderId: "rider-1",
                price: 7,
                status: "DRIVER_ON_THE_WAY",
                driver: { id: "driver-1", name: "Paul" },
            },
        ]);
    });

    it("does not return the rides of another rider", () => {
        // Arrange
        rideRepository.rides = [{ id: "ride-1", riderId: "rider-2", price: 2, status: "WAITING_FOR_DRIVER" }];

        // Act
        const rides = listRiderRides.execute("rider-1");

        // Assert
        expect(rides).toEqual([]);
    });
});
