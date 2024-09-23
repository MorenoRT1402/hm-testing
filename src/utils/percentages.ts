export const getFee = (price:number, roomDiscount:number, bookingDiscount:number) => {
    const calculateTotal = (price:number, discount:number) => price - (price * (discount / 100));
    const priceAfterFirstDiscount = calculateTotal(price, roomDiscount);

    return calculateTotal(priceAfterFirstDiscount, bookingDiscount);
}