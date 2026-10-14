describe("Google Maps Address", () => {
    const getCoordonateFromAdress = new GetCoordonateFromAdress();
  it("should return coordinates for a known address", () => {
    // Arrange
    const address = "10 Rue de la Paix, Paris";
    expect(getCoordonateFromAdress.getCoordinates(address)).toEqual([
        {
            lat: 1222333,
            long: 123322344
        }
    ])


  });
});


class GetCoordonateFromAdress{
    getCoordinates(adresse: string){
        return [{lat: 1222333,long: 123322344}]
    }
}

