export class Adresse {
  constructor(
    public readonly adresse: string,
    public readonly ville: string,
    public readonly codePostal: string,
    public readonly pays: string,
  ) {}
}

export class GoogleMapsResult {
  constructor(
    public readonly city: string | null,
    public readonly country: string | null,
    public readonly postalCode: string | null,
  ) {}
}
