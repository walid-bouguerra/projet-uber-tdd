import type { Knex } from "knex";
import { Driver } from "../../app/driver";

export class KnexDriverRepository {
    constructor(private readonly connection: Knex) {}

    async save(driver: Driver): Promise<void> {
        await this.connection("drivers").insert({
            id: driver.id,
            name: driver.name,
            car_type: driver.carType ?? "",
            available: driver.available ?? true,
            created_at: driver.createdAt ?? new Date(),
        });
    }

    async findById(id: string): Promise<Driver | undefined> {
        const row = await this.connection("drivers").where({ id }).first();
        if (!row) return undefined;

        return {
            id: row.id,
            name: row.name,
            carType: row.car_type ?? undefined,
            available: Boolean(row.available),
            createdAt: row.created_at ? new Date(row.created_at) : undefined,
        };
    }

    async findAvailable(): Promise<Driver[]> {
        const rows = await this.connection("drivers").where({ available: true });
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            carType: row.car_type ?? undefined,
            available: Boolean(row.available),
            createdAt: row.created_at ? new Date(row.created_at) : undefined,
        }));
    }

    async update(driver: Driver): Promise<void> {
        await this.connection("drivers").where({ id: driver.id }).update({
            name: driver.name,
            car_type: driver.carType ?? "",
            available: driver.available ?? true,
        });
    }
}
