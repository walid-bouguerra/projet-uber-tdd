import { Ride } from "./ride";

export interface RideRepository {
    save(ride: Ride): void;
}