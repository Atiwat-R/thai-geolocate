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
});
