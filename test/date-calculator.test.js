const assert = require('assert');
const DateCalculator = require('../date-calculator');

describe('calculator', function() {
  const calculator = new DateCalculator(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    { start: 9, end: 17 }
  );

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
    it('throws an error if the time after the working hours', function() {
      assert.throws(calculator.calculateDueDate.bind(calculator, '2018.07.09 17:01', 18));
    });
    it('throws an error if the time before the working hours', function() {
      assert.throws(calculator.calculateDueDate.bind(calculator, '2018.07.09 7:59', 18));
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