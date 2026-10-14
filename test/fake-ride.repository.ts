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

    findById(id: string): Ride | undefined {
        return this.rides.find((ride) => ride.id === id);
    }

    update(ride: Ride): void {
        this.rides = this.rides.map((existing) => (existing.id === ride.id ? ride : existing));
    }
}