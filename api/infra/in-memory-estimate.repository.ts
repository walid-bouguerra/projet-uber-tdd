import { Estimate } from "../../app/estimate";
import { EstimateRepository } from "../../app/estimate.repository";

export class InMemoryEstimateRepository implements EstimateRepository {
    private estimates: Estimate[] = [];

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
