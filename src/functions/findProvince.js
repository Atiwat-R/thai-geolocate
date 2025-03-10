import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import parser from 'stream-json';
import pick from 'stream-json/filters/Pick.js';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { fileURLToPath } from 'url';
import { isCoordinateValid } from './utils';


/** Find the Thai province based on given latitude and longitude.
 * 
 * @typedef {Object} GeoData
 * @property {{ nameEN: string, nameTH: string, pcode: string, admLevel: string } | null} province - Province info.
 */
/**
 * @param {number} lat - The latitude coordinate (-90 to 90).
 * @param {number} lng - The longitude coordinate (-180 to 180).
 * @returns {GeoData} 
 */
const findProvince = async (lat, lng) => {

    try {
        // Validate input coordinate
        if (!isCoordinateValid(lat, lng)) throw new Error("Invalid input.");
        const point = turf.point([lng, lat]);

        // Fetch asset dataset
        const detailLevel = "detail_level_1"
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const geojsonPath = path.join(__dirname, `../../assets/${detailLevel}/province.json`);

        const pipeline = fs.createReadStream(geojsonPath)
            .pipe(parser())
            .pipe(new pick({ filter: 'features' }))
            .pipe(new streamArray());

        for await (const {key, value} of pipeline) {

            // Check if point ios within a rough rectangle. This is a preliminary, computationally inexpensive check.
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

