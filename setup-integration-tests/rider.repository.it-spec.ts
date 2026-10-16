import { knex, type Knex } from "knex";
import knexConfig from "./knexfile";
import { KnexRiderRepository } from "../api/infra/knex-rider.repository";
import { startDockerPostgresql, stopDockerPostgresql, resetDB } from "./docker-postgresql-manager";

describe("Rider repository", () => {
  let sqlConnection: Knex;
  let repository: KnexRiderRepository;

  beforeAll(async () => {
    await startDockerPostgresql();
    sqlConnection = knex(knexConfig.test);
    repository = new KnexRiderRepository(sqlConnection);
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
    await stopDockerPostgresql();
  });

  it("saves and finds a rider by id", async () => {
    const rider = {
      id: "rider-1",
      firstName: "Alice",
      lastName: "Martin",
      email: "alice@example.com",
      balance: 42,
      birthDate: new Date("1990-01-05T00:00:00Z"),
    };

    await repository.save(rider);
    const saved = await repository.findById("rider-1");

    expect(saved).toMatchObject({
      id: "rider-1",
      firstName: "Alice",
      lastName: "Martin",
      email: "alice@example.com",
      balance: 42,
    });
  });

  it("updates an existing rider", async () => {
    await repository.save({
      id: "rider-2",
      firstName: "Bob",
      lastName: "Dupont",
      email: "bob@example.com",
      balance: 10,
      birthDate: new Date("1988-07-15T00:00:00Z"),
    });

    await repository.update({
      id: "rider-2",
      firstName: "Bob",
      lastName: "Dupont",
      email: "bob@example.com",
      balance: 99,
      birthDate: new Date("1988-07-15T00:00:00Z"),
    });

    const rider = await repository.findById("rider-2");

    expect(rider).toMatchObject({
      id: "rider-2",
      balance: 99,
    });
  });
});
