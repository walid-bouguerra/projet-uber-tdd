import { IDGenerator } from "@/id-generator";

export class StubIDGenerator implements IDGenerator {
    id = "";

    generate(): string {
        return this.id;
    }
}