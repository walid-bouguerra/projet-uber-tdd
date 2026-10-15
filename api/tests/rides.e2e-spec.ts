import { Express } from "express";
import request from "supertest";
import { StubClock } from "../../test/stub-clock";
import { createApp } from "../app";

describe("Rides API", () => {
    let app: Express;
    let clock: StubClock;
    const rider = { id: "rider-1", balance: 10, birthDate: "1990-01-01T00:00:00" };

    beforeEach(() => {
        // Arrange
        clock = new StubClock();
        clock.date = new Date("2026-06-15T10:00:00");
        app = createApp({ clock });
    });

    async function estimateAnUberXRide() {
        const response = await request(app)
            .post("/rides/estimate")
            .send({ rider, from: "PARIS", to: "PARIS", distance: 0, uberX: true });
        return response.body;
    }

    async function bookAnEstimatedRide() {
        const estimate = await estimateAnUberXRide();
        const response = await request(app).post("/rides/book").send({ token: estimate.token });
        return response.body;
    }

    describe("POST /rides", () => {
        it("returns 201 when the rider has enough funds", async () => {
            // Act
            const response = await request(app)
                .post("/rides")
                .send({ rider, from: "PARIS", to: "PARIS", distance: 0 });

            // Assert
            expect(response.status).toBe(201);
        });

        it("returns 400 without from and to", async () => {
            // Act
            const response = await request(app).post("/rides").send({ rider, distance: 0 });

            // Assert
            expect(response.status).toBe(400);
        });

        it("returns 422 when the rider does not have enough funds", async () => {
            // Act
            const response = await request(app)
                .post("/rides")
                .send({ rider: { ...rider, balance: 1 }, from: "PARIS", to: "PARIS", distance: 0 });

            // Assert
            expect(response.status).toBe(422);
        });

        it("returns 422 while another ride is waiting for a driver", async () => {
            // Arrange
            await request(app).post("/rides").send({ rider, from: "PARIS", to: "PARIS", distance: 0 });

            // Act
            const response = await request(app)
                .post("/rides")
                .send({ rider, from: "PARIS", to: "PARIS", distance: 0 });

            // Assert
            expect(response.status).toBe(422);
        });
    });

    describe("POST /rides/:id/cancel", () => {
        it("returns 200 and cancels the ride", async () => {
            // Arrange
            const ride = await bookAnEstimatedRide();

            // Act
            const response = await request(app).post(`/rides/${ride.id}/cancel`).send({ rider });

            // Assert
            expect(response.status).toBe(200);
        });

        it("returns 409 when the ride is already cancelled", async () => {
            // Arrange
            const ride = await bookAnEstimatedRide();
            await request(app).post(`/rides/${ride.id}/cancel`).send({ rider });

            // Act
            const response = await request(app).post(`/rides/${ride.id}/cancel`).send({ rider });

            // Assert
            expect(response.status).toBe(409);
        });

        it("lets the rider book again after cancelling", async () => {
            // Arrange
            const ride = await bookAnEstimatedRide();
            await request(app).post(`/rides/${ride.id}/cancel`).send({ rider });

            // Act
            const response = await request(app)
                .post("/rides")
                .send({ rider, from: "PARIS", to: "PARIS", distance: 0 });

            // Assert
            expect(response.status).toBe(201);
        });
    });

    describe("GET /riders/:riderId/rides", () => {
        it("returns 200 with an empty history", async () => {
            // Act
            const response = await request(app).get("/riders/rider-1/rides");

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it("returns the rides booked by the rider", async () => {
            // Arrange
            const ride = await bookAnEstimatedRide();

            // Act
            const response = await request(app).get("/riders/rider-1/rides");

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual([ride]);
        });
    });

    describe("POST /rides/estimate", () => {
        it("returns 200 with the price, a token and the expiration date", async () => {
            // Act
            const response = await request(app)
                .post("/rides/estimate")
                .send({ rider, from: "PARIS", to: "PARIS", distance: 0 });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.price).toBe(2);
            expect(response.body.token).toEqual(expect.any(String));
            expect(response.body.expiresAt).toBe(new Date("2026-06-15T10:05:00").toISOString());
        });

        it("returns 400 without from and to", async () => {
            // Act
            const response = await request(app).post("/rides/estimate").send({ rider, distance: 0 });

            // Assert
            expect(response.status).toBe(400);
        });
    });

    describe("POST /rides/book", () => {
        it("returns 201 and creates the ride with a valid token", async () => {
            // Arrange
            const estimate = await estimateAnUberXRide();

            // Act
            const response = await request(app).post("/rides/book").send({ token: estimate.token });

            // Assert
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                id: expect.any(String),
                riderId: "rider-1",
                price: 7,
                status: "WAITING_FOR_DRIVER",
            });
        });

        it("books the ride at the estimated price", async () => {
            // Arrange
            const estimate = await estimateAnUberXRide();

            // Act
            const response = await request(app).post("/rides/book").send({ token: estimate.token });

            // Assert
            expect(response.body.price).toBe(estimate.price);
        });

        it("returns 410 with an expired token", async () => {
            // Arrange
            const estimate = await estimateAnUberXRide();
            clock.date = new Date("2026-06-15T10:06:00");

            // Act
            const response = await request(app).post("/rides/book").send({ token: estimate.token });

            // Assert
            expect(response.status).toBe(410);
        });

        it("returns 404 with an unknown token", async () => {
            // Act
            const response = await request(app).post("/rides/book").send({ token: "unknown-token" });

            // Assert
            expect(response.status).toBe(404);
        });

        it("returns 409 with a token already used", async () => {
            // Arrange
            const estimate = await estimateAnUberXRide();
            await request(app).post("/rides/book").send({ token: estimate.token });

            // Act
            const response = await request(app).post("/rides/book").send({ token: estimate.token });

            // Assert
            expect(response.status).toBe(409);
        });
    });
});
