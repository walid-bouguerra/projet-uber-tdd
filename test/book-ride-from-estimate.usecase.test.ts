import { BookRideFromEstimateUsecase } from "@/book-ride-from-estimate-usecase";
import { FakeEstimateRepository } from "./fake-estimate.repository";
import { FakeRideRepository } from "./fake-ride.repository";
import { StubIDGenerator } from "./stub-id-generator";

describe("Book a ride from an estimate", () => {
    let bookRideFromEstimate: BookRideFromEstimateUsecase;
    let estimateRepository: FakeEstimateRepository;
    let rideRepository: FakeRideRepository;
    let idGenerator: StubIDGenerator;

    beforeEach(() => {
        // Arrange
        estimateRepository = new FakeEstimateRepository();
        rideRepository = new FakeRideRepository();
        idGenerator = new StubIDGenerator();
        bookRideFromEstimate = new BookRideFromEstimateUsecase(estimateRepository, rideRepository, idGenerator);
    });

    it("books a ride at the estimated price", () => {
        // Arrange
        estimateRepository.estimates = [
            { token: "token-1", riderId: "rider-1", price: 7, expiresAt: new Date("2026-06-15T10:05:00") },
        ];
        idGenerator.id = "ride-1";

        // Act
        bookRideFromEstimate.execute("token-1");

        // Assert
        expect(rideRepository.rides).toEqual([
            { id: "ride-1", riderId: "rider-1", price: 7, status: "WAITING_FOR_DRIVER" },
        ]);
    });
});
