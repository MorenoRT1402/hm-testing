const getFee = (price, roomDiscount, bookingDiscount) => {
    const calculateTotal = (price, discount) => price - (price * (discount / 100));
    const priceAfterFirstDiscount = calculateTotal(price, roomDiscount);
    return parseFloat(calculateTotal(priceAfterFirstDiscount, bookingDiscount).toFixed(2));
}