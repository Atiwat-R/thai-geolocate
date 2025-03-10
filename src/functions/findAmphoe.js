import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import parser from 'stream-json';
import pick from 'stream-json/filters/Pick.js';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { fileURLToPath } from 'url';
import { findProvince } from './findProvince';

/** Find the Thai amphoe (district) based on given latitude and longitude.
 * 
 * @typedef {Object} GeoData
 * @property {{ nameEN: string, nameTH: string, pcode: string, admLevel: string }} province - Province info.
 * @property {{ nameEN: string, nameTH: string, pcode: string, admLevel: string } | null} amphoe - Amphoe info, or null if not found.
 */
/**
 * @param {number} lat - The latitude coordinate (-90 to 90).
 * @param {number} lng - The longitude coordinate (-180 to 180).
 * @returns {GeoData} 
 */
const findAmphoe = async (lat, lng) => {
    try {
        // Find province first, to narrow the search
        const provinceData = await findProvince(lat, lng)
        if (!provinceData?.province) throw new Error("Province not found, abort searching for Amphoe")

        // Validate input coordinate
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

        for await (const {key, value} of pipeline) {

            // Check if point ios within a rough rectangle. This is a preliminary, computationally inexpensive check.
            const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
            if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) continue;

            if (turf.booleanPointInPolygon(point, value)) {
                const result = {
                    nameEN: value.properties.ADM2_EN,
                    nameTH: value.properties.ADM2_TH,
                    pcode: value.properties.ADM2_PCODE,
                    admLevel: "ADM2"
                };
                return {
                    province: provinceData.province,
                    amphoe: result
                };
            }
        }

        // If none are found
        return {
            province: provinceData?.province,
            amphoe: null
        }
    }
    catch(err) {
        throw err;
    }
};


export {
    findAmphoe
}

