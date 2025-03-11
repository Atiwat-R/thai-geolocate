import { findAmphoe } from '../src/index.js';

describe('findAmphoe', () => {
  it('returns correct amphoe for Pathum Wan, Bangkok coordinates', async () => {
    const lat = 13.7414;
    const lng = 100.5328;
    const result = await findAmphoe(lat, lng);

    expect(result.amphoe.nameEN).toBe("Pathum Wan");
    expect(result.amphoe.nameTH).toBe("ปทุมวัน");
    expect(result.amphoe.pcode).toBe("TH1007");
    expect(result.amphoe.admLevel).toBe("ADM2");

    expect(result.province.nameEN).toBe("Bangkok");
    expect(result.province.nameTH).toBe("กรุงเทพมหานคร");
    expect(result.province.pcode).toBe("TH10");
    expect(result.province.admLevel).toBe("ADM1");
  });

  it('returns correct amphoe for Mueang Chiang Mai coordinates', async () => {
    // Coordinates assumed to fall within Mueang Chiang Mai district.
    const lat = 18.7883;
    const lng = 98.9853;
    const result = await findAmphoe(lat, lng);

    expect(result.amphoe.nameEN).toBe("Mueang Chiang Mai");
    expect(result.amphoe.nameTH).toBe("เมืองเชียงใหม่");
    expect(result.amphoe.pcode).toBe("TH5001");
    expect(result.amphoe.admLevel).toBe("ADM2");

    expect(result.province.nameEN).toBe("Chiang Mai");
    expect(result.province.nameTH).toBe("เชียงใหม่");
    expect(result.province.pcode).toBe("TH50");
    expect(result.province.admLevel).toBe("ADM1");
  });

  it('returns correct amphoe for Mueang Phuket coordinates', async () => {
    // Coordinates assumed to fall within Mueang Phuket district.
    const lat = 7.8804;
    const lng = 98.3923;
    const result = await findAmphoe(lat, lng);

    expect(result.amphoe.nameEN).toBe("Mueang Phuket");
    expect(result.amphoe.nameTH).toBe("เมืองภูเก็ต");
    expect(result.amphoe.pcode).toBe("TH8301");
    expect(result.amphoe.admLevel).toBe("ADM2");

    expect(result.province.nameEN).toBe("Phuket");
    expect(result.province.nameTH).toBe("ภูเก็ต");
    expect(result.province.pcode).toBe("TH83");
    expect(result.province.admLevel).toBe("ADM1");
  });

  it('returns null for coordinates outside of Thailand', async () => {
    // Tokyo, Japan coordinates
    const lat = 35.6895;
    const lng = 139.6917;
    const result = await findAmphoe(lat, lng);

    expect(result.amphoe).toBeNull();
  });

  // Edge cases: invalid inputs
  it('throws an error for invalid latitude (out of range)', async () => {
    const lat = 95; // Latitude must be between -90 and 90
    const lng = 100.5328;
    await expect(findAmphoe(lat, lng)).rejects.toThrow();
  });

  it('throws an error for invalid longitude (out of range)', async () => {
    const lat = 13.7414;
    const lng = 200; // Longitude must be between -180 and 180
    await expect(findAmphoe(lat, lng)).rejects.toThrow();
  });

  it('throws an error for non-numeric inputs', async () => {
    const lat = "not a number";
    const lng = "not a number";
    await expect(findAmphoe(lat, lng)).rejects.toThrow();
  });

  it('throws an error when parameters are missing', async () => {
    await expect(findAmphoe()).rejects.toThrow();
    await expect(findAmphoe(13.7414)).rejects.toThrow();
  });

  it('handles high-precision coordinates correctly', async () => {
    const lat = 13.7414001234;
    const lng = 100.5328005678;
    const result = await findAmphoe(lat, lng);

    // Expect the same result as for the base coordinates.
    expect(result.amphoe.nameEN).toBe("Pathum Wan");
    expect(result.amphoe.pcode).toBe("TH1007");
    expect(result.amphoe.admLevel).toBe("ADM2");

    expect(result.province.nameEN).toBe("Bangkok");
    expect(result.province.pcode).toBe("TH10");
    expect(result.province.admLevel).toBe("ADM1");
  });

  it('returns correct amphoe for borderline coordinates', async () => {
    // Coordinates in Satun province, Thung Wa district
    const lat = 7.151071;  
    const lng = 99.848898;
    const result = await findAmphoe(lat, lng);

    expect(result.amphoe.nameEN).toBe("Thung Wa");
    expect(result.amphoe.nameTH).toBe("ทุ่งหว้า");
    expect(result.amphoe.pcode).toBe("TH9106");
    expect(result.amphoe.admLevel).toBe("ADM2");

    expect(result.province.nameEN).toBe("Satun");
    expect(result.province.nameTH).toBe("สตูล");
    expect(result.province.pcode).toBe("TH91");
    expect(result.province.admLevel).toBe("ADM1");
  });

    // ----- AccuracyConfig Invalid Cases -----
  it('throws an error for invalid accuracyLevel type (non-object)', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = "invalid";
    await expect(findAmphoe(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for missing province key in accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = {};
    await expect(findAmphoe(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for non-numeric province value in accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = { province: "high", amphoe: "higher" };
    await expect(findAmphoe(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for negative province accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = { province: -1, amphoe: -31 };
    await expect(findAmphoe(lat, lng, accuracyLevel)).rejects.toThrow();
  });

  // ----- Dataset File Missing -----
  it('throws an error when dataset file does not exist for given accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    // Assuming that there is no dataset for accuracy_level_99
    const accuracyLevel = { province: 99, amphoe: 773 };
    await expect(findAmphoe(lat, lng, accuracyLevel)).rejects.toThrow(/Cannot find dataset/);
  });

  // ----- Extreme Coordinate Values -----
  it('returns null for extreme valid coordinates (lat=90, lng=0)', async () => {
    const lat = 90;
    const lng = 0;
    const result = await findAmphoe(lat, lng);
    expect(result.amphoe).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=-90, lng=0)', async () => {
    const lat = -90;
    const lng = 0;
    const result = await findAmphoe(lat, lng);
    expect(result.amphoe).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=0, lng=180)', async () => {
    const lat = 0;
    const lng = 180;
    const result = await findAmphoe(lat, lng);
    expect(result.amphoe).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=0, lng=-180)', async () => {
    const lat = 0;
    const lng = -180;
    const result = await findAmphoe(lat, lng);
    expect(result.amphoe).toBeNull();
  });

  // ----- Additional Invalid Coordinate Types -----
  it('throws an error for boolean values as coordinates', async () => {
    await expect(findAmphoe(true, false)).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for array values as coordinates', async () => {
    await expect(findAmphoe([13.7563], [100.5018])).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for null latitude', async () => {
    await expect(findAmphoe(null, 100.5018)).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for undefined longitude', async () => {
    await expect(findAmphoe(13.7563, undefined)).rejects.toThrow("Invalid (lat, lng) input.");
  });

});
