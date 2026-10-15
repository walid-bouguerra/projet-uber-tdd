import { Estimate } from "./estimate";

export interface EstimateRepository {
    save(estimate: Estimate): void;
    findByToken(token: string): Estimate | undefined;
}