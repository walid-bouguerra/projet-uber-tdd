import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("riders", (table) => {
    table.string("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").notNullable().unique();
    table.decimal("balance", 10, 2).notNullable().defaultTo(0);
    table.date("birth_date").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("drivers", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("car_type").notNullable();
    table.boolean("available").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("rides", (table) => {
    table.string("id").primary();
    table.string("rider_id").notNullable().references("id").inTable("riders").onDelete("CASCADE");
    table.string("driver_id").nullable().references("id").inTable("drivers").onDelete("SET NULL");
    table.decimal("price", 10, 2).notNullable();
    table.string("status").notNullable();
    table.decimal("cancellation_fee", 10, 2).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("rides");
  await knex.schema.dropTableIfExists("drivers");
  await knex.schema.dropTableIfExists("riders");
}

