import { findTambon } from '../src/index.js';

describe('findTambon', () => {
    it('returns correct tambon for tambon Huai Yang, amphoe Bua Yai, Nakhon Ratchasima province', async () => {
        const lat = 15.631059;
        const lng = 102.286112;
        const result = await findTambon(lat, lng);


        // Verify province details
        expect(result.province.nameEN).toBe("Nakhon Ratchasima");
        expect(result.province.nameTH).toBe("นครราชสีมา");
        expect(result.province.pcode).toBe("TH30");
        expect(result.province.admLevel).toBe("ADM1");

        // Verify amphoe details
        expect(result.amphoe.nameEN).toBe("Bua Yai");
        expect(result.amphoe.nameTH).toBe("บัวใหญ่");
        expect(result.amphoe.pcode).toBe("TH3012");
        expect(result.amphoe.admLevel).toBe("ADM2");

        // Verify tambon details
        expect(result.tambon).not.toBeNull();
        expect(result.tambon.nameEN).toBe("Huai Yang");
        expect(result.tambon.nameTH).toBe("ห้วยยาง");
        expect(result.tambon.pcode).toBe("TH301203");
        expect(result.tambon.admLevel).toBe("ADM3");
    });

    it('returns correct tambon for tambon Bang Nam Chued, amphoe Muang Samut Sakhon, Samut Sakhon province', async () => {
        const lat = 13.599302;
        const lng = 100.369061;
        const accuracyConfig = { 
            province: 1, 
            amphoe: 1,
            tambon: 2
        }
        const result = await findTambon(lat, lng, accuracyConfig);
    
        // Verify province details
        expect(result.province.nameEN).toBe("Samut Sakhon");
        expect(result.province.nameTH).toBe("สมุทรสาคร");
        expect(result.province.pcode).toBe("TH74");
        expect(result.province.admLevel).toBe("ADM1");
    
        // Verify amphoe details
        expect(result.amphoe.nameEN).toBe("Mueang Samut Sakhon");
        expect(result.amphoe.nameTH).toBe("เมืองสมุทรสาคร");
        expect(result.amphoe.pcode).toBe("TH7401");
        expect(result.amphoe.admLevel).toBe("ADM2");
    
        // Verify tambon details
        expect(result.tambon).not.toBeNull();
        expect(result.tambon.nameEN).toBe("Phanthai Norasing");
        expect(result.tambon.nameTH).toBe("พันท้ายนรสิงห์");
        expect(result.tambon.pcode).toBe("TH740113");
        expect(result.tambon.admLevel).toBe("ADM3");
    });

    it('returns correct tambon for tambon Tha Kham, amphoe Bang Khun Thian, Bangkok province', async () => {
        const lat = 13.618999;
        const lng = 100.449725;
        const accuracyConfig = { 
            province: 1, 
            amphoe: 1,
            tambon: 2
        }
        const result = await findTambon(lat, lng, accuracyConfig);
        
        // Verify province details
        expect(result.province.nameEN).toBe("Bangkok");
        expect(result.province.nameTH).toBe("กรุงเทพมหานคร");
        expect(result.province.pcode).toBe("TH10");
        expect(result.province.admLevel).toBe("ADM1");
    
        // Verify amphoe details
        expect(result.amphoe.nameEN).toBe("Bang Khun Thian");
        expect(result.amphoe.nameTH).toBe("บางขุนเทียน");
        expect(result.amphoe.pcode).toBe("TH1021");
        expect(result.amphoe.admLevel).toBe("ADM2");
    
        // Verify tambon details
        expect(result.tambon).not.toBeNull();
        expect(result.tambon.nameEN).toBe("Tha Kham");
        expect(result.tambon.nameTH).toBe("ท่าข้าม");
        expect(result.tambon.pcode).toBe("TH102105");
        expect(result.tambon.admLevel).toBe("ADM3");
    });

    it('returns null for coordinates outside of Thailand', async () => {
        // Tokyo, Japan coordinates
        const lat = 35.6895;
        const lng = 139.6917;
        const result = await findTambon(lat, lng);

        expect(result.amphoe).toBeNull();
    });

    // Edge cases: invalid inputs
    it('throws an error for invalid latitude (out of range)', async () => {
        const lat = 95; // Latitude must be between -90 and 90
        const lng = 100.5328;
        await expect(findTambon(lat, lng)).rejects.toThrow();
    });

    it('throws an error for invalid longitude (out of range)', async () => {
        const lat = 13.7414;
        const lng = 200; // Longitude must be between -180 and 180
        await expect(findTambon(lat, lng)).rejects.toThrow();
    });

    it('throws an error for non-numeric inputs', async () => {
        const lat = "not a number";
        const lng = "not a number";
        await expect(findTambon(lat, lng)).rejects.toThrow();
    });
  
    it('returns correct high-precision tambon for tambon Pa O Don Chai, amphoe Mueang Chiang Rai, Chiang Rai province', async () => {
        const lat = 19.82327912424;
        const lng = 99.76269635621;
        const accuracyConfig = { 
            province: 2, 
            amphoe: 2,
            tambon: 2
        }
        const result = await findTambon(lat, lng, accuracyConfig);
      
        // Verify province details
        expect(result.province.nameEN).toBe("Chiang Rai");
        expect(result.province.nameTH).toBe("เชียงราย");
        expect(result.province.pcode).toBe("TH57");
        expect(result.province.admLevel).toBe("ADM1");
      
        // Verify amphoe details
        expect(result.amphoe.nameEN).toBe("Mueang Chiang Rai");
        expect(result.amphoe.nameTH).toBe("เมืองเชียงราย");
        expect(result.amphoe.pcode).toBe("TH5701");
        expect(result.amphoe.admLevel).toBe("ADM2");
      
        // Verify tambon details
        expect(result.tambon).not.toBeNull();
        expect(result.tambon.nameEN).toBe("Pa O Don Chai");
        expect(result.tambon.nameTH).toBe("ป่าอ้อดอนชัย");
        expect(result.tambon.pcode).toBe("TH570116");
        expect(result.tambon.admLevel).toBe("ADM3");
    });
      

        // ----- AccuracyConfig Invalid Cases -----
  it('throws an error for invalid accuracyLevel type (non-object)', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = "invalid";
    await expect(findTambon(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for missing province key in accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = {};
    await expect(findTambon(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for non-numeric province value in accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = { province: "high", amphoe: "higher" };
    await expect(findTambon(lat, lng, accuracyLevel)).rejects.toThrow("Invalid accuracyLevel input.");
  });

  it('throws an error for negative province accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    const accuracyLevel = { province: -1, amphoe: -31, tambon: -12 };
    await expect(findTambon(lat, lng, accuracyLevel)).rejects.toThrow();
  });

  // ----- Dataset File Missing -----
  it('throws an error when dataset file does not exist for given accuracyLevel', async () => {
    const lat = 13.7563;
    const lng = 100.5018;
    // Assuming that there is no dataset for accuracy_level_99
    const accuracyLevel = { province: 99, amphoe: 773, tambon: 9000 };
    await expect(findTambon(lat, lng, accuracyLevel)).rejects.toThrow(/Cannot find dataset/);
  });

  // ----- Extreme Coordinate Values -----
  it('returns null for extreme valid coordinates (lat=90, lng=0)', async () => {
    const lat = 90;
    const lng = 0;
    const result = await findTambon(lat, lng);
    expect(result.tambon).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=-90, lng=0)', async () => {
    const lat = -90;
    const lng = 0;
    const result = await findTambon(lat, lng);
    expect(result.tambon).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=0, lng=180)', async () => {
    const lat = 0;
    const lng = 180;
    const result = await findTambon(lat, lng);
    expect(result.tambon).toBeNull();
  });

  it('returns null for extreme valid coordinates (lat=0, lng=-180)', async () => {
    const lat = 0;
    const lng = -180;
    const result = await findTambon(lat, lng);
    expect(result.tambon).toBeNull();
  });

  // ----- Additional Invalid Coordinate Types -----
  it('throws an error for boolean values as coordinates', async () => {
    await expect(findTambon(true, false)).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for array values as coordinates', async () => {
    await expect(findTambon([13.7563], [100.5018])).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for null latitude', async () => {
    await expect(findTambon(null, 100.5018)).rejects.toThrow("Invalid (lat, lng) input.");
  });

  it('throws an error for undefined longitude', async () => {
    await expect(findTambon(13.7563, undefined)).rejects.toThrow("Invalid (lat, lng) input.");
  });

});
