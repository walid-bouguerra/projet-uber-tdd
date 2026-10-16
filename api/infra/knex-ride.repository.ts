import type { Knex } from "knex";
import { Ride } from "../../app/ride";

export class KnexRideRepository {
    constructor(private readonly connection: Knex) {}

    async save(ride: Ride): Promise<void> {
        await this.connection("rides").insert({
            id: ride.id,
            rider_id: ride.riderId,
            driver_id: ride.driverId ?? null,
            price: ride.price,
            status: ride.status,
            cancellation_fee: ride.cancellationFee ?? null,
            created_at: ride.createdAt ?? new Date(),
        });
    }

    async findById(id: string): Promise<Ride | undefined> {
        const row = await this.connection("rides").where({ id }).first();
        if (!row) return undefined;

        return {
            id: row.id,
            riderId: row.rider_id,
            price: Number(row.price),
            status: row.status,
            cancellationFee: row.cancellation_fee !== null && row.cancellation_fee !== undefined ? Number(row.cancellation_fee) : undefined,
            driverId: row.driver_id ?? undefined,
            createdAt: row.created_at ? new Date(row.created_at) : undefined,
        };
    }

    async findByRiderId(riderId: string): Promise<Ride[]> {
        const rows = await this.connection("rides").where({ rider_id: riderId });

        return rows.map((row) => ({
            id: row.id,
            riderId: row.rider_id,
            price: Number(row.price),
            status: row.status,
            cancellationFee: row.cancellation_fee !== null && row.cancellation_fee !== undefined ? Number(row.cancellation_fee) : undefined,
            driverId: row.driver_id ?? undefined,
            createdAt: row.created_at ? new Date(row.created_at) : undefined,
        }));
    }

    async update(ride: Ride): Promise<void> {
        await this.connection("rides").where({ id: ride.id }).update({
            rider_id: ride.riderId,
            driver_id: ride.driverId ?? null,
            price: ride.price,
            status: ride.status,
            cancellation_fee: ride.cancellationFee ?? null,
        });
    }
}
