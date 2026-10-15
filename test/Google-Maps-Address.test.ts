interface Adresse {
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
}

interface GoogleMapsResult {
  city: string | null;
  country: string | null;
  postalCode: string | null;
}



describe("Google Maps Address Scanner", () => {
  const buildScanner = (result: GoogleMapsResult | null = null)=> new GoogleAddressScanner(new StubGoogleMapsClient(result))

  it("retourne la ville d'une adresse valide", () => {
    const scanner = buildScanner({
      city: "Paris",
      country: "France",
      postalCode: "75000"
    });

    const result = scanner.getAddressInfo("12 rue Aristide Briand, Paris");

    expect(result).toEqual({
      adresse: "12 rue Aristide Briand, Paris",
      ville: "Paris",
      codePostal: "75000",
      pays: "France"
    });
  });

  it("retourne null si l'adresse est vide", () => {
    const scanner = new GoogleAddressScanner(new StubGoogleMapsClient());

    expect(scanner.getAddressInfo("")).toBeNull();
  });

  it("retourne null si Google ne trouve aucune ville", () => {
    const scanner = new GoogleAddressScanner(new StubGoogleMapsClient(null));

    expect(scanner.getAddressInfo("32 machin machin, bondy")).toBeNull();
  });

  it("retourne la ville, le code postal et le pays d'une adresse complète", () => {
    const scanner = new GoogleAddressScanner(new StubGoogleMapsClient({
      city: "Lyon",
      country: "France",
      postalCode: "69000"
    }));

    const result = scanner.getAddressInfo("10 rue de la République, Lyon");

    expect(result).toEqual({
      adresse: "10 rue de la République, Lyon",
      ville: "Lyon",
      codePostal: "69000",
      pays: "France"
    });
  });

  it("calcule la distance entre deux adresses", () => {
    const scanner = new GoogleAddressScanner(new StubGoogleMapsClient());
    const distance = scanner.calculateDistance("Paris", "Lyon");

    expect(distance).toBeGreaterThan(0);
  });
});

class StubGoogleMapsClient {
  constructor(private readonly result: GoogleMapsResult | null = null) {}

  geocode(address: string): GoogleMapsResult | null {
    return this.result;
  }

  distanceBetween(from: string, to: string): number {
    return 400;
  }
}

class GoogleAddressScanner {
  constructor(private readonly googleMapsClient: StubGoogleMapsClient) {}

  getAddressInfo(adresse: string): Adresse | null {
    if (!adresse || adresse.trim() === "") {
      return null;
    }

    const result = this.googleMapsClient.geocode(adresse);

    if (!result || !result.city || result.city.trim() === "") {
      return null;
    }

    return {
      adresse,
      ville: result.city.trim(),
      codePostal: result.postalCode ?? "",
      pays: result.country ?? ""
    };
  }

  calculateDistance(from: string, to: string): number {
    if (!from || !to) return 0;

    return this.googleMapsClient.distanceBetween(from, to);
  }
}