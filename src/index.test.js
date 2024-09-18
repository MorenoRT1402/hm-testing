const Room = require('./classes/room');
const Booking = require('./classes/booking');
const roomsData = require('./data/hm-testing_rooms.json');
const bookingsData = require('./data/hm-testing_bookings.json');
const { errorMessages } = require('./app/validation');

describe('Room Class Tests', () => {

    describe('Method: isOccupied', () => {

        test('should return false if the room is not occupied on a given date', () => {
            // !rooms without bookings in date
            const dateToCheck = new Date('2024-01-01');
            const bookingAvailable = new Booking('available', 'available@', '2024-10-10', '2024-11-11');
            const availableRoom = new Room('isOccRoom', [bookingAvailable])
            expect(availableRoom.isOccupied(dateToCheck)).toBeFalsy();
            const secondBookingAvailable = new Booking('available2', 'available2@mail.com', '2023-05-05', '2023-10-10');
            const availableBookingsRoom = new Room('available with multiples', [bookingAvailable, secondBookingAvailable]);
            expect(availableBookingsRoom.isOccupied(dateToCheck)).toBeFalsy();
            const roomWtoutBookings = new Room('room without bookings', []);
            expect(roomWtoutBookings.isOccupied(dateToCheck)).toBeFalsy();
        });

        test('should return true if the room is occupied on a given date', () => {
            // !rooms with bookings in date
            const dateToCheck = new Date('2024-09-16'); // !date in room bookings
            const occupiedBooking = new Booking('occupied booking', 'dont@enter.please', '2024-09-01', '2024-10-01');
            const occupiedRoom = new Room('occupied room', occupiedBooking);
            expect(occupiedRoom.isOccupied(dateToCheck)).toBeTruthy();
            const notOccupiedBooking = new Booking('not occupied booking', 'ucan@reserve.this', '2023-01-01', '2023-12-12');
            const occupiedOneBookingRoom = new Room('room with only one booking occupied', [occupiedBooking, notOccupiedBooking])
            expect(occupiedOneBookingRoom.isOccupied(dateToCheck)).toBeTruthy();
        });
    });

    describe('Method: occupancyPercentage', () => {
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');

        test('should throw an error if end date before start date', () => {
            const room = new Room('ignored because error 😢', []);
            const errorMessage = errorMessages.startEndDatesRangeInvalid;
            expect(() => room.occupancyPercentage(startDate, '2023-11-28')).toThrow(errorMessage);
            expect(() => room.occupancyPercentage('2025-01-31', endDate)).toThrow(errorMessage);
        });

        test('should return 0 if no bookings', () => {
            const room = new Room();
            expect(room.occupancyPercentage(startDate, endDate)).toBe(0);
        });

        test('should calculate occupancy percentage correctly', () => {
            const ceroOccBooking = new Booking('cero occupancy', 'cero@occupancy.booking', '2023-01-01', '2023-12-12');
            const ceroOccBookingRoom = new Room('room with 0 occ', ceroOccBooking);
            expect(ceroOccBookingRoom.occupancyPercentage(startDate, endDate)).toBeCloseTo(0);
            const fullOccBooking = new Booking('full occ', 'full@occ.booking', startDate, endDate);
            const fullOccBookingRoom = new Room('full Occ Room', fullOccBooking);
            expect(fullOccBookingRoom.occupancyPercentage(startDate, endDate)).toBeCloseTo(100);
            const midOccRoom = new Room('mid occ room', [ceroOccBooking, fullOccBooking]);
            expect(midOccRoom.occupancyPercentage(startDate, endDate)).toBeCloseTo(50);
        });
    });

    describe('Static Method: totalOccupancyPercentage', () => {

        test('should calculate total occupancy percentage across all rooms', () => {
            const startDate = new Date('2023-12-29');
            const endDate = new Date('2024-07-15');
            const ceroOB = new Booking('cero occupancy', 'cero@occupancy.booking', '2023-01-01', '2023-09-12');
            const ceroOBR = new Room('room with 0 occ', [ceroOB, ceroOB]);
            expect(Room.totalOccupancyPercentage([ceroOBR, ceroOBR], startDate, endDate)).toBe(0);
            const fullOB = new Booking('full occ', 'full@occ.booking', startDate, endDate);
            const fullOBR = new Room('full Occ Room', fullOB);
            expect(Room.totalOccupancyPercentage([fullOBR, fullOBR], startDate, endDate)).toBe(100);
            expect(Room.totalOccupancyPercentage([ceroOBR, fullOBR], startDate, endDate)).toBeCloseTo(50);
        });
    });

    describe('Static Method: availableRooms', () => {

        test('should return rooms that are available for the entire date range', () => {
            const startDate = new Date('2023-12-29');
            const endDate = new Date('2024-07-15');
            const availableBooking = new Booking('available', 'av@ail.able', '2023-01-01', '2023-10-10');
            const notAvailableBooking = new Booking('not available', 'not@avail.able', '2023-01-01', '2024-06-10');
            const availableRoom1 = new Room('', availableBooking);
            const availableRoom2 = new Room('', availableBooking);
            const notAvailableRoom = new Room('', notAvailableBooking);
            expect(Room.availableRooms([availableRoom1, availableRoom2], startDate, endDate)).toEqual([availableRoom1, availableRoom2]);
            expect(Room.availableRooms([notAvailableRoom], startDate, endDate)).toEqual([]);
        });
    });

});

describe('Booking Class Tests', () => {

    describe('Method: getFee', () => {
        test('should return error if out of range', () => {
            const chIn = '2023-01-01';
            const chOut = '2024-10-10';
            const errorMessage = 'Out of range. must be beetween 0 & 100';
            const negativeDiscountBooking = new Booking('negative discount', 'i@pay.you', chIn, chOut, -10);
            expect(() => negativeDiscountBooking.fee).toThrow(errorMessage);
            const imposibleDiscount = new Booking('more than 100% discount', 'work@like.ong', chIn, chOut, 120);
            expect(() => imposibleDiscount.fee).toThrow(errorMessage);
        });
        test('should return the fee', () => {
            const rate = 200;
            const chIn = '2023-01-01';
            const chOut = '2024-12-12';
            const ceroDR = new Room('cero discount', [], rate, 0);
            const ceroDB = new Booking('pay total value', 'pay@money.now', chIn, chOut, 0, ceroDR.toJson);
            expect(ceroDB.fee).toBe(rate);
            const fullDiscountBooking = new Booking('all 4 u', 'free@booking', chIn, chOut, 100, ceroDR.toJson);
            expect(fullDiscountBooking.fee).toBe(0);
            const midDR = new Room('small discount', [], rate, 10);
            const midDB = new Booking('mid discount booking', 'letsTalk@about.business', chIn, chOut, 10, midDR.toJson);
            expect(midDB.fee).toBe(81);
        });
    })

    describe('should return a error if checkOut before checkIn', () => {
        const chIn = '2023-01-01';
        const chOut = '2024-12-12';
        const invalidDatesBooking = new Booking('invalid dates', 'invalid@dates.check', chOut, chIn);
        expect(() => invalidDatesBooking.datesValidation()).toThrow(errorMessages.checkDatesRangeInvalid);
        const validDatesBooking = new Booking('valid dates', 'invalid@dates.ok', chIn, chOut);
        expect(() => validDatesBooking.datesValidation()).toBeTruthy();
    })
})
