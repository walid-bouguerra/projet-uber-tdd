import type { Knex } from "knex";
import { Rider } from "../../app/rider";

export class KnexRiderRepository {
    constructor(private readonly connection: Knex) {}

    async save(rider: Rider): Promise<void> {
        await this.connection("riders").insert({
            id: rider.id,
            first_name: rider.firstName ?? "",
            last_name: rider.lastName ?? "",
            email: rider.email ?? "",
            balance: rider.balance,
            birth_date: rider.birthDate.toISOString().slice(0, 10),
            created_at: rider.createdAt ?? new Date(),
        });
    }

    async findById(id: string): Promise<Rider | undefined> {
        const row = await this.connection("riders").where({ id }).first();
        if (!row) return undefined;

        return {
            id: row.id,
            firstName: row.first_name ?? undefined,
            lastName: row.last_name ?? undefined,
            email: row.email ?? undefined,
            balance: Number(row.balance),
            birthDate: new Date(row.birth_date),
            createdAt: row.created_at ? new Date(row.created_at) : undefined,
        };
    }

    async update(rider: Rider): Promise<void> {
        await this.connection("riders").where({ id: rider.id }).update({
            first_name: rider.firstName ?? "",
            last_name: rider.lastName ?? "",
            email: rider.email ?? "",
            balance: rider.balance,
            birth_date: rider.birthDate.toISOString().slice(0, 10),
        });
    }
}
