import { Driver } from "./driver";

export interface DriverRepository {
    save(driver: Driver): Promise<void>;
    findById(id: string): Promise<Driver | undefined>;
    findAvailable(): Promise<Driver[]>;
    update(driver: Driver): Promise<void>;
}
