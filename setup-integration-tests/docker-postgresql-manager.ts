import { type Knex, knex } from "knex";
import {
	DockerComposeEnvironment,
	type StartedDockerComposeEnvironment,
	Wait,
} from "testcontainers";
import knexConfig from "./knexfile";

const composeFile = "docker-compose-postgresql-test.yaml";

let dockerDBInstance: StartedDockerComposeEnvironment | null = null;

export async function startDockerPostgresql(): Promise<void> {
	dockerDBInstance = await new DockerComposeEnvironment(__dirname, composeFile)
		.withWaitStrategy(
			"postgres-1",
			Wait.forLogMessage("database system is ready to accept connections", 2),
		)
		.up();

	const sqlConnection = knex(knexConfig.test);
	try {
		await sqlConnection.migrate.latest();
	} finally {
		await sqlConnection.destroy();
	}
}

// Tables de test pour vider proprement la base entre chaque test d'intégration.
const tables: string[] = ["rides", "drivers", "riders"];

export async function resetDB(sqlConnection: Knex): Promise<void> {
	for (const table of tables) {
		await sqlConnection.raw("TRUNCATE TABLE ?? CASCADE", [table]);
	}
}

export async function stopDockerPostgresql(): Promise<void> {
	await dockerDBInstance?.down();
	dockerDBInstance = null;
}
