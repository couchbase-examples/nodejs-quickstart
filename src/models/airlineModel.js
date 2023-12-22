class Airline {
    constructor(id, country, icao, name, type, callsign = null, iata = null) {
      this.id = id;
      this.country = country;
      this.icao = icao;
      this.name = name;
      this.type = type;
      this.callsign = callsign;
      this.iata = iata;
    }
  }
  
  module.exports = Airline;
  