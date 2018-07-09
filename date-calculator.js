class DateCalculator {
    constructor(workingDays, workingHours) {
        this.workingDays = workingDays;
        this.workingHours = workingHours;
        this.workingHoursADay = this.workingDays.end - this.workingDays.start;
    }

    calculateDueDate(submitDate, turnAroundTime) {
        const submitDateObject = new Date(submitDate);
        this.checkSubmissionValidity(submitDateObject);
        return '';
    }

    checkSubmissionValidity(submitDateObject) {
        if (isNaN(submitDateObject)) {
            throw new Error('submitDate is invalid');
        }
        const numberOfDay = submitDateObject.getDay();
        const hours = submitDateObject.getHours();
        const minutes = submitDateObject.getMinutes();
        if (
            this.isNotWorkingDay(numberOfDay) ||
            this.isTooEarly(hours) ||
            this.isTooLate(hours, minutes)
        ) {
            throw new Error('submitDate is out of the working hours');
        }
    }

    isNotWorkingDay(numberOfDay) {
        const day = DateCalculator.daysOfTheWeek[numberOfDay];
        return !this.workingDays.includes(day);
    }

    isTooEarly(submitHour) {
        return this.workingHours.start > submitHour;
    }

    isTooLate(submitHour, submitMinutes) {
        const isTheEndOfTheWorkingDay = this.workingHours.end === submitHour && submitMinutes === 0;
        return !isTheEndOfTheWorkingDay && this.workingHours.end <= submitHour;
    }
}

DateCalculator.daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = DateCalculator;