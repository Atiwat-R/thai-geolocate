

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

export {
    isCoordinateValid
}