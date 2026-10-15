import express, { Express } from "express";
import { BookRideFromEstimateUsecase } from "../app/book-ride-from-estimate-usecase";
import { BookRideUsecase } from "../app/book-ride.usecase";
import { CalculateRidePriceUsecase } from "../app/calculate-ride-price.usecase";
import { CancelRideUsecase } from "../app/cancel-ride.usecase";
import { Clock } from "../app/clock";
import { EstimateAlreadyUsedError } from "../app/estimate-already-used.error";
import { EstimateExpiredError } from "../app/estimate-expired.error";
import { EstimateNotFoundError } from "../app/estimate-not-found.error";
import { EstimateRideUsecase } from "../app/estimate-ride.usecase";
import { ListRiderRidesUsecase } from "../app/list-rider-rides.usecase";
import { Rider } from "../app/rider";
import { InMemoryEstimateRepository } from "./infra/in-memory-estimate.repository";
import { InMemoryRideRepository } from "./infra/in-memory-ride.repository";
import { SystemClock } from "./infra/system-clock";
import { UuidIDGenerator } from "./infra/uuid-id-generator";

// En JSON, une date arrive sous forme de texte : on la reconvertit en Date.
function toRider(body: { id: string; balance: number; birthDate: string }): Rider {
    return { ...body, birthDate: new Date(body.birthDate) };
}

export function createApp({ clock = new SystemClock() }: { clock?: Clock } = {}): Express {
    const rideRepository = new InMemoryRideRepository();
    const estimateRepository = new InMemoryEstimateRepository();
    const idGenerator = new UuidIDGenerator();
    const calculateRidePrice = new CalculateRidePriceUsecase(clock);

    const bookRide = new BookRideUsecase(calculateRidePrice, rideRepository, idGenerator);
    const cancelRide = new CancelRideUsecase(rideRepository, clock);
    const listRiderRides = new ListRiderRidesUsecase(rideRepository);
    const estimateRide = new EstimateRideUsecase(calculateRidePrice, idGenerator, clock, estimateRepository);
    const bookRideFromEstimate = new BookRideFromEstimateUsecase(estimateRepository, rideRepository, idGenerator, clock);

    const app = express();
    app.use(express.json());

    app.post("/rides", (request, response) => {
        const { rider, from, to, distance, uberX } = request.body;
        if (!from || !to) return response.status(400).json({ message: "from and to are required" });

        const isBooked = bookRide.execute(toRider(rider), from, to, distance, { uberX });
        if (!isBooked) return response.status(422).json({ message: "The ride cannot be booked" });
        return response.status(201).json({ message: "Ride booked" });
    });

    app.post("/rides/:id/cancel", (request, response) => {
        const isCancelled = cancelRide.execute(toRider(request.body.rider), request.params.id);
        if (!isCancelled) return response.status(409).json({ message: "Ride already cancelled" });
        return response.status(200).json({ message: "Ride cancelled" });
    });

    app.get("/riders/:riderId/rides", (request, response) => {
        return response.status(200).json(listRiderRides.execute(request.params.riderId));
    });

    app.post("/rides/estimate", (request, response) => {
        const { rider, from, to, distance, uberX } = request.body;
        if (!from || !to) return response.status(400).json({ message: "from and to are required" });

        const estimate = estimateRide.execute(toRider(rider), from, to, distance, { uberX });
        return response.status(200).json(estimate);
    });

    app.post("/rides/book", (request, response) => {
        try {
            const ride = bookRideFromEstimate.execute(request.body.token);
            return response.status(201).json(ride);
        } catch (error) {
            if (error instanceof EstimateNotFoundError) return response.status(404).json({ message: "Unknown token" });
            if (error instanceof EstimateExpiredError) return response.status(410).json({ message: "Expired token" });
            if (error instanceof EstimateAlreadyUsedError) return response.status(409).json({ message: "Token already used" });
            throw error;
        }
    });

    return app;
}
