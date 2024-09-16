const { errorMessages } = require("../app/errors");
const { getFee } = require("../utils/percentages");
const { rateToNumberCents } = require("../utils/stringFormatter");

const createRoomJson = data => {
    return {name: data.name, bookings: data.bookings, rate: rateToNumberCents(data.rate), discount: data.discount};
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
    constructor(name, email, checkIn, checkOut, discount, room){
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
    datesValidation(){
        if (this.checkIn > this.checkOut) throw new Error(errorMessages.dateRangeInvalid);
        return true;
    }

    /**
     * Returns the fee, including discounts on room 
     * and booking.
     * @returns {number}
     */
    get fee(){
        return getFee(this.room.rate, this.room.discount, this.discount);
    }

    /**
     * Checks if a room is occupied on a specific date.
     * Throws an error if dates are invalid.
     * @param {Date} date - The date to check.
     * @returns {boolean} - Returns `true` if occupied, `false` otherwise.
     */
    isOccupied(date) {
        const checkDate = new Date(date);

        if (!this.datesValidation()) return false;

        return checkDate >= this.checkIn && checkDate <= this.checkOut;
    }

    static create = (index, bookingsData) => {
        if(index >= bookingsData.length) return null;
    
        const booking = bookingsData[index];
        return new Booking(booking.name, booking.email, booking.checkIn, booking.checkOut, Number.parseInt(booking.discount), createRoomJson(booking.room[0]));
    }
}

module.exports = Booking;