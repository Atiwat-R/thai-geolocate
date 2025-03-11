import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import parser from 'stream-json';
import pick from 'stream-json/filters/Pick.js';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { fileURLToPath } from 'url';
import { findAmphoe } from './findAmphoe';

/** Find the Thai tambon (sub-district) based on given latitude and longitude.
 * 
 * @typedef {Object} GeoData
 * @property {{ nameEN: string, nameTH: string, pcode: string, admLevel: string }} province - Province info.
 * @property {{ nameEN: string, nameTH: string, pcode: string, admLevel: string }} amphoe - Amphoe info.
 * @property {{ nameEN: string, nameTH: string, pcode: string, admLevel: string } | null} tambon - Tambon info, or null if not found.
 */
/**
 * @param {number} lat - The latitude coordinate (-90 to 90).
 * @param {number} lng - The longitude coordinate (-180 to 180).
 * @returns {GeoData} 
 */
const findTambon = async (lat, lng, detail_level=1) => {
    try {
        // Find amphoe first, to narrow the search
        const amphoeData = await findAmphoe(lat, lng)
        if (!amphoeData?.amphoe) throw new Error("Amphoe not found, abort searching for Tambon")

        // Validate input coordinate
        const point = turf.point([lng, lat]);

        // Fetch asset dataset
        const detailLevel = `detail_level_${detail_level}`
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const geojsonPath = path.join(__dirname, `../../assets/${detailLevel}/tambon/amphoe_${amphoeData.amphoe.pcode}.json`);

        // Check file validity
        if (!fs.existsSync(geojsonPath)) throw new Error("Detail level not found. Please import the dataset.");

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
                    nameEN: value.properties.ADM3_EN,
                    nameTH: value.properties.ADM3_TH,
                    pcode: value.properties.ADM3_PCODE,
                    admLevel: "ADM3"
                };
                return {
                    province: amphoeData.province,
                    amphoe: amphoeData.amphoe,
                    tambon: result
                };
            }
        }

        // If none are found
        return {
            province: amphoeData.province,
            amphoe: amphoeData.amphoe,
            tambon: null
        }
    }
    catch(err) {
        throw err;
    }
};


export {
    findTambon
}

