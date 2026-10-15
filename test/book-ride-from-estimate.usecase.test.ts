import { BookRideFromEstimateUsecase } from "@/book-ride-from-estimate-usecase";
import { FakeEstimateRepository } from "./fake-estimate.repository";
import { FakeRideRepository } from "./fake-ride.repository";
import { StubIDGenerator } from "./stub-id-generator";
import { StubClock } from "./stub-clock";
import { EstimateExpiredError } from "@/estimate-expired.error";
import { EstimateNotFoundError } from "@/estimate-not-found.error";

describe("Book a ride from an estimate", () => {
    let bookRideFromEstimate: BookRideFromEstimateUsecase;
    let estimateRepository: FakeEstimateRepository;
    let rideRepository: FakeRideRepository;
    let idGenerator: StubIDGenerator;
    let clock: StubClock;

    beforeEach(() => {
        // Arrange
        estimateRepository = new FakeEstimateRepository();
        rideRepository = new FakeRideRepository();
        idGenerator = new StubIDGenerator();
        clock = new StubClock();
        bookRideFromEstimate = new BookRideFromEstimateUsecase(estimateRepository, rideRepository, idGenerator, clock);
    });

    it("books a ride at the estimated price", () => {
        // Arrange
        clock.date = new Date("2026-06-15T10:00:00");
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

    it("cannot book with an expired estimate", () => {
        // Arrange
        estimateRepository.estimates = [
            { token: "token-1", riderId: "rider-1", price: 7, expiresAt: new Date("2026-06-15T10:05:00") },
        ];
        clock.date = new Date("2026-06-15T10:06:00");

        // Act
        const book = () => bookRideFromEstimate.execute("token-1");

        // Assert
        expect(book).toThrow(EstimateExpiredError);
        expect(rideRepository.rides).toEqual([]);
    });
    it("cannot book with an unknown token", () => {
        // Act
        const book = () => bookRideFromEstimate.execute("unknown-token");

        // Assert
        expect(book).toThrow(EstimateNotFoundError);
    });
});
