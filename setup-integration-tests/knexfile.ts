import "dotenv/config";
import type { Knex } from "knex";

const config: { test: Knex.Config } = {
	test: {
		client: "postgresql",
		connection: {
			host: process.env.DB_HOST ?? "127.0.0.1",
			port: Number(process.env.DB_PORT ?? 5433),
			database: process.env.DB_NAME ?? "uber",
			user: process.env.DB_USER ?? "postgres",
			password: process.env.DB_PASSWORD ?? "secret",
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
			directory: `${__dirname}/migrations`,
			extension: "ts",
		},
	},
};

export default config;
