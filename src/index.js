


// import fs from 'fs';
// import path from 'path';
// import * as turf from '@turf/turf';
// import parser from 'stream-json';
// import pick from 'stream-json/filters/Pick.js';
// import streamArray from 'stream-json/streamers/StreamArray.js';
// import { fileURLToPath } from 'url';
// // import { isCoordinateValid } from './utils';
// // import { findProvince } from './functions/findProvince.js';

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

// const findProvince = async (lat, lng) => {
//     return new Promise((resolve, reject) => {

//         // Validate input coordinate
//         if (!isCoordinateValid(lat, lng)) return reject(new Error("Invalid input."));
//         const point = turf.point([lng, lat]);

//         // Fetch asset dataset
//         const detailLevel = "detail_level_1"
//         const __filename = fileURLToPath(import.meta.url);
//         const __dirname = path.dirname(__filename);
//         const geojsonPath = path.join(__dirname, `../assets/${detailLevel}/province.json`);

//         const thaiProvincePipeline = fs.createReadStream(geojsonPath)
//             .pipe(parser())
//             .pipe(new pick({ filter: 'features' }))
//             .pipe(new streamArray());
//         let found = false;

//         thaiProvincePipeline.on('data', ({ key, value }) => {

//             // Check if point ios within a rough rectangle. This is a preliminary, computationally inexpensive check.
//             const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
//             if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return;

//             if (turf.booleanPointInPolygon(point, value)) {
//                 found = true;
//                 const result = {
//                     nameEN: value.properties.ADM1_EN,
//                     nameTH: value.properties.ADM1_TH,
//                     provinceCode: value.properties.ADM1_PCODE
//                 };
//                 // Stop further processing
//                 thaiProvincePipeline.destroy();
//                 return resolve(result);
//             }
//         });
//         thaiProvincePipeline.on('end', () => {
//             if (!found) {
//                 return resolve(null); // If not found in GeoJson
//             }
//         });
//         thaiProvincePipeline.on('error', (err) => {
//             return reject(err);
//         });
//     });
// };

// /**
//  * Find the Thai amphoe (district) based on given latitude and longitude.
//  *
//  * @param {number} lat - The latitude coordinate (-90 to 90).
//  * @param {number} lng - The longitude coordinate (-180 to 180).
//  * @returns {Promise<ProvinceData>} 
//  */
// const findAmphoe = async (lat, lng) => {

//     // Find province first
//     const provinceData = await findProvince(lat, lng)

//     // console.log("GGGAIVAX")
//     return new Promise((resolve, reject) => {

//         // Validate input coordinate
//         if (!isCoordinateValid(lat, lng)) return reject(new Error("Invalid input."));
//         const point = turf.point([lng, lat]);

//         // Fetch asset dataset
//         const detailLevel = "detail_level_1"
//         const __filename = fileURLToPath(import.meta.url);
//         const __dirname = path.dirname(__filename);
//         const geojsonPath = path.join(__dirname, `../assets/${detailLevel}/amphoe/province_${provinceData.provinceCode}.json`);

//         const thaiProvincePipeline = fs.createReadStream(geojsonPath)
//             .pipe(parser())
//             .pipe(new pick({ filter: 'features' }))
//             .pipe(new streamArray());
//         let found = false;

//         thaiProvincePipeline.on('data', ({ key, value }) => {

//             // Check if point ios within a rough rectangle. This is a preliminary, computationally inexpensive check.
//             const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
//             if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return;

//             if (turf.booleanPointInPolygon(point, value)) {
//                 found = true;
//                 const result = {
//                     nameEN: value.properties.ADM2_EN,
//                     nameTH: value.properties.ADM2_TH,
//                     amphoeCode: value.properties.ADM2_PCODE
//                 };
//                 // Stop further processing
//                 thaiProvincePipeline.destroy();
//                 return resolve(result);
//             }
//         });
//         thaiProvincePipeline.on('end', () => {
//             if (!found) {
//                 return resolve(null); // If not found in GeoJson
//             }
//         });
//         thaiProvincePipeline.on('error', (err) => {
//             return reject(err);
//         });
//     });
// };




// const lat = 13.7563;
// const lng = 100.5018;
// const result = await findAmphoe(lat, lng);

// console.log(result)



export * from "./functions/findProvince"
export * from "./functions/findAmphoe"