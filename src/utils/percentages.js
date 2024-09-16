const getFee = (price, roomDiscount, bookingDiscount) => {
    const calculateTotal = (price, discount) => price - (price * (discount / 100));
    const priceAfterFirstDiscount = calculateTotal(price, roomDiscount);

    return Number.parseInt(calculateTotal(priceAfterFirstDiscount, bookingDiscount));
}

module.exports = {getFee}