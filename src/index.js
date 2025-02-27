import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import parser from 'stream-json';
import pick from 'stream-json/filters/Pick.js';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { fileURLToPath } from 'url';





const findProvince = async (lat, lng) => {
    
    // Input coordinate
    const point = turf.point([lng, lat]);
    if (!point) return { "error": "Invalid Coordinate" };

    const detailLevel = "detail_level_2"

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const geojsonPath = path.join(__dirname, `../assets/${detailLevel}/province.json`);

    return new Promise((resolve, reject) => {

        const thaiProvincePipeline = fs.createReadStream(geojsonPath)
            .pipe(parser())
            .pipe(new pick({ filter: 'features' }))
            .pipe(new streamArray());
        let found = false;

        thaiProvincePipeline.on('data', ({ key, value }) => {

            // Check if point ios within a rough rectangle. Preliminary, computationally inexpensive check
            const [minLng, minLat, maxLng, maxLat] = turf.bbox(value);
            if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return;

            if (turf.booleanPointInPolygon(point, value)) {
                found = true;
                const result = {
                    nameEN: value.properties.ADM1_EN,
                    nameTH: value.properties.ADM1_TH,
                    provinceCode: value.properties.ADM1_PCODE
                };
                // Stop further processing
                thaiProvincePipeline.destroy();
                return resolve(result);
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



// export {
//     findProvince
// }



// Test case 1: Coordinates for Chiang Mai
const result1 = await findProvince(18.7999752, 98.98004594);
console.log(result1); // Expected output: "Chiang Mai"

// Test case 2: Coordinates for Phuket
const result2 = await findProvince(7.876533426, 98.3815295);
console.log(result2); // Expected output: "Phuket"

// Test case 3: Coordinates for Khon Kaen
const result3 = await findProvince(16.42004295, 102.8300435);
console.log(result3); // Expected output: "Khon Kaen"

// Test case 4: Coordinates for Nakhon Ratchasima
const result4 = await findProvince(15.58402163, 102.4185957);
console.log(result4); // Expected output: "Nakhon Ratchasima"

// Test case 5: Coordinates for Surat Thani
const result5 = await findProvince(9.1500991, 99.34012732);
console.log(result5); // Expected output: "Surat Thani"

// Test case 6: Coordinates for Udon Thani
const result6 = await findProvince(17.4047632, 102.7893225);
console.log(result6); // Expected output: "Udon Thani"

// Test case 7: Coordinates for Chon Buri
const result7 = await findProvince(13.15902753, 100.9286608);
console.log(result7); // Expected output: "Chon Buri"

// Test case 8: Coordinates for Songkhla
const result8 = await findProvince(6.996432107, 100.4714278);
console.log(result8); // Expected output: "Songkhla"

// Test case 9: Coordinates for Nakhon Sawan
const result9 = await findProvince(15.70003522, 100.0700052);
console.log(result9); // Expected output: "Nakhon Sawan"

// Test case 10: Coordinates for Ubon Ratchathani
const result10 = await findProvince(15.24995933, 104.8300248);
console.log(result10); // Expected output: "Ubon Ratchathani"
