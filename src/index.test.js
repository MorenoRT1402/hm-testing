const Room = require('./classes/room');
const Booking = require('./classes/booking');
const roomsData = require('./data/hm-testing_rooms.json');
const bookingsData = require('./data/hm-testing_bookings.json');

const createRoom = data => {
    const rateInCents = parseFloat(data.rate.replace('$', '').replace('.', '')) * 100;
    return new Room(data.name, data.bookings, rateInCents, data.discount);
}

const rooms = roomsData.map(data => createRoom(data));

const bookings = bookingsData.map(data => {
    const newRoom = createRoom(data.room);
    return new Booking(data.name, data.email, data.checkIn, data.checkOut, data.discount, newRoom);
});

describe('Room Class Tests', () => {
  
  describe('Method: isOccupied', () => {
    
    test('should return false if the room is not occupied on a given date', () => {
      // !rooms without bookings
      const dateToCheck = new Date('2024-01-01');
      expect(rooms[6].isOccupied(dateToCheck)).toBe(false);
      expect(rooms[985].isOccupied(dateToCheck)).toBe(false);
    });

    test('should return true if the room is occupied on a given date', () => {
      // !rooms with bookings in date
      const dateToCheck = new Date('2024-09-16'); // !date in room bookings
      expect(rooms[46].isOccupied(dateToCheck)).toBe(true);
      expect(rooms[450].isOccupied(dateToCheck)).toBe(true); //checkIn in same date
      expect(rooms[241].isOccupied(dateToCheck)).toBe(false); //checkOut in same date
    });
  });

  describe('Method: occupancyPercentage', () => {
    
    test('should calculate occupancy percentage correctly', () => {
      const room = rooms[2];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      // Ajusta el valor esperado según tus datos de prueba
      expect(room.occupancyPercentage(startDate, endDate)).toBeCloseTo(25); 
    });
  });

  // Prueba para el método estático totalOccupancyPercentage
  describe('Static Method: totalOccupancyPercentage', () => {

    test('should calculate total occupancy percentage across all rooms', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      // Ajusta el valor esperado según tus datos de prueba
      expect(Room.totalOccupancyPercentage(rooms, startDate, endDate)).toBeCloseTo(20); 
    });
  });

  // Prueba para el método estático availableRooms
  describe('Static Method: availableRooms', () => {

    test('should return rooms that are available for the entire date range', () => {
      const startDate = new Date('2024-03-01');
      const endDate = new Date('2024-03-31');
      // Ajusta el valor esperado según tus datos de prueba
      expect(Room.availableRooms(rooms, startDate, endDate)).toEqual([rooms[4], rooms[5]]); 
    });
  });

});
