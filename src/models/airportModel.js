class Airport {
    constructor(airportname, city, country, faa, geo, icao, id, tz) {
      this.airportname = airportname;
      this.city = city;
      this.country = country;
      this.faa = faa;
      this.geo = geo; // An object with properties alt, lat, lon
      this.icao = icao;
      this.id = id;
      this.tz = tz;
    }
  }
  
  module.exports = Airport;
  