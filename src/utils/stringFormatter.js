const rateToNumberCents = rate => {
    return Number.parseInt((rate.replace('$', '') * 100).toFixed(0));
}

module.exports = {rateToNumberCents}