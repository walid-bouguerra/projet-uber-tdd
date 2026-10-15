import { randomUUID } from "node:crypto";
import { IDGenerator } from "../../app/id-generator";

export class UuidIDGenerator implements IDGenerator {
    generate(): string {
        return randomUUID();
    }
}
