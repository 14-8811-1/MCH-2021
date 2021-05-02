// there are module for defining validation schemas like ejs, but it seems to be overkill for project like this

/**
 * check if value is one of the allowed values
 * @param value
 * @param allowedValues
 * @returns {boolean}
 */
function isValid(value, allowedValues) {
    return allowedValues.indexOf(value) !== -1;
}

module.exports = {
    isValid
}