const rateToNumberCents = (rate:string) => {
    return ((Number.parseInt(rate.replace('$', '')) * 100).toFixed(0));
}

module.exports = {rateToNumberCents}