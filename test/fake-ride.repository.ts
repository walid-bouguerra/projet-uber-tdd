import { Ride } from "@/ride";
import { RideRepository } from "@/ride.repository";

export class FakeRideRepository implements RideRepository {
    rides : Ride[] = [];

    save(ride: Ride): void {
        this.rides.push(ride);
    }

    findByRiderId(riderId: string): Ride[] {
        return this.rides.filter((ride) => ride.riderId === riderId);
    }
}