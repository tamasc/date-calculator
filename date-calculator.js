class DateCalculator {
    constructor(workingDays, workingHours) {
        this.workingDays = workingDays;
        this.workingHours = workingHours;
        this.workingHoursADay = this.workingHours.end - this.workingHours.start;
        this.workingDaysAWeek = workingDays.length;
        this.weekendDaysAWeek = DateCalculator.daysOfTheWeek.length - this.workingDaysAWeek;
    }

    calculateDueDate(submitDate, turnAroundTime = 0) {
        const submitDateObject = new Date(submitDate);
        this.checkSubmissionValidity(submitDateObject);
        const dueDateObject = this.getDueDateObject(submitDateObject, turnAroundTime);

        return DateCalculator.formatDate(dueDateObject);
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

    getDueDateObject(submitDateObject, turnAroundTime) {
        return new Date(
            this.getDueDateInMiliSeconds(submitDateObject, turnAroundTime)
        );
    }

    getDueDateInMiliSeconds(submitDateObject, turnAroundTime) {
        const turnAroundWorkingDays = Math.trunc(turnAroundTime / this.workingHoursADay);
        const turnAroundRemainingHours = turnAroundTime % this.workingHoursADay;
        const submitDayIndex = this.workingDays.indexOf(this.getDay(submitDateObject.getDay()));
        const weekendsPassed = Math.trunc((submitDayIndex + turnAroundWorkingDays) / this.workingDaysAWeek);
        return submitDateObject.getTime() +
            DateCalculator.convertToFullDayInMiliSeconds(turnAroundWorkingDays + weekendsPassed * this.weekendDaysAWeek) +
            DateCalculator.getHoursInMiliSeconds(turnAroundRemainingHours);
    }

    isNotWorkingDay(numberOfDay) {
        const day = this.getDay(numberOfDay);
        return !this.workingDays.includes(day);
    }

    isTooEarly(submitHour) {
        return this.workingHours.start > submitHour;
    }

    isTooLate(submitHour, submitMinutes) {
        const isTheEndOfTheWorkingDay = this.workingHours.end === submitHour && submitMinutes === 0;
        return !isTheEndOfTheWorkingDay && this.workingHours.end <= submitHour;
    }

    getDay(numberOfDay) {
        return DateCalculator.daysOfTheWeek[numberOfDay];
    }

    static getHoursInMiliSeconds(hours) {
        return hours*60*60*1000;
    }

    static convertToFullDayInMiliSeconds(workingDays) {
        return DateCalculator.getHoursInMiliSeconds(workingDays * 24);
    }

    static formatDate(dateObject) {
        const addTrailingZero = (number) => ('0' + number).slice(-2);

        const year = dateObject.getFullYear();
        const month = addTrailingZero(dateObject.getMonth() + 1);
        const day = addTrailingZero(dateObject.getDate());
        const hours = dateObject.getHours();
        const minutes = addTrailingZero(dateObject.getMinutes());

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
}

DateCalculator.daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = DateCalculator;