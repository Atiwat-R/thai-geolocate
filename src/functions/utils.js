

/**
 * Checks if the given coordinate is valid.
 * 
 * @param {number} lat - The latitude in degrees (-90 to 90).
 * @param {number} lng - The longitude in degrees (-180 to 180).
 * @returns {boolean} True if both coordinates are valid, otherwise false.
 */
const isCoordinateValid = (lat, lng) => {
    return typeof lat === 'number' &&
            typeof lng === 'number' &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180;
}


/**
 * Configuration for accuracy levels in geographic matching.
 *
 * @typedef {Object} AccuracyConfig
 * @property {number} province - Accuracy level for province matching.
 * @property {number} amphoe - Accuracy level for amphoe (district) matching. May not exists, depending on keysToCheckFor.
 * @property {number} tambon - Accuracy level for tambon (sub-district) matching. May not exists, depending on keysToCheckFor.
 */
/**
 * Checks if the given accuracy configuration contains all required keys with numerical values.
 *
 * @param {AccuracyConfig} accuracyLevel - The accuracy configuration object to validate.
 * @param {string[]} keysToCheckFor - Array of keys to verify in the accuracy configuration.
 * @returns {boolean} True if the accuracy configuration is valid; otherwise, false.
 */
const isAccuracyConfigValid = (accuracyLevel, keysToCheckFor) => {
    return  accuracyLevel && 
            typeof accuracyLevel === 'object' &&
            keysToCheckFor.every(key => typeof accuracyLevel[key] === 'number');
};


export {
    isCoordinateValid,
    isAccuracyConfigValid
}