import { errorMessages } from "./app/validation";
import { Booking } from "./classes/booking";
import { Room } from "./classes/room";

describe('Room Class Tests', () => {

    describe('Method: isOccupied', () => {

        test('should return false if the room is not occupied on a given date', () => {
            // !rooms without bookings in date
            const dateToCheck = new Date('2024-01-01');
            const bookingAvailable = new Booking({name: 'available', email: 'available@', checkIn: '2024-10-10', checkOut: '2024-11-11'});
            const availableRoom = new Room({name:'isOccRoom', bookings:[bookingAvailable]});
            expect(availableRoom.isOccupied(dateToCheck)).toBeFalsy();

            const secondBookingAvailable = new Booking({name: 'available2', email: 'available2@mail.com', checkIn: '2023-05-05', checkOut: '2023-10-10'});
            const availableBookingsRoom = new Room({name: 'available with multiples', bookings: [bookingAvailable, secondBookingAvailable]});
            expect(availableBookingsRoom.isOccupied(dateToCheck)).toBeFalsy();

            const roomWtoutBookings = new Room({name: 'room without bookings', bookings: []});
            expect(roomWtoutBookings.isOccupied(dateToCheck)).toBeFalsy();
        });

        test('should return true if the room is occupied on a given date', () => {
            // !rooms with bookings in date
            const dateToCheck = new Date('2024-09-16'); // !date in room bookings
            const occupiedBooking = new Booking({name: 'occupied booking', email: 'dont@enter.please', checkIn: '2024-09-01', checkOut: '2024-10-01'});
            const occupiedRoom = new Room({name: 'occupied room', bookings: [occupiedBooking]});
            expect(occupiedRoom.isOccupied(dateToCheck)).toBeTruthy();

            const notOccupiedBooking = new Booking({name: 'not occupied booking', email: 'ucan@reserve.this', checkIn: '2023-01-01', checkOut: '2023-12-12'});
            const occupiedOneBookingRoom = new Room({name: 'room with only one booking occupied', bookings: [occupiedBooking, notOccupiedBooking]});
            expect(occupiedOneBookingRoom.isOccupied(dateToCheck)).toBeTruthy();
        });
    });

    describe('Method: occupancyPercentage', () => {
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');

        test('should throw an error if end date before start date', () => {
            const room = new Room({name: 'ignored because error 😢', bookings: []});
            const errorMessage = errorMessages.startEndDatesRangeInvalid;
            expect(() => room.occupancyPercentage(startDate, '2023-11-28')).toThrow(errorMessage);
            expect(() => room.occupancyPercentage('2025-01-31', endDate)).toThrow(errorMessage);
        });

        test('should return 0 if no bookings', () => {
            const room = new Room({name: 'room without bookings', bookings: []});
            expect(room.occupancyPercentage(startDate, endDate)).toBe(0);
        });

        test('should calculate occupancy percentage correctly', () => {
            const middleDate = startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2;
            const ceroOccBooking = new Booking({name: 'cero occupancy', email: 'cero@occupancy.booking', checkIn: '2023-01-01', checkOut: '2023-12-12'});
            const ceroOccBookingRoom = new Room({name: 'room with 0 occ', bookings: [ceroOccBooking]});
            expect(ceroOccBookingRoom.occupancyPercentage(startDate, endDate)).toBeCloseTo(0);

            const fullOccBooking = new Booking({name: 'full occ', email: 'full@occ.booking', checkIn: startDate, checkOut: endDate});
            const fullOccBookingRoom = new Room({name: 'full Occ Room', bookings: [fullOccBooking]});
            expect(fullOccBookingRoom.occupancyPercentage(startDate, endDate)).toBeCloseTo(100);

            const totalFullOccRoom = new Room({name: 'full occ thanks to one booking', bookings: [ceroOccBooking, fullOccBooking]});
            expect(totalFullOccRoom.occupancyPercentage(startDate, endDate)).toBeCloseTo(100);

            const midOB = new Booking({name: 'mid occ booking', email: 'mid@occ.booking', checkIn: new Date(middleDate), checkOut: endDate});
            const midOccRoom = new Room({name: 'mid occ room', bookings: [midOB]});
            expect(midOccRoom.occupancyPercentage(startDate, endDate)).toBeCloseTo(50);
        });
    });

    describe('Static Method: totalOccupancyPercentage', () => {

        test('should calculate total occupancy percentage across all rooms', () => {
            const startDate = new Date('2023-12-29');
            const endDate = new Date('2024-07-15');

            const ceroOB = new Booking({name: 'cero occupancy', email: 'cero@occupancy.booking', checkIn: '2023-01-01', checkOut: '2023-09-12'});
            const ceroOBR = new Room({name: 'room with 0 occ', bookings: [ceroOB]});
            expect(Room.totalOccupancyPercentage([ceroOBR], startDate, endDate)).toBe(0);

            const fullOB = new Booking({name: 'full occ', email: 'full@occ.booking', checkIn: startDate, checkOut: endDate});
            const fullOBR = new Room({name: 'full Occ Room', bookings: [fullOB]});
            expect(Room.totalOccupancyPercentage([fullOBR], startDate, endDate)).toBe(100);

            expect(Room.totalOccupancyPercentage([ceroOBR, fullOBR], startDate, endDate)).toBeCloseTo(50);
        });
    });

    describe('Static Method: availableRooms', () => {

        test('should return rooms that are available for the entire date range', () => {
            const startDate = new Date('2023-12-29');
            const endDate = new Date('2024-07-15');

            const availableBooking = new Booking({name: 'available', email: 'av@ail.able', checkIn: '2023-01-01', checkOut: '2023-10-10'});
            const notAvailableBooking = new Booking({name: 'not available', email: 'not@avail.able', checkIn: '2023-01-01', checkOut: '2024-06-10'});

            const availableRoom1 = new Room({name: 'available room 1', bookings: [availableBooking]});
            const availableRoom2 = new Room({name: 'available room 2', bookings: [availableBooking]});
            const notAvailableRoom = new Room({name: 'not available room', bookings: [notAvailableBooking]});

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
            const errorMessage = errorMessages.percentOutOfRange;

            const negativeDiscountBooking = new Booking({name: 'negative discount', email: 'i@pay.you', checkIn: chIn, checkOut: chOut, discount: -10});
            expect(() => negativeDiscountBooking.fee).toThrow(errorMessage);

            const imposibleDiscount = new Booking({name: 'more than 100% discount', email: 'work@like.ong', checkIn: chIn, checkOut: chOut, discount: 120});
            expect(() => imposibleDiscount.fee).toThrow(errorMessage);
        });

        test('should return the fee', () => {
            const rate = 100;
            const chIn = '2023-01-01';
            const chOut = '2024-12-12';

            const ceroDR = new Room({name: 'cero discount', bookings: [], rate: rate, discount: 0});
            const ceroDB = new Booking({name: 'pay total value', email: 'pay@money.now', checkIn: chIn, checkOut: chOut, discount: 0, room: ceroDR.toJson});
            expect(ceroDB.fee).toBe(rate);

            const fullDiscountBooking = new Booking({name: 'all 4 u', email: 'free@booking', checkIn: chIn, checkOut: chOut, discount: 100, room: ceroDR.toJson});
            expect(fullDiscountBooking.fee).toBe(0);

            const midDR = new Room({name: 'small discount', bookings: [], rate: rate, discount: 10});
            const midDB = new Booking({name: 'mid discount booking', email: 'letsTalk@about.business', checkIn: chIn, checkOut: chOut, discount: 10, room: midDR.toJson});
            expect(midDB.fee).toBe(81); // Descuento aplicado
        });
    });

    describe('should return a error if checkOut before checkIn', () => {
        const chIn = '2023-01-01';
        const chOut = '2024-12-12';

        test('should throw error on invalid dates', () => {
            const invalidDatesBooking = new Booking({name: 'invalid dates', email: 'invalid@dates.check', checkIn: chOut, checkOut: chIn});
            expect(() => invalidDatesBooking.datesValidation()).toThrow(errorMessages.checkDatesRangeInvalid);
        });

        test('should validate dates correctly', () => {
            const validDatesBooking = new Booking({name: 'valid dates', email: 'valid@dates.ok', checkIn: chIn, checkOut: chOut});
            expect(() => validDatesBooking.datesValidation()).toBeTruthy();
        });
    });
});
