import { Adresse } from "./google-maps-address.types";
import { StubGoogleMapsClient } from "./google-maps-address.stub";

export class GoogleAddressScanner {
    
  constructor(private readonly googleMapsClient: StubGoogleMapsClient) {}

  getAddressInfo(adresse: string): Adresse | null {
    if (!adresse || adresse.trim() === "") {
      return null;
    }

    const result = this.googleMapsClient.geocode(adresse);

    if (!result || !result.city || result.city.trim() === "") {
      return null;
    }

    return new Adresse(
      adresse,
      result.city.trim(),
      result.postalCode ?? "",
      result.country ?? "",
    );
  }

  calculateDistance(from: string, to: string): number {
    if (!from || !to) return 0;

    return this.googleMapsClient.distanceBetween(from, to);
  }
}
