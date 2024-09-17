const { errorMessages, datesValidation } = require("../app/validation");
const { rateToNumberCents } = require("../utils/stringFormatter");
const Booking = require("./booking");

class Room {

    /**
     * Constructor.
     * @param {string} name - room name.
     * @param {Array<Booking>} bookings - bookings list for room.
     * @param {number} rate - Standard price per night (in cents).
     * @param {number} discount - discount (in percent).
     */
    constructor(name, bookings, rate, discount) {
        this.name = name;
        this.bookings = bookings;
        this.rate = Number.parseInt(rate);
        this.discount = Number.parseInt(discount);
    }

    /**
     * Check if the room is occupied on a certain date.
     * @param {Date} date - Date to check.
     * @returns {boolean} `true` if room occupied, else `false`.
     */
    isOccupied(date) {
        return this.bookings.some(booking => booking.isOccupied(date));
    }

    /**
     * Returns the percentage of days with occupancy within the range of dates provided (inclusive).
     * @param {Date | string} startDate - The start date of the range.
     * @param {Date | string} endDate - The end date of the range.
     * @returns {number} - The occupancy percentage for the room.
     */
    occupancyPercentage(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (this.bookings.length < 1) return 0;
        datesValidation(startDate, endDate);

        let occupiedDays = 0;

        this.bookings.forEach(booking => {
            // Check if the reservation overlaps with the given date range. Max and min for smallest range
            const overlapStart = Math.max(booking.checkIn, startDate);
            const overlapEnd = Math.min(booking.checkOut, endDate);

            // If the dates overlap, we calculate the busy days
            if (overlapStart <= overlapEnd) {
                occupiedDays += Math.ceil(overlapEnd - overlapStart);
            }

        });
        const totalDaysInRange = endDate - startDate;
        const occupancyPercentage = (occupiedDays / totalDaysInRange) * 100;

        return Math.min(100, occupancyPercentage);
    }

    /**
     * Calculates the total occupancy percentage across all rooms for a given date range.
     * @param {Room[]} rooms - Array of room instances.
     * @param {Date | string} start - The start date of the range.
     * @param {Date | string} end - The end date of the range.
     * @returns {number} - The total occupancy percentage across all rooms.
     */
    static totalOccupancyPercentage(rooms, start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (rooms.length === 0) return 0;
        datesValidation(startDate, endDate);

        let totalOccupancyPercentage = 0;

        rooms.forEach(room => {
            const occupancy = room.occupancyPercentage(startDate, endDate);
            totalOccupancyPercentage += occupancy;
        });

        return totalOccupancyPercentage / rooms.length;
    }

    isAvailable(startDate, endDate){
        return this.occupancyPercentage(startDate, endDate) === 0;
    }

    /**
     * Returns an array of rooms that are available for the entire date range.
     * @param {Room[]} rooms - Array of room instances.
     * @param {Date} startDate - The start date of the range.
     * @param {Date} endDate - The end date of the range.
     * @returns {Room[]} - Array of rooms that are available during the entire date range.
     */
    static availableRooms(rooms, startDate, endDate) {
        datesValidation(startDate, endDate);
        const availableRooms = rooms.filter(room => room.isAvailable(startDate, endDate));
        return availableRooms;
    }


    static create = (data, bookingsData) => {
        const rateInCents = rateToNumberCents(data.rate);

        const bookingsToAdd = data.bookings.map(bookingID => Booking.create(bookingID, bookingsData));

        return new Room(
            data.name,
            bookingsToAdd,
            Number.parseInt(rateInCents),
            data.discount
        );
    };

}

module.exports = Room;
