import { knex, type Knex } from "knex";
import knexConfig from "./knexfile";
import { KnexDriverRepository } from "../api/infra/knex-driver.repository";
import { startDockerPostgresql, stopDockerPostgresql, resetDB } from "./docker-postgresql-manager";

describe("Driver repository", () => {
  let sqlConnection: Knex;
  let repository: KnexDriverRepository;

  beforeAll(async () => {
    await startDockerPostgresql();
    sqlConnection = knex(knexConfig.test);
    repository = new KnexDriverRepository(sqlConnection);
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
    await stopDockerPostgresql();
  });

  it("saves and finds a driver by id", async () => {
    await repository.save({
      id: "driver-1",
      name: "Paul",
      carType: "SUV",
      available: true,
    });

    const driver = await repository.findById("driver-1");

    expect(driver).toMatchObject({
      id: "driver-1",
      name: "Paul",
      carType: "SUV",
      available: true,
    });
  });

  it("returns only available drivers", async () => {
    await repository.save({ id: "driver-1", name: "Paul", carType: "SUV", available: true });
    await repository.save({ id: "driver-2", name: "Luc", carType: "BERLINE", available: false });

    const drivers = await repository.findAvailable();

    expect(drivers).toHaveLength(1);
    expect(drivers[0]).toMatchObject({ id: "driver-1", available: true });
  });

  it("updates the availability of a driver", async () => {
    await repository.save({ id: "driver-3", name: "Marie", carType: "BERLINE", available: true });

    await repository.update({ id: "driver-3", name: "Marie", carType: "BERLINE", available: false });

    const driver = await repository.findById("driver-3");

    expect(driver).toMatchObject({ id: "driver-3", available: false });
  });
});
