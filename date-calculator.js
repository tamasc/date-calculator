class DateCalculator {
    constructor(workingDays, workingHours) {
        this.workingDays = workingDays;
        this.workingHours = workingHours;
    }

    calculateDueDate(submitDate, turnAroundTime) {
        const submitDateObject = new Date(submitDate);
        if (isNaN(submitDateObject)) {
            throw new Error('submitDate is invalid');
        }
    }
}

module.exports = DateCalculator;