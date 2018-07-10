class DateCalculator {
    constructor(workingDays, workingHours) {
        this.workingDays = workingDays;
        this.workingHours = workingHours;
        this.workingHoursADay = this.workingHours.end - this.workingHours.start;
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
        let dueDateObject = new Date(this.getDueDateInMiliSeconds(submitDateObject, turnAroundTime));
        if (this.isTooEarly(dueDateObject.getHours()) || this.isTooLate(dueDateObject.getHours(), dueDateObject.getMinutes())) {
            const exceedingTime =
                (dueDateObject.getHours() < this.workingHours.end ? dueDateObject.getHours() : dueDateObject.getHours() + 24) -
                this.workingHours.end;
            dueDateObject.setHours(this.workingHours.start)
            dueDateObject = new Date(dueDateObject.getTime() +
                DateCalculator.getHoursInMiliSeconds(24) +
                DateCalculator.getHoursInMiliSeconds(exceedingTime));
        }
        if (this.isNotWorkingDay(dueDateObject.getDay())) {
            dueDateObject = new Date(dueDateObject.getTime() + DateCalculator.getHoursInMiliSeconds(48));
        }
        return dueDateObject;
    }

    getDueDateInMiliSeconds(submitDateObject, turnAroundTime) {
        const turnAroundTimeRemainingHours = turnAroundTime % this.workingHoursADay;
        const turnAroundTimeInWorkingDays = Math.trunc(turnAroundTime / this.workingHoursADay);
        return submitDateObject.getTime() +
            DateCalculator.convertToFullDayInMiliSeconds(turnAroundTimeInWorkingDays) +
            DateCalculator.getHoursInMiliSeconds(turnAroundTimeRemainingHours);
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

    static getHoursInMiliSeconds(hours) {
        return hours*60*60*1000;
    }

    static convertToFullDayInMiliSeconds(workingDay) {
        return DateCalculator.getHoursInMiliSeconds(workingDay * 24);
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

const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const workingHours = { start: 9, end: 17 };
const calculator = new DateCalculator(workingDays, workingHours);

calculator.calculateDueDate('2018.07.05 9:00', 36)