import { findProvince } from '../src/index.js';

describe('findProvince', () => {
  it('returns correct province for Bangkok coordinates', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const result = await findProvince(lat, lng);

    expect(result.province.nameEN).toBe("Bangkok");
    expect(result.province.nameTH).toBe("กรุงเทพมหานคร");
    expect(result.province.pcode).toBe("TH10");
    expect(result.province.admLevel).toBe("ADM1");
  });

  it('returns correct province for Chiang Mai coordinates', async () => {
    const lat = 18.7883;
    const lng = 98.9853;
    const result = await findProvince(lat, lng);

    expect(result.province.nameEN).toBe("Chiang Mai");
    expect(result.province.nameTH).toBe("เชียงใหม่");
    expect(result.province.pcode).toBe("TH50");
    expect(result.province.admLevel).toBe("ADM1");
  });

  it('returns correct province for Phuket coordinates', async () => {
    const lat = 7.8804;
    const lng = 98.3923;
    const result = await findProvince(lat, lng);

    expect(result.province.nameEN).toBe("Phuket");
    expect(result.province.nameTH).toBe("ภูเก็ต");
    expect(result.province.pcode).toBe("TH83");
    expect(result.province.admLevel).toBe("ADM1");
  });

  // Edge cases: invalid values and missing parameters
  it('throws an error for invalid latitude (out of range)', async () => {
    const lat = 91; // Latitude must be between -90 and 90
    const lng = 100;
    await expect(findProvince(lat, lng)).rejects.toThrow();
  });

  it('throws an error for invalid longitude (out of range)', async () => {
    const lat = 13.7563;
    const lng = 181; // Longitude must be between -180 and 180
    await expect(findProvince(lat, lng)).rejects.toThrow();
  });

  it('throws an error for non-numeric inputs', async () => {
    const lat = "abc";
    const lng = "xyz";
    await expect(findProvince(lat, lng)).rejects.toThrow();
  });

  it('throws an error when parameters are missing', async () => {
    await expect(findProvince()).rejects.toThrow();
    await expect(findProvince(13.7563)).rejects.toThrow();
  });

  // Edge case: Coordinates outside Thailand
  it('returns null for coordinates outside of Thailand', async () => {
    // Example: Tokyo, Japan
    const lat = 35.6895;
    const lng = 139.6917;
    const result = await findProvince(lat, lng);

    expect(result.province).toBeNull();
  });

  // Borderline/Precision cases
  it('handles high-precision coordinates correctly', async () => {
    const lat = 13.7563001234;
    const lng = 100.5018005678;
    const result = await findProvince(lat, lng);

    expect(result.province.nameEN).toBe("Bangkok");
    expect(result.province.pcode).toBe("TH10");
    expect(result.province.admLevel).toBe("ADM1");
  });

  it('returns correct province for coordinates on a province border', async () => {
    // Coordinates that lie exactly on the border between Bangkok and an adjacent province.
    // Adjust the expected result based on how your algorithm resolves border cases.
    const lat = 13.8000;
    const lng = 100.5000;
    const result = await findProvince(lat, lng);

    // Assume that borderline coordinates are assigned to Bangkok
    expect(result.province.nameEN).toBe("Bangkok");
    expect(result.province.pcode).toBe("TH10");
    expect(result.province.admLevel).toBe("ADM1");
  });

  // ----- AccuracyConfig Invalid Cases -----
  it('throws an error for invalid accuracyLevel type (non-object)', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = "invalid";
    await expect(findProvince(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for missing province key in accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = {};
    await expect(findProvince(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for non-numeric province value in accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = { province: "high" };
    await expect(findProvince(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for negative province accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = { province: -1 };
    await expect(findProvince(lat, lng, accuracyLevel)).rejects.toThrow();
  });

  // ----- Dataset File Missing -----
  it('throws an error when dataset file does not exist for given accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    // Assuming that there is no dataset for accuracy_level_99
    const accuracyLevel = { province: 99 };
    await expect(findProvince(lat, lng, accuracyLevel)).rejects.toThrow(/Cannot find dataset/);
  });

  // ----- Extreme Coordinate Values -----
  it('returns null for extreme valid coordinates (lat=90, lng=0)', async () => {
    const lat = 90;
    const lng = 0;
    const result = await findProvince(lat, lng);
    expect(result.province).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=-90, lng=0)', async () => {
    const lat = -90;
    const lng = 0;
    const result = await findProvince(lat, lng);
    expect(result.province).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=0, lng=180)', async () => {
    const lat = 0;
    const lng = 180;
    const result = await findProvince(lat, lng);
    expect(result.province).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=0, lng=-180)', async () => {
    const lat = 0;
    const lng = -180;
    const result = await findProvince(lat, lng);
    expect(result.province).toBeNull();
  });

  // ----- Additional Invalid Coordinate Types -----
  it('throws an error for boolean values as coordinates', async () => {
    await expect(findProvince(true, false)).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for array values as coordinates', async () => {
    await expect(findProvince([13.7563], [100.5018])).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for null latitude', async () => {
    await expect(findProvince(null, 100.5018)).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for undefined longitude', async () => {
    await expect(findProvince(13.7563, undefined)).rejects.toThrow("Invalid (lat, lng) input.");
  });

  // ----- Explicit Accuracy Level Configuration -----
  it('returns correct province for Bangkok coordinates with explicit accuracyLevel config', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = { province: 1 };
    const result = await findProvince(lat, lng, accuracyLevel);

    expect(result.province.nameEN).toBe("Bangkok");
    expect(result.province.nameTH).toBe("กรุงเทพมหานคร");
    expect(result.province.pcode).toBe("TH10");
    expect(result.province.admLevel).toBe("ADM1");
  });
});
