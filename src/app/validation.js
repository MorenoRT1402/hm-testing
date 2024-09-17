const errorMessages = {
    checkDatesRangeInvalid: 'Check In must be before Check Out',
    startEndDatesRangeInvalid: 'Start date must be before end date'
}

const datesValidation = (startDate, endDate) => {if(startDate > endDate) throw new Error(errorMessages.startEndDatesRangeInvalid);}

module.exports = { errorMessages, datesValidation }