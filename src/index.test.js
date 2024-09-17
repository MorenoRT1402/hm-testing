const Room = require('./classes/room');
const Booking = require('./classes/booking');
const roomsData = require('./data/hm-testing_rooms.json');
const bookingsData = require('./data/hm-testing_bookings.json');
const { errorMessages } = require('./app/errors');

const bookings = bookingsData.map((data) => Booking.create(data.id, bookingsData));
const rooms = roomsData.map(data => Room.create(data, bookingsData));

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
            expect(rooms[450].isOccupied(dateToCheck)).toBeFalsy();
        });
    });

    describe('Method: occupancyPercentage', () => {
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');

        test('should throw an error if end date before start date', () => {
            const room = rooms[0]
            const errorMessage = errorMessages.startEndDatesRangeInvalid;
            expect(() => room.occupancyPercentage(startDate, '2023-11-28')).toThrow(errorMessage);
            expect(() => room.occupancyPercentage('2025-01-31', endDate)).toThrow(errorMessage);
        });

        test('should return 0 if no bookings', () => {
            expect(rooms[6].occupancyPercentage(startDate, endDate)).toBe(0);
        });

        test('should calculate occupancy percentage correctly', () => {
            expect(rooms[5].occupancyPercentage(startDate, endDate)).toBeCloseTo(22.64);
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

describe('Booking Class Tests', () => {

    describe('Method: getFee', () => {
        expect(bookings[0].fee).toBeCloseTo(6784);
        expect(bookings[999].fee).toBeCloseTo(2870);
    })

    describe('should return a error if checkOut before checkIn', () => {
        expect(() => bookings[19].datesValidation()).toThrow(errorMessages.checkDatesRangeInvalid);
        expect(() => bookings[1].datesValidation()).toThrow(errorMessages.checkDatesRangeInvalid);
    })
})
