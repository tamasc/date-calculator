const assert = require('assert');
const DateCalculator = require('../date-calculator');

describe('calculator', function() {
  // test setup
  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const workingHours = { start: 9, end: 17 };
  const calculator = new DateCalculator(workingDays, workingHours);

  // test cases
  it('is an instance of DateCalculator', function() {
    assert.ok(calculator instanceof DateCalculator);
  });

  describe('calculateDueDate', function() {
    it('returns a string', function() {
      assert.equal(typeof calculator.calculateDueDate('1999.05.25 15:55', 18), 'string');
    });
    it('throws an error if the date is invalid', function() {
      assert.throws(calculator.calculateDueDate.bind(calculator, 'asdasdasd', 18));
    });
    it('throws an error if the day is not a working day', function() {
      assert.throws(calculator.calculateDueDate.bind(calculator, '2018.07.08 15:55', 18));
    });
    it('throws an error if the time is after the working hours', function() {
      assert.throws(calculator.calculateDueDate.bind(calculator, '2018.07.09 17:01', 18));
    });
    it('throws an error if the time before the working hours', function() {
      assert.throws(calculator.calculateDueDate.bind(calculator, '2018.07.09 7:59', 18));
    });
    it('not throws error at the beginning of the working hours', function() {
      assert.equal(typeof calculator.calculateDueDate('2018.07.09 9:00', 18), 'string');
    });
    it('returns a correct date when turnAroundTime is 1 working day', function() {
      assert.equal(calculator.calculateDueDate('2018.07.09 9:00', 8),  '2018.07.10 9:00');
    });
    it('returns a correct date when dueDate would fall into weekend', function() {
      assert.equal(calculator.calculateDueDate('2018.07.06 9:00', 16),  '2018.07.10 9:00');
    });
    it('returns a correct date when dueDate would fall into non-working hours', function() {
      assert.equal(calculator.calculateDueDate('2018.07.05 9:00', 9),  '2018.07.06 10:00');
    });
    it('returns a correct date when dueDate would fall into non-working hours and weekend', function() {
      assert.equal(calculator.calculateDueDate('2018.07.05 9:00', 20),  '2018.07.09 13:00');
    });
  });

  describe('isNotWorkingDay', function() {
    it('returns a boolean', function() {
      assert.equal(typeof calculator.isNotWorkingDay(5), 'boolean');
    });
    it('Friday is a working day', function() {
      assert.equal(calculator.isNotWorkingDay(5), false);
    });
    it('Sunday is not a working day', function() {
      assert.ok(calculator.isNotWorkingDay(0));
    });
  });

  describe('isTooLate', function() {
    it('returns a boolean', function() {
      assert.equal(typeof calculator.isTooLate(17, 0), 'boolean');
    });
    it('17:00 is not too late', function() {
      assert.equal(calculator.isTooLate(17, 0), false);
    });
    it('17:01 is too late', function() {
      assert.ok(calculator.isTooLate(17, 1));
    });
  });
});