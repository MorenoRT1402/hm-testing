const errorMessages = {
    checkDatesRangeInvalid: 'Check In must be before Check Out',
    startEndDatesRangeInvalid: 'Start date must be before end date',
    percentOutOfRange: 'Out of range. must be beetween 0 & 100'
}

const datesValidation = (startDate, endDate) => {if(startDate > endDate) throw new Error(errorMessages.startEndDatesRangeInvalid);}

module.exports = { errorMessages, datesValidation }