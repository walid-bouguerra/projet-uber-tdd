import { GoogleMapsResult } from "./google-maps-address.types";

export class StubGoogleMapsClient {
  constructor(private readonly result: GoogleMapsResult | null = null) {}

  geocode(address: string): GoogleMapsResult | null {
    return this.result;
  }

  distanceBetween(from: string, to: string): number {
    return 400;
  }
}
