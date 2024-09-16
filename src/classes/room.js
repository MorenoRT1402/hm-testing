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
     * @param {Date} startDate - The start date of the range.
     * @param {Date} endDate - The end date of the range.
     * @returns {number} - The occupancy percentage for the room.
     */
    occupancyPercentage(startDate, endDate) {
        return 0;
    }

    /**
     * Calculates the total occupancy percentage across all rooms for a given date range.
     * @param {Room[]} rooms - Array of room instances.
     * @param {Date} startDate - The start date of the range.
     * @param {Date} endDate - The end date of the range.
     * @returns {number} - The total occupancy percentage across all rooms.
     */
    static totalOccupancyPercentage(rooms, startDate, endDate) {
        return 0
    }

    /**
     * Returns an array of rooms that are available for the entire date range.
     * @param {Room[]} rooms - Array of room instances.
     * @param {Date} startDate - The start date of the range.
     * @param {Date} endDate - The end date of the range.
     * @returns {Room[]} - Array of rooms that are available during the entire date range.
     */
    static availableRooms(rooms, startDate, endDate) {
        return 0
    }

    static create = (data, bookings) => {
        const rateInCents = rateToNumberCents(data.rate);
        const bookingsToAdd = data.bookings.map(bookingID => Booking.create(bookingID, bookings));
        return new Room(data.name, bookingsToAdd, Number.parseInt(rateInCents), data.discount);
    }
}

module.exports = Room;
