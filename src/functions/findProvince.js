import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import parser from 'stream-json';
import pick from 'stream-json/filters/Pick.js';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { fileURLToPath } from 'url';
import { isCoordinateValid } from './utils';

/**
 * @typedef {Object} ProvinceData
 * @property {string} nameEN - The province name in English.
 * @property {string} nameTH - The province name in Thai.
 * @property {string} provinceCode - The province code.
 */


/**
 * Find the Thai province based on given latitude and longitude.
 *
 * @param {number} lat - The latitude coordinate (-90 to 90).
 * @param {number} lng - The longitude coordinate (-180 to 180).
 * @returns {Promise<ProvinceData>} 
 */
const findProvince = async (lat, lng) => {
    return new Promise((resolve, reject) => {

        // Validate input coordinate
        if (!isCoordinateValid(lat, lng)) return reject(new Error("Invalid input."));
        const point = turf.point([lng, lat]);

        // Fetch asset dataset
        const detailLevel = "detail_level_1"
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const geojsonPath = path.join(__dirname, `../../assets/${detailLevel}/province.json`);

        const thaiProvincePipeline = fs.createReadStream(geojsonPath)
            .pipe(parser())
            .pipe(new pick({ filter: 'features' }))
            .pipe(new streamArray());
        let found = false;

        thaiProvincePipeline.on('data', ({ key, value }) => {

            // Check if point ios within a rough rectangle. This is a preliminary, computationally inexpensive check.
            const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
            if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return;

            if (turf.booleanPointInPolygon(point, value)) {
                found = true;
                const result = {
                    nameEN: value.properties.ADM1_EN,
                    nameTH: value.properties.ADM1_TH,
                    pcode: value.properties.ADM1_PCODE,
                    admLevel: "ADM1"
                };
                // Stop further processing
                thaiProvincePipeline.destroy();
                return resolve({
                    province: result
                });
            }
        });
        thaiProvincePipeline.on('end', () => {
            if (!found) {
                return resolve(null); // If not found in GeoJson
            }
        });
        thaiProvincePipeline.on('error', (err) => {
            return reject(err);
        });
    });
};


export {
    findProvince
}

