import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import parser from 'stream-json';
import pick from 'stream-json/filters/Pick.js';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { fileURLToPath } from 'url';
import { isCoordinateValid } from './utils';
import { findProvince } from './findProvince';

/**
 * @typedef {Object} ProvinceData
 * @property {string} nameEN - The province name in English.
 * @property {string} nameTH - The province name in Thai.
 * @property {string} provinceCode - The province code.
 */


/**
 * Find the Thai amphoe (district) based on given latitude and longitude.
 *
 * @param {number} lat - The latitude coordinate (-90 to 90).
 * @param {number} lng - The longitude coordinate (-180 to 180).
 * @returns {Promise<ProvinceData>} 
 */
const findAmphoe = async (lat, lng) => {

    // Find province first, to narrow the search
    const provinceData = await findProvince(lat, lng)

    return new Promise((resolve, reject) => {
        // Check if province's found
        if (!provinceData) return resolve(null);
        const point = turf.point([lng, lat]);

        // Fetch asset dataset
        const detailLevel = "detail_level_1"
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const geojsonPath = path.join(__dirname, `../../assets/${detailLevel}/amphoe/province_${provinceData.province.pcode}.json`);

        const pipeline = fs.createReadStream(geojsonPath)
            .pipe(parser())
            .pipe(new pick({ filter: 'features' }))
            .pipe(new streamArray());
        let found = false;

        pipeline.on('data', ({ key, value }) => {

            // Check if point ios within a rough rectangle. This is a preliminary, computationally inexpensive check.
            const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
            if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return;

            if (turf.booleanPointInPolygon(point, value)) {
                found = true;
                const result = {
                    nameEN: value.properties.ADM2_EN,
                    nameTH: value.properties.ADM2_TH,
                    pcode: value.properties.ADM2_PCODE,
                    admLevel: "ADM2"
                };
                // Stop further processing
                pipeline.destroy();
                return resolve({
                    province: provinceData.province,
                    amphoe: result
                });
            }
        });
        pipeline.on('end', () => {
            if (!found) {
                return resolve(null); // If not found in GeoJson
            }
        });
        pipeline.on('error', (err) => {
            return reject(err);
        });
    });
};


export {
    findAmphoe
}

