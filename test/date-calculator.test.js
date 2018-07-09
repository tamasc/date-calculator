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
  });
});