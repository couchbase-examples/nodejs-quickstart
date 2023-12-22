class Route {
    constructor(airline, airlineid, destinationairport, distance, equipment, id, schedule, day, flight, utc, sourceairport, stops, type) {
      this.airline = airline;
      this.airlineid = airlineid;
      this.destinationairport = destinationairport;
      this.distance = distance;
      this.equipment = equipment;
      this.id = id;
      this.schedule = schedule; // An array of objects
      this.day = day;
      this.flight = flight;
      this.utc = utc;
      this.sourceairport = sourceairport;
      this.stops = stops;
      this.type = type;
    }
  }
  
  module.exports = Route;
  