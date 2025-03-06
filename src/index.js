




// import fs from 'fs';
// import path from 'path';
// import * as turf from '@turf/turf';
// import parser from 'stream-json';
// import pick from 'stream-json/filters/Pick.js';
// import streamArray from 'stream-json/streamers/StreamArray.js';
// import { fileURLToPath } from 'url';

// /**
//  * @typedef {Object} ProvinceData
//  * @property {string} nameEN - The province name in English.
//  * @property {string} nameTH - The province name in Thai.
//  * @property {string} provinceCode - The province code.
//  */

// const isCoordinateValid = (lat, lng) => {
//     return typeof lat === 'number' &&
//             typeof lng === 'number' &&
//             lat >= -90 &&
//             lat <= 90 &&
//             lng >= -180 &&
//             lng <= 180;
// }


// /**
//  * Find the Thai province based on given latitude and longitude.
//  *
//  * @param {number} lat - The latitude coordinate (-90 to 90).
//  * @param {number} lng - The longitude coordinate (-180 to 180).
//  * @returns {Promise<ProvinceData>} 
//  */
// const findProvince = async (lat, lng) => {

//     try {
//         // Validate input coordinate
//         if (!isCoordinateValid(lat, lng)) return new Error("Invalid input.");
//         const point = turf.point([lng, lat]);

//         // Fetch asset dataset
//         const detailLevel = "detail_level_1"
//         const __filename = fileURLToPath(import.meta.url);
//         const __dirname = path.dirname(__filename);
//         const geojsonPath = path.join(__dirname, `../assets/${detailLevel}/province.json`);

//         const pipeline = fs.createReadStream(geojsonPath)
//             .pipe(parser())
//             .pipe(new pick({ filter: 'features' }))
//             .pipe(new streamArray());

//         for await (const {key, value} of pipeline) {

//             // Check if point ios within a rough rectangle. This is a preliminary, computationally inexpensive check.
//             const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
//             if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) continue;

//             if (turf.booleanPointInPolygon(point, value)) {
//                 const result = {
//                     nameEN: value.properties.ADM1_EN,
//                     nameTH: value.properties.ADM1_TH,
//                     pcode: value.properties.ADM1_PCODE,
//                     admLevel: "ADM1"
//                 };
//                 return {
//                     province: result
//                 };
//             }
//         }

//         // If none are found
//         return {
//             province: null
//         }
//     }
//     catch(err) {
//         return new Error(err);
//     }
// };






// const lat = 13.7563;
// const lng = 100.5018;
// const result = await findProvince();

// console.log(result)



export * from "./functions/findProvince"
export * from "./functions/findAmphoe"