import { GoogleAddressScanner } from "../app/google-maps-address.scanner";
import { StubGoogleMapsClient } from "../app/google-maps-address.stub";
import { GoogleMapsResult } from "../app/google-maps-address.types";

const buildGoogleMapsResult = (
  overrides: Partial<GoogleMapsResult> = {}
): GoogleMapsResult => {
  const base = new GoogleMapsResult("Paris", "France", "75000");

  return new GoogleMapsResult(
    overrides.city ?? base.city,
    overrides.country ?? base.country,
    overrides.postalCode ?? base.postalCode,
  );
};

const buildScanner = (result: GoogleMapsResult | null = null) =>
  new GoogleAddressScanner(new StubGoogleMapsClient(result));

describe("Google Maps Address Scanner", () => {
  it("retourne la ville d'une adresse valide", () => {
    const scanner = buildScanner(
      buildGoogleMapsResult({
        city: "Paris",
        country: "France",
        postalCode: "75000",
      })
    );

    const result = scanner.getAddressInfo("12 rue Aristide Briand, Paris");

    expect(result).toEqual({
      adresse: "12 rue Aristide Briand, Paris",
      ville: "Paris",
      codePostal: "75000",
      pays: "France",
    });
  });

  it("retourne null si l'adresse est vide", () => {
    const scanner = buildScanner();

    expect(scanner.getAddressInfo("")).toBeNull();
  });

  it("retourne null si Google ne trouve aucune ville", () => {
    const scanner = buildScanner(null);

    expect(scanner.getAddressInfo("32 machin machin, bondy")).toBeNull();
  });

  it("retourne la ville, le code postal et le pays d'une adresse complète", () => {
    const scanner = buildScanner(
      buildGoogleMapsResult({
        city: "Lyon",
        country: "France",
        postalCode: "69000",
      })
    );

    const result = scanner.getAddressInfo("10 rue de la République, Lyon");

    expect(result).toEqual({
      adresse: "10 rue de la République, Lyon",
      ville: "Lyon",
      codePostal: "69000",
      pays: "France",
    });
  });

  it("calcule la distance entre deux adresses", () => {
    const scanner = buildScanner();
    const distance = scanner.calculateDistance("Paris", "Lyon");

    expect(distance).toBeGreaterThan(0);
  });
  
});