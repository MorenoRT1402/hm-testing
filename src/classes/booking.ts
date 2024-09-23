import { errorMessages } from "../app/validation";
import { getFee } from "../utils/percentages";
import { RoomJSON } from "./room";

interface IBookingInput{
    name?:string;
    email?:string;
    checkIn?:Date | string;
    checkOut?:Date | string;
    discount?:number;
    room?:RoomJSON;
}

export class Booking {
    static idCount:number = 1;
    readonly id:number;
    name:string;
    email:string;
    checkIn:Date;
    checkOut:Date;
    discount:number;
    room:RoomJSON;

    constructor({name ='new booking', email = 'email@example.com', checkIn = '2023-01-01', checkOut = '2024-12-12', discount = 10, 
        room} : IBookingInput = {}) {
        this.id = Booking.idCount++;
        this.name = name;
        this.email = email;
        this.checkIn = new Date(checkIn);
        this.checkOut = new Date(checkOut);
        this.discount = discount;
        this.room = room ?? { name: '', bookings: [], rate: 0, discount: 0 };
    }

    datesValidation() : boolean {
        if (this.checkIn > this.checkOut) throw new Error(errorMessages.checkDatesRangeInvalid);
        return true;
    }

    get fee(): number {
        if(this.discount < 0 || this.discount > 100) throw new Error(errorMessages.percentOutOfRange);
        return getFee(this.room.rate, this.room.discount, this.discount);
    }

    get occupiedDays() : number{
        this.datesValidation();
        return this.checkOut.getTime() - this.checkIn.getTime();
    }

    isOccupied(date:Date) {
        const checkDate = new Date(date);

        this.datesValidation();

        return checkDate >= this.checkIn && checkDate <= this.checkOut;
    }
}