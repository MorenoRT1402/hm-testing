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
      expect(rooms[6].isOccupied(dateToCheck)).toBeFalsy();
      expect(rooms[985].isOccupied(dateToCheck)).toBeFalsy();
    });

    test('should return true if the room is occupied on a given date', () => {
      // !rooms with bookings in date
      const dateToCheck = new Date('2024-09-16'); // !date in room bookings
      expect(rooms[46].isOccupied(dateToCheck)).toBeTruthy();
      expect(rooms[450].isOccupied(dateToCheck)).toBeTruthy(); //checkIn in same date
      expect(rooms[241].isOccupied(dateToCheck)).toBeFalsy(); //checkOut in same date
    });
  });

  describe('Method: occupancyPercentage', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    
    test('should throw an error if check out before check in', () => {
        const roomInvalidChecks = rooms[19];
        const errorMessage = 'Check In must be before Check Out';
        expect(() => roomInvalidChecks.occupancyPercentage(startDate, endDate)).toThrow(errorMessage);
        expect(() => rooms[0].occupancyPercentage(startDate, '2023-11-28')).toThrow(errorMessage);
    });

    test('should return 0 if no bookings', () => {
        expect(rooms[6].occupancyPercentage(startDate, endDate)).toBe(0);
    });
    
    test('should calculate occupancy percentage correctly', () => {
      expect(rooms[5].occupancyPercentage(startDate, endDate)).toBeCloseTo(25); 
      expect(rooms[15].occupancyPercentage(startDate, endDate)).toBeCloseTo(100);
      expect(rooms[772].occupancyPercentage(startDate, endDate)).toBeCloseTo(0); //Dates no match
    });
  });

  describe('Static Method: totalOccupancyPercentage', () => {

    test('should calculate total occupancy percentage across all rooms', () => {
      const startDate = new Date('2023-12-29');
      const endDate = new Date('2024-07-15');
      const roomsToCheck = rooms.slice(10, 12);
      expect(Room.totalOccupancyPercentage(roomsToCheck, startDate, endDate)).toBeCloseTo(100);
      expect(Room.totalOccupancyPercentage(rooms.slice(29, 31), startDate, endDate)).toBe(0);
    });
  });

  describe('Static Method: availableRooms', () => {

    test('should return rooms that are available for the entire date range', () => {
        const startDate = new Date('2023-12-29');
        const endDate = new Date('2024-07-15');
        expect(Room.availableRooms(rooms.slice(29, 32), startDate, endDate)).toEqual([rooms[29], rooms[30]]);
        expect(Room.availableRooms(rooms[35], startDate, endDate)).toEqual([]); //Not available
    });
  });

});
