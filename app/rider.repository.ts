import { Rider } from "./rider";

export interface RiderRepository {
    save(rider: Rider): Promise<void>;
    findById(id: string): Promise<Rider | undefined>;
    update(rider: Rider): Promise<void>;
}
