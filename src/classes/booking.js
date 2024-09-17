const { errorMessages } = require("../app/validation");
const { getFee } = require("../utils/percentages");
const { rateToNumberCents } = require("../utils/stringFormatter");

const createRoomJson = data => {
    return { name: data.name, bookings: data.bookings, rate: rateToNumberCents(data.rate), discount: data.discount };
}

class Booking {

    /**
     * 
     * @param {string} name 
     * @param {string} email 
     * @param {Date} checkIn 
     * @param {Date} checkOut 
     * @param {number} discount 
     * @param {Object} room 
     */
    constructor(name, email, checkIn, checkOut, discount, room) {
        this.name = name;
        this.email = email;
        this.checkIn = new Date(checkIn);
        this.checkOut = new Date(checkOut);
        this.discount = Number.parseInt(discount);
        this.room = room;
    }

    /**
     * Validates if checkIn is before checkOut.
     * @returns {boolean}
     */
    datesValidation() {
        if (this.checkIn > this.checkOut) throw new Error(errorMessages.checkDatesRangeInvalid);
        return true;
    }

    /**
     * Returns the fee, including discounts on room 
     * and booking.
     * @returns {number}
     */
    get fee() {
        return getFee(this.room.rate, this.room.discount, this.discount);
    }

    get occupiedDays() {
        this.datesValidation();
        return this.checkOut - this.checkIn;
    }

    /**
     * Checks if a room is occupied on a specific date.
     * Throws an error if dates are invalid.
     * @param {Date} date - The date to check.
     * @returns {boolean} - Returns `true` if occupied, `false` otherwise.
     */
    isOccupied(date) {
        const checkDate = new Date(date);

        // if (!this.datesValidation()) return false;
        this.datesValidation();

        return checkDate >= this.checkIn && checkDate <= this.checkOut;
    }

    static create = (id, bookingsData) => {
        const booking = bookingsData.find(b => b.id === id); // Busca por el id correcto
        if (!booking) {
            throw new Error(`Booking with ID ${id} not found in bookingsData`);
        }

        return new Booking(
            booking.name,
            booking.email,
            new Date(booking.checkIn),  // Asegúrate de convertir checkIn a Date
            new Date(booking.checkOut), // Asegúrate de convertir checkOut a Date
            Number.parseInt(booking.discount),
            createRoomJson(booking.room[0]) // Verifica que el room también esté bien inicializado
        );
    };



    // static getBookingMap(data) {
    //     const bookingsMap = data.reduce((map, booking) => {
    //         const newBooking = new Booking(
    //             booking.name,
    //             booking.email,
    //             new Date(booking.checkIn),
    //             new Date(booking.checkOut),
    //             Number.parseInt(booking.discount),
    //             createRoomJson(booking.room[0])
    //         );

    //         map[booking.id] = newBooking;

    //         return map;
    //     }, {});  

    //     return bookingsMap;
    // }

    // static create = (id, bookingsData) => {
    //     const map = Booking.getBookingMap(bookingsData);
    //     return map[id];
    // }
}

module.exports = Booking;