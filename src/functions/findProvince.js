import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import parser from 'stream-json';
import pick from 'stream-json/filters/Pick.js';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { fileURLToPath } from 'url';
import { isCoordinateValid, isAccuracyConfigValid } from './utils';


// Find the Thai province based on given latitude and longitude.

/**
 * Return object
 * 
 * @typedef {Object} GeoData
 * @property {{ nameEN: string, nameTH: string, pcode: string, admLevel: string }} province - Province info.
 */

/**
 * Configuration for accuracy levels in geographic matching.
 *
 * @typedef {Object} AccuracyConfig
 * @property {number} province - Accuracy level for province matching.
 */

/** 
 * Function parameters
 * 
 * @param {number} lat - The latitude coordinate (-90 to 90).
 * @param {number} lng - The longitude coordinate (-180 to 180).
 * @param {AccuracyConfig} [accuracyLevel={province: 1}] - Optional accuracy levels for geographic matching.
 * @returns {GeoData} 
 */
const findProvince = async (lat, lng, accuracyLevel={province: 1}) => {

    try {
        // Validate params input
        if (!isCoordinateValid(lat, lng)) throw new Error("Invalid (lat, lng) input.");
        if (!isAccuracyConfigValid(accuracyLevel, ["province"])) throw new Error("Invalid accuracyLevel input.")
        const point = turf.point([lng, lat]);

        // Fetch asset dataset
        const accuracyLevelDataset = `accuracy_level_${accuracyLevel.province}`
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const geojsonPath = path.join(__dirname, `../../assets/${accuracyLevelDataset}/province.json`);

        // Check file validity
        if (!fs.existsSync(geojsonPath)) throw new Error(`Cannot find dataset: /${accuracyLevelDataset}. Make sure it is imported.`);

        const pipeline = fs.createReadStream(geojsonPath)
            .pipe(parser())
            .pipe(new pick({ filter: 'features' }))
            .pipe(new streamArray());

        for await (const {key, value} of pipeline) {

            // Check if point is within a rough rectangle. This is a preliminary, computationally inexpensive check.
            const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
            if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) continue;

            if (turf.booleanPointInPolygon(point, value)) {
                const result = {
                    nameEN: value.properties.ADM1_EN,
                    nameTH: value.properties.ADM1_TH,
                    pcode: value.properties.ADM1_PCODE,
                    admLevel: "ADM1"
                };
                return {
                    province: result
                };
            }
        }

        // If none are found
        return {
            province: null
        }
    }
    catch(err) {
        throw err;
    }
};


export {
    findProvince
}

