import { knex, type Knex } from "knex";
import knexConfig from "./knexfile";
import { KnexRideRepository } from "../api/infra/knex-ride.repository";
import { KnexRiderRepository } from "../api/infra/knex-rider.repository";
import { KnexDriverRepository } from "../api/infra/knex-driver.repository";
import { startDockerPostgresql, stopDockerPostgresql, resetDB } from "./docker-postgresql-manager";

describe("Ride repository", () => {
  let sqlConnection: Knex;
  let repository: KnexRideRepository;
  let riderRepository: KnexRiderRepository;
  let driverRepository: KnexDriverRepository;

  beforeAll(async () => {
    await startDockerPostgresql();
    sqlConnection = knex(knexConfig.test);
    repository = new KnexRideRepository(sqlConnection);
    riderRepository = new KnexRiderRepository(sqlConnection);
    driverRepository = new KnexDriverRepository(sqlConnection);
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    await riderRepository.save({
      id: "rider-1",
      firstName: "Alice",
      lastName: "Martin",
      email: "alice@example.com",
      balance: 100,
      birthDate: new Date("1990-01-05T00:00:00Z"),
    });
    await riderRepository.save({
      id: "rider-2",
      firstName: "Bob",
      lastName: "Dupont",
      email: "bob@example.com",
      balance: 200,
      birthDate: new Date("1988-07-15T00:00:00Z"),
    });
    await driverRepository.save({ id: "driver-1", name: "Paul", carType: "SUV", available: true });
    await driverRepository.save({ id: "driver-2", name: "Luc", carType: "BERLINE", available: true });
  });

  afterAll(async () => {
    await sqlConnection.destroy();
    await stopDockerPostgresql();
  });

  it("saves and finds a ride by id", async () => {
    await repository.save({
      id: "ride-1",
      riderId: "rider-1",
      price: 25,
      status: "WAITING_FOR_DRIVER",
      driverId: "driver-1",
    });

    const ride = await repository.findById("ride-1");

    expect(ride).toMatchObject({
      id: "ride-1",
      riderId: "rider-1",
      price: 25,
      status: "WAITING_FOR_DRIVER",
      driverId: "driver-1",
    });
  });

  it("lists rides by rider", async () => {
    await repository.save({
      id: "ride-1",
      riderId: "rider-1",
      price: 10,
      status: "WAITING_FOR_DRIVER",
    });
    await repository.save({
      id: "ride-2",
      riderId: "rider-2",
      price: 20,
      status: "WAITING_FOR_DRIVER",
    });
    await repository.save({
      id: "ride-3",
      riderId: "rider-1",
      price: 30,
      status: "CANCELLED",
    });

    const rides = await repository.findByRiderId("rider-1");

    expect(rides).toHaveLength(2);
    expect(rides.map((ride) => ride.id)).toEqual(expect.arrayContaining(["ride-1", "ride-3"]));
  });

  it("updates a ride status", async () => {
    await repository.save({
      id: "ride-4",
      riderId: "rider-1",
      price: 15,
      status: "WAITING_FOR_DRIVER",
    });

    await repository.update({
      id: "ride-4",
      riderId: "rider-1",
      price: 15,
      status: "CANCELLED",
      cancellationFee: 5,
    });

    const ride = await repository.findById("ride-4");

    expect(ride).toMatchObject({
      id: "ride-4",
      status: "CANCELLED",
      cancellationFee: 5,
    });
  });
});
