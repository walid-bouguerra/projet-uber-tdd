interface Coordonate {
    latitude: number;
    longitude: number;
}

describe("Google Maps Address", () => {

    const stubGoogleApi = new StubGoogleApi();
    const scanner = new GetAddressInformation(stubGoogleApi);

    it('retourne les coordonnées géographiques d’une adresse', () => {

        expect(scanner.execute('12 rue Aristide Briand, Paris')).toEqual({
            latitude: 48.8566,
            longitude: 2.3522
        });

    });

    it('retourne la ville correspondant à une adresse', () => {

        expect(scanner.getCity('12 rue Aristide Briand, Paris')).toBe('Paris');

    });

    it('retourne la distance entre deux adresses', () => {

        expect(
            scanner.getDistance(
                '12 rue Aristide Briand, Paris',
                '10 rue de Rivoli, Paris'
            )
        ).toBe(2500);

    });

});

class GetAddressInformation {

    constructor(private readonly googleApi: StubGoogleApi) {}

    execute(adresse: string): Coordonate | null {
        return this.googleApi.getCoordinates(adresse);
    }

    getCity(adresse: string): string | null {
        return this.googleApi.getCity(adresse);
    }

    getDistance(origin: string, destination: string): number | null {
        return this.googleApi.getDistance(origin, destination);
    }
}

class StubGoogleApi {

    getCoordinates(adresse: string): Coordonate | null {
        return {
            latitude: 48.8566,
            longitude: 2.3522
        };
    }

    getCity(adresse: string): string | null {
        return 'Paris';
    }

    getDistance(origin: string, destination: string): number | null {
        return 2500;
    }
}