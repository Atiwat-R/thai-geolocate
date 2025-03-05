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
    expect(result).toBeNull();
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
});
