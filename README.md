# thai-geolocate

A Node.js library for geographic matching in Thailand. This library provides functions to determine administrative boundaries—province, amphoe (district), and tambon (sub-district)—based on latitude and longitude inputs.

## Features

- **findProvince**: Identify the Thai province for given coordinates.
- **findAmphoe**: Identify the district (amphoe) and its corresponding province.
- **findTambon**: Identify the sub-district (tambon) along with its amphoe and province.
- Accepts an optional `accuracyLevel` parameter to configure the precision of geographic matching.
- Validates coordinate inputs to ensure they fall within acceptable ranges.

## Installation

Install the library via npm:

```bash
npm install thai-geolocate
```

Or add it as a dependency in your package.json:

```
{
  "dependencies": {
    "thai-geolocate": "^1.0.0"
  }
}
```

## Usage

Import the functions in your Node.js project:

```
import { findProvince, findAmphoe, findTambon } from 'thai-geolocate';

// Example: Find Province
const lat = 13.7563;
const lng = 100.5018;
const provinceResult = await findProvince(lat, lng);
console.log('Province:', provinceResult.province);

// Example: Find Amphoe
const amphoeResult = await findAmphoe(lat, lng);
console.log('Amphoe:', amphoeResult.amphoe);
console.log('Province:', amphoeResult.province);

// Example: Find Tambon
const tambonResult = await findTambon(lat, lng);
console.log('Tambon:', tambonResult.tambon);
console.log('Amphoe:', tambonResult.amphoe);
console.log('Province:', tambonResult.province);
```

## Optional Accuracy Configuration

Each function accepts an optional accuracyLevel parameter. 
By default, the accuracy level is set to 1, which is teh simpliest but computes the fastest.

```
import { findProvince, findAmphoe, findTambon } from 'thai-geolocate';

// Example: Find Tambon
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


## API Reference

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

## Testing

This library comes with a comprehensive test suite using Jest. To run the tests:

1. Install Jest as a dev dependency:
   ```bash
   npm install --save-dev jest
   ```

2. Run the tests:
   ```bash
   npm test
   ```

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue on [https://github.com/Atiwat-R/thai-geolocate](https://github.com/Atiwat-R/thai-geolocate) or contact [atiwat.rachatawarn@gmail.com](mailto:atiwat.rachatawarn@gmail.com)

## Author

- **Atiwat Rachatawarn** - [atiwat.rachatawarn@gmail.com](mailto:atiwat.rachatawarn@gmail.com) - [https://github.com/Atiwat-R/thai-geolocate](https://github.com/Atiwat-R/thai-geolocate)