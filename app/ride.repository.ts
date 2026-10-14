import { Ride } from "./ride";

export interface RideRepository {
    save(ride: Ride): void;
    findByRiderId(riderId: string): Ride[];
    findById(id: string): Ride | undefined;
    update(ride: Ride): void;
}