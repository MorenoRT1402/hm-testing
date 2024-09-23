import { datesValidation } from "../app/validation";
import { Booking } from "./booking";

interface IRoomInput{
    name? : string;
    bookings? : Booking[] | Booking;
    rate? : number;
    discount? : number;
}

export interface RoomJSON {
    name:string;
    bookings : number[];
    rate : number;
    discount : number;
}

export class Room {
    name: string;
    bookings : Booking[];
    rate : number;
    discount : number;

    constructor({ name = 'room', bookings = [], rate = 100, discount = 25 }: IRoomInput) {
        this.name = name;
        this.bookings = Array.isArray(bookings) ? bookings : [bookings];
        this.rate = rate;
        this.discount = discount;
    }

    isOccupied(date : Date) : boolean {
        return this.bookings.some(booking => booking.isOccupied(date));
    }

    occupancyPercentage(start : Date | string, end : Date | string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        datesValidation(startDate, endDate);
        if (this.bookings.length < 1) return 0;

        let occupiedTime = 0;

        this.bookings.forEach(booking => {
            const overlapStart = Math.max(booking.checkIn.getTime(), startDate.getTime());
            const overlapEnd = Math.min(booking.checkOut.getTime(), endDate.getTime());

            occupiedTime += Math.max(overlapEnd - overlapStart, 0);

        });
        const totalTimeInRange = Math.max(endDate.getTime() - startDate.getTime(), 0);
        const occupancyPercentage = (occupiedTime / totalTimeInRange) * 100;

        return Math.min(100, occupancyPercentage);
    }

    static totalOccupancyPercentage(rooms : Room[], start : Date | string, end : Date | string) {
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

    isAvailable(startDate : Date | string, endDate : Date | string){
        return this.occupancyPercentage(startDate, endDate) === 0;
    }

    static availableRooms(rooms : Room[], startDate : Date | string, endDate : Date | string): Room[] {
        datesValidation(new Date(startDate), new Date(endDate));
        const availableRooms = rooms.filter(room => room.isAvailable(startDate, endDate));
        return availableRooms;
    }

    get toJson(): RoomJSON {
        return {
            name: this.name,
            bookings: this.bookings.map(booking => booking.id),
            rate: this.rate,
            discount: this.discount
        };
    }

}