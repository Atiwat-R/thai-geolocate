# thai-geolocate

A Node.js library for geographic matching in Thailand. This library provides functions to determine administrative boundaries—province, amphoe (district), and tambon (sub-district)—based on latitude and longitude inputs.

Node.js library ที่สามารถระบุ จังหวัด อําเภอ และตําบล จากตัวเลขพิกัด (coordinate) ค่าละติจูด, ลองจิจูด (latitude, longtitude)

## Features / ความสามารถ

#### English:
- **findProvince**: Identify the Thai province for given coordinates.
- **findAmphoe**: Identify the district (amphoe) and its corresponding province.
- **findTambon**: Identify the sub-district (tambon) along with its amphoe and province.
- Accepts an optional `accuracyLevel` parameter to configure the precision of geographic matching.
- Validates coordinate inputs to ensure they fall within acceptable ranges.

#### ไทย:
- **findProvince**: ระบุจังหวัดจากค่า ละติจูด, ลองจิจูด
- **findAmphoe**: ระบุอําเภอและจังหวัด จากค่า ละติจูด, ลองจิจูด
- **findTambon**: ระบุตําบล,อําเภอ,และจังหวัดจากค่า ละติจูด, ลองจิจูด
- รองรับพารามิเตอร์ `accuracyLevel` หากต้องการปรับความแม่นยำของการจับคู่ข้อมูลภูมิศาสตร์ใน dataset
- ตรวจสอบความถูกต้องของค่า ละติจูด และ ลองจิจูด เพื่อให้แน่ใจว่าเป็นค่าพิกัดจริง

## Installation / การติดตั้ง

Install the library via npm / ติดตั้งผ่าน npm:

```bash
npm install thai-geolocate
```

Or add it as a dependency in your package.json / หรือใส่เป็น dependency ใน package.json:

```
{
  "dependencies": {
    "thai-geolocate": "^1.0.0"
  }
}
```

## Usage / วิธีใช้งาน

Import the functions in your Node.js project:

```
import { findProvince, findAmphoe, findTambon } from 'thai-geolocate';

const lat = 13.7563;
const lng = 100.5018;

// Example: Find Province / ตัวอย่าง: ค้นหาจังหวัด
const provinceResult = await findProvince(lat, lng);
console.log('Province:', provinceResult.province);

// Example: Find Amphoe / ตัวอย่าง: ค้นหาอําเภอ
const amphoeResult = await findAmphoe(lat, lng);
console.log('Amphoe:', amphoeResult.amphoe);
console.log('Province:', amphoeResult.province);

// Example: Find Tambon / ตัวอย่าง: ค้นหาตําบล
const tambonResult = await findTambon(lat, lng);
console.log('Tambon:', tambonResult.tambon);
console.log('Amphoe:', tambonResult.amphoe);
console.log('Province:', tambonResult.province);
```

## Optional Accuracy Configuration

Each function accepts an optional accuracyLevel parameter. 
By default, each of the properties in accuracyLevel is set to 1, which is the simplest but computes the fastest.

แต่ละฟังก์ชันสามารถรับพารามิเตอร์ accuracyLevel ที่เป็นตัวเลือกได้
โดยค่าเริ่มต้นจะตั้งค่าระดับความแม่นยำไว้ที่ 1 ซึ่งเป็นระดับที่เรืยบง่ายที่สุดแต่ประมวลผลได้เร็วที่สุด

```
import { findProvince, findAmphoe, findTambon } from 'thai-geolocate';

// Example: Find Tambon / ตัวอย่าง: ค้นหาตําบล
const lat = 13.599302;
const lng = 100.369061;
const accuracyConfig = { 
    province: 1, 
    amphoe: 1,
    tambon: 2
}

const tambonResult = await findTambon(lat, lng, accuracyConfig);

console.log('Tambon:', tambonResult.tambon);
console.log('Amphoe:', tambonResult.amphoe);
console.log('Province:', tambonResult.province);
```

> **Note:** The `accuracyLevel` parameter should be an object with numeric values (e.g., `{ province: 1 }`). Passing an incorrect type or out-of-range values will result in an error.

> **หมายเหตุ:** พารามิเตอร์ `accuracyLevel` ต้องเป็น object ที่มีค่าเป็นตัวเลขเท่านั้น (เช่น `{ province: 1 }`) หากส่งข้อมูลประเภทผิดหรือค่าไม่ตรงตามช่วงที่กำหนด ระบบจะแสดงข้อผิดพลาด

## API Reference / วิธีใช้ API

### `findProvince(lat, lng, [accuracyLevel])`
- **Parameters:**
  - `lat` (number): Latitude (-90 to 90).
  - `lng` (number): Longitude (-180 to 180).
  - `accuracyLevel` (object, optional): Example: `{ province: 1 }`
- **Returns:** An object with a `province` property containing details:
  - `nameEN`: English name.
  - `nameTH`: Thai name.
  - `pcode`: Province code.
  - `admLevel`: Administrative level (e.g., "ADM1").

### `findAmphoe(lat, lng, [accuracyLevel])`
- **Parameters:**
  - `lat` (number): Latitude (-90 to 90).
  - `lng` (number): Longitude (-180 to 180).
  - `accuracyLevel` (object, optional): Example: `{ province: 1, amphoe: 1 }`
- **Returns:** An object containing the following, each containing details in the format of `province` above:
  - `province`: Province details.
  - `amphoe`: District details.

### `findTambon(lat, lng, [accuracyLevel])`
- **Parameters:**
  - `lat` (number): Latitude (-90 to 90).
  - `lng` (number): Longitude (-180 to 180).
  - `accuracyLevel` (object, optional): Example: `{ province: 1, amphoe: 1, tambon: 1 }`
- **Returns:** An object containing the following, each containing details in the format of `province` above:
  - `province`: Province details.
  - `amphoe`: District details.
  - `tambon`: Sub-district details.

## Testing / การทดสอบ

This library comes with a comprehensive test suite using Jest. To run the tests:

ขั้นตอนการทดสอบทำได้โดยใช้ Jestซ

1. Install Jest as a dev dependency:
   ```bash
   npm install --save-dev jest
   ```

2. Run the tests:
   ```bash
   npm test
   ```

## Contributing / การมีส่วนร่วม

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License / ใบอนุญาต

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact / ติดต่อ

For any questions or suggestions, please open an issue on [https://github.com/Atiwat-R/thai-geolocate](https://github.com/Atiwat-R/thai-geolocate) or contact [atiwat.rachatawarn@gmail.com](mailto:atiwat.rachatawarn@gmail.com)

## Author

**Atiwat Rachatawarn** - **อธิวัฒน์ รัชตะวรรณ** - [atiwat.rachatawarn@gmail.com](mailto:atiwat.rachatawarn@gmail.com) - [https://github.com/Atiwat-R/thai-geolocate](https://github.com/Atiwat-R/thai-geolocate)