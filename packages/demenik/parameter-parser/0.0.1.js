class ParameterParser {
  /**
   * Parser for Scriptable parameter string
   * @param {Argument[]} structure A list of arguments. Each argument is checked in order.
   * @param {String?} delimiter The delimiter between arguments. Default: ";"
   * @param {boolean?} allowExtraArgs Whether extra arguments are allowed. Default: false
   * @returns {ArgParser}
   */
  constructor(structure, delimiter, allowExtraArgs) {
    this.structure = structure;
    this.delimiter = delimiter || ";";
    this.allowExtraArgs = allowExtraArgs || false;
  }

  /**
   * Parses the parameter string
   * @param {string} parameterString The parameter string
   * @returns {any[]} The parsed arguments
   **/
  parse(parameterString) {
    const args = parameterString.split(this.delimiter);

    const parsedArgs = [];
    var structureIdx = 0;

    for (var argIdx = 0; argIdx < args.length; ) {
      const argType = this.structure[structureIdx];
      const arg = args[argIdx];

      if (arg === undefined) {
        if (argType.optional) {
          parsedArgs.push(undefined);
          structureIdx++;
          continue;
        } else {
          throw new Error(
            `Argument #${argIdx + 1} not optional, expected ${argType.name}`
          );
        }
      }

      if (argType === undefined) {
        if (this.allowExtraArgs) {
          parsedArgs.push(arg);
          argIdx++;
          continue;
        } else {
          throw new Error(`Extra argument "${arg}" is not allowed`);
        }
      }

      console.log(argType.name + " ; " + arg + " ; " + argType.check(arg));

      if (argType.check(arg)) {
        parsedArgs.push(argType.getValue(arg));
        structureIdx++;
        argIdx++;
      } else {
        if (argType.optional) {
          parsedArgs.push(undefined);
          structureIdx++;
        } else {
          throw new Error(
            `Argument #${argIdx + 1} "${arg}" has wrong type, expected ${
              argType.name
            }`
          );
        }
      }
    }

    return parsedArgs;
  }
}

// Base type
/** @abstract Do not use as an actual argument */
class Argument {
  name = "AbstractArgument";
  /**
   * @param {boolean?} optional Whether the argument is optional
   */
  constructor(optional) {
    this.optional = optional || false;
  }

  check(value) {
    return value !== undefined;
  }

  getValue(value) {
    return value;
  }
}

// Primitive types
class StringArgument extends Argument {
  name = "String";
  /**
   * @param {boolean?} optional Whether the argument is optional
   * @param {string[]?} allowedStrings Allowed strings. Empty list for any string
   * @param {boolean?} caseSensitive Whether the string needs to match case sensitive
   */
  constructor(optional, allowedStrings, caseSensitive) {
    super(optional);
    this.allowedStrings = allowedStrings || [];
    if (!caseSensitive)
      this.allowedStrings = this.allowedStrings.map((s) => s.toLowerCase());
    this.caseSensitive = caseSensitive || false;
  }

  check(value) {
    return (
      super.check(value) &&
      (this.allowedStrings.length === 0 ||
        this.allowedStrings.includes(
          this.caseSensitive ? value : value.toLowerCase()
        ))
    );
  }

  getValue(value) {
    return this.caseSensitive ? value : value.toLowerCase();
  }
}

class NumberArgument extends Argument {
  name = "Number";
  /**
   * @param {boolean?} optional Whether the argument is optional
   * @param {number?} min Minimum value. null for any value
   * @param {number?} max Maximum value. null for any value
   * @param {boolean?} floats Whether the number is allowed to be a float
   */
  constructor(optional, min, max, floats) {
    super(optional);
    this.min = min || null;
    this.max = max || null;
    this.floats = floats || true;
  }

  check(value) {
    return (
      super.check(value) &&
      !isNaN(value) &&
      (this.min === null || value >= this.min) &&
      (this.max === null || value <= this.max) &&
      (this.floats || Number.isInteger(value))
    );
  }

  getValue(value) {
    return this.floats ? parseFloat(value) : parseInt(value);
  }
}

class BooleanArgument extends Argument {
  name = "Boolean";
  /**
   * @param {boolean?} optional Whether the argument is optional
   * @param {{[k: string]: boolean}?} booleanMap Map of strings and their boolean value. Default: {"true": true, "false": false, "yes": true, "no": false, "on": true, "off": false}
   */
  constructor(optional, booleanMap) {
    super(optional);
    this.booleanMap = booleanMap || {
      true: true,
      false: false,
      yes: true,
      no: false,
      on: true,
      off: false,
    };
  }

  check(value) {
    return super.check(value) && this.booleanMap[value] !== undefined;
  }

  getValue(value) {
    return this.booleanMap[value];
  }
}

// Complex types
class WeekDayArgument extends StringArgument {
  name = "Weekday";
  /**
   * @param {boolean?} optional Whether the argument is optional
   * @param {{[k:string]: number}?} weekDaysMap Map of strings and their weekday number. Default: {"monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6}
   */
  constructor(optional, weekDaysMap) {
    const default_weekdays = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6,
    };

    super(optional, _Object.keys(weekDaysMap || default_weekdays), false);
    this.weekDaysMap = weekDaysMap || default_weekdays;
  }

  getValue(value) {
    return this.weekDaysMap[value];
  }
}

// Custom type
class CustomArgument extends Argument {
  name;
  /**
   * @param {boolean?} optional Whether the argument is optional
   * @param {string} name Name of the argument
   * @param {function} checkFunction Function that checks if the input is valid
   * @param {function} getValueFunction Function that converts the string to the desired type
   **/
  constructor(optional, name, checkFunction, getValueFunction) {
    super(optional);
    this.name = name;
    this.checkFunction = checkFunction || super.check;
    this.getValueFunction = getValueFunction || super.getValue;
  }

  check(value) {
    return super.check(value) && this.checkFunction(value);
  }

  getValue(value) {
    return this.getValueFunction(value);
  }
}

// Fix for Scriptable
class _Object {
  static keys(obj) {
    const keys = [];
    for (const key in obj) {
      keys.push(key);
    }
    return keys;
  }
}

module.exports = {
  ParameterParser,
  StringArgument,
  NumberArgument,
  BooleanArgument,
  WeekDayArgument,
  CustomArgument,
}