export const errorMessages = {
    checkDatesRangeInvalid: 'Check In must be before Check Out',
    startEndDatesRangeInvalid: 'Start date must be before end date',
    percentOutOfRange: 'Out of range. must be between 0 & 100',
}
  
export const datesValidation = (startDate: Date, endDate: Date): void => {
    if (startDate > endDate) throw new Error(errorMessages.startEndDatesRangeInvalid);
}
  