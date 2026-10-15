import { Estimate } from "@/estimate";
import { EstimateRepository } from "@/estimate.repository";

export class FakeEstimateRepository implements EstimateRepository {
    estimates: Estimate[] = [];

    save(estimate: Estimate): void {
        this.estimates.push(estimate);
    }

    findByToken(token: string): Estimate | undefined {
        return this.estimates.find((estimate) => estimate.token === token);
    }

    update(estimate: Estimate): void {
        this.estimates = this.estimates.map((existing) => (existing.token === estimate.token ? estimate : existing));
    }
}