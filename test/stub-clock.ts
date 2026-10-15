import { Clock } from "@/clock";

export class StubClock implements Clock {
    date = new Date("2026-06-15T10:00:00");

    now(): Date {
        return this.date;
    }
}