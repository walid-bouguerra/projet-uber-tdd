import type { Knex } from "knex";

const config: { test: Knex.Config } = {
	test: {
		client: "postgresql",
		connection: {
			host: "127.0.0.1",
			port: 5433,
			database: "uber",
			user: "postgres",
			password: "secret",
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
