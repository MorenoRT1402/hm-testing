class Booking {

    /**
     * 
     * @param {string} name 
     * @param {string} email 
     * @param {Date} checkIn 
     * @param {Date} checkOut 
     * @param {number} discount 
     * @param {Room} room 
     */
    constructor(name, email, checkIn, checkOut, discount, room){
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }

    /**
     * Returns the fee, including discounts on room 
     * and booking
     * @returns {number}
     */
    getFee(){
        return 0;
    }
}