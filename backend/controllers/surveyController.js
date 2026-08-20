const { pool } = require('../config/db');

// Helper to safely parse JSON or string
const parseJSONField = (val, defaultValue = []) => {
  if (!val) return defaultValue;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    if (typeof val === 'string') {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return defaultValue;
  }
};

// Create a new survey record
exports.createSurvey = async (req, res) => {
  try {
    const body = req.body;

    // Process uploaded images
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(file => `/uploads/${file.filename}`);
    } else if (body.shop_images) {
      uploadedImages = parseJSONField(body.shop_images, []);
    }

    const holidayDays = JSON.stringify(parseJSONField(body.holiday_days, []));
    const peakDays = JSON.stringify(parseJSONField(body.peak_customer_days, []));
    const meatTypes = JSON.stringify(parseJSONField(body.meat_types, []));
    const processedConsumption = JSON.stringify(parseJSONField(body.processed_meat_consumption, []));
    const masalas = JSON.stringify(parseJSONField(body.masalas_available, []));
    const shopImages = JSON.stringify(uploadedImages);

    const query = `
      INSERT INTO surveys (
        country, state, district, taluk, village, place, pincode, shop_name, owner_name, years_in_business,
        opening_time, closing_time, holiday_days, workers_count, daily_customers,
        peak_customer_days, regular_meat_rate, meat_types, processed_meat_consumption,
        average_daily_sale_kg, procurement_source, customer_type, masalas_available,
        bbmp_license_issued, bbmp_license_issues, bbmp_issue_reasons, cleanliness_rating,
        spoc_name, spoc_mobile, location_link, latitude, longitude, shop_images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      body.country || 'India',
      body.state || 'Karnataka',
      body.district || 'Bengaluru Urban',
      body.taluk || '',
      body.village || '',
      body.place || '',
      body.pincode || '',
      body.shop_name || '',
      body.owner_name || '',
      parseInt(body.years_in_business || 0, 10),
      body.opening_time || '',
      body.closing_time || '',
      holidayDays,
      body.workers_count || '1',
      body.daily_customers || '10-20',
      peakDays,
      parseFloat(body.regular_meat_rate || 0),
      meatTypes,
      processedConsumption,
      parseFloat(body.average_daily_sale_kg || 0),
      body.procurement_source || '',
      body.customer_type || 'Localities',
      masalas,
      body.bbmp_license_issued || 'No',
      body.bbmp_license_issues || 'No',
      body.bbmp_issue_reasons || '',
      parseInt(body.cleanliness_rating || 3, 10),
      body.spoc_name || body.owner_name || '',
      body.spoc_mobile || '',
      body.location_link || '',
      body.latitude ? parseFloat(body.latitude) : null,
      body.longitude ? parseFloat(body.longitude) : null,
      shopImages
    ];

    const [result] = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Survey submitted successfully!',
      surveyId: result.insertId
    });
  } catch (error) {
    console.error('Error in createSurvey:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save survey',
      error: error.message
    });
  }
};

// Get all surveys with filtering, search, pagination
exports.getAllSurveys = async (req, res) => {
  try {
    const { district, search, license, minRating, page = 1, limit = 50 } = req.query;

    let query = 'SELECT * FROM surveys WHERE 1=1';
    const params = [];

    if (district && district !== 'All') {
      query += ' AND district = ?';
      params.push(district);
    }

    if (license && license !== 'All') {
      query += ' AND bbmp_license_issued = ?';
      params.push(license);
    }

    if (minRating) {
      query += ' AND cleanliness_rating >= ?';
      params.push(parseInt(minRating, 10));
    }

    if (search) {
      query += ' AND (shop_name LIKE ? OR owner_name LIKE ? OR place LIKE ? OR pincode LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);

    // Parse JSON fields before sending to client
    const formattedRows = rows.map(r => ({
      ...r,
      holiday_days: parseJSONField(r.holiday_days, []),
      peak_customer_days: parseJSONField(r.peak_customer_days, []),
      meat_types: parseJSONField(r.meat_types, []),
      processed_meat_consumption: parseJSONField(r.processed_meat_consumption, []),
      masalas_available: parseJSONField(r.masalas_available, []),
      shop_images: parseJSONField(r.shop_images, [])
    }));

    return res.json({
      success: true,
      count: formattedRows.length,
      data: formattedRows
    });
  } catch (error) {
    console.error('Error in getAllSurveys:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve surveys',
      error: error.message
    });
  }
};

// Get single survey by ID
exports.getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM surveys WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    const r = rows[0];
    const formatted = {
      ...r,
      holiday_days: parseJSONField(r.holiday_days, []),
      peak_customer_days: parseJSONField(r.peak_customer_days, []),
      meat_types: parseJSONField(r.meat_types, []),
      processed_meat_consumption: parseJSONField(r.processed_meat_consumption, []),
      masalas_available: parseJSONField(r.masalas_available, []),
      shop_images: parseJSONField(r.shop_images, [])
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error in getSurveyById:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch survey', error: error.message });
  }
};

// Delete survey by ID
exports.deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM surveys WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    return res.json({ success: true, message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSurvey:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete survey', error: error.message });
  }
};

// Get Dashboard Aggregated Analytics Stats
exports.getSurveyStats = async (req, res) => {
  try {
    const [surveys] = await pool.query('SELECT * FROM surveys');

    const totalSurveys = surveys.length;
    if (totalSurveys === 0) {
      return res.json({
        success: true,
        data: {
          totalSurveys: 0,
          avgMeatRate: 0,
          totalDailyKg: 0,
          avgRating: 0,
          licensedPercentage: 0,
          districtStats: {},
          meatTypeStats: {},
          dailyCustomerStats: {},
          peakDayStats: {},
          masalaStats: {},
          licenseStats: { Yes: 0, No: 0 },
          cleanlinessDist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      });
    }

    let sumMeatRate = 0;
    let sumDailyKg = 0;
    let sumRating = 0;
    let licensedCount = 0;

    const districtStats = {};
    const meatTypeStats = {};
    const dailyCustomerStats = {};
    const peakDayStats = {};
    const masalaStats = {};
    const licenseStats = { Yes: 0, No: 0 };
    const cleanlinessDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    surveys.forEach(s => {
      sumMeatRate += parseFloat(s.regular_meat_rate || 0);
      sumDailyKg += parseFloat(s.average_daily_sale_kg || 0);
      sumRating += parseInt(s.cleanliness_rating || 3, 10);

      const isLicensed = s.bbmp_license_issued === 'Yes';
      if (isLicensed) licensedCount++;
      licenseStats[isLicensed ? 'Yes' : 'No'] = (licenseStats[isLicensed ? 'Yes' : 'No'] || 0) + 1;

      // Cleanliness distribution
      const r = Math.min(5, Math.max(1, parseInt(s.cleanliness_rating || 3, 10)));
      cleanlinessDist[r] = (cleanlinessDist[r] || 0) + 1;

      // District
      const d = s.district || 'Unknown';
      districtStats[d] = (districtStats[d] || 0) + 1;

      // Daily Customers
      const dc = s.daily_customers || 'Not specified';
      dailyCustomerStats[dc] = (dailyCustomerStats[dc] || 0) + 1;

      // Meat types (JSON array)
      const mTypes = parseJSONField(s.meat_types, []);
      mTypes.forEach(m => {
        meatTypeStats[m] = (meatTypeStats[m] || 0) + 1;
      });

      // Peak days
      const pDays = parseJSONField(s.peak_customer_days, []);
      pDays.forEach(day => {
        peakDayStats[day] = (peakDayStats[day] || 0) + 1;
      });

      // Masalas
      const mas = parseJSONField(s.masalas_available, []);
      mas.forEach(m => {
        masalaStats[m] = (masalaStats[m] || 0) + 1;
      });
    });

    return res.json({
      success: true,
      data: {
        totalSurveys,
        avgMeatRate: Math.round((sumMeatRate / totalSurveys) * 10) / 10,
        totalDailyKg: Math.round(sumDailyKg * 10) / 10,
        avgDailyKgPerShop: Math.round((sumDailyKg / totalSurveys) * 10) / 10,
        avgRating: Math.round((sumRating / totalSurveys) * 10) / 10,
        licensedPercentage: Math.round((licensedCount / totalSurveys) * 100),
        districtStats,
        meatTypeStats,
        dailyCustomerStats,
        peakDayStats,
        masalaStats,
        licenseStats,
        cleanlinessDist
      }
    });
  } catch (error) {
    console.error('Error in getSurveyStats:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate stats', error: error.message });
  }
};

// Export Surveys as CSV
exports.exportCSV = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM surveys ORDER BY id ASC');

    const headers = [
      'ID', 'District', 'Place', 'Pincode', 'Shop Name', 'Owner Name', 'Years in Business',
      'Opening Time', 'Closing Time', 'Weekly Holidays', 'Workers Count', 'Daily Customers',
      'Peak Customer Days', 'Regular Meat Rate (INR/Kg)', 'Meat Types Available',
      'Processed Meat Consumption', 'Average Daily Sale (Kg)', 'Wholesale Meat Procured From',
      'Customer Type', 'Pork Masalas Available', 'BBMP Trade License Issued',
      'Issues in Procuring BBMP License', 'Reason for License Issues', 'Cleanliness Rating (1-5)',
      'SPOC Name', 'SPOC Mobile Number', 'Shop Location Link', 'Latitude', 'Longitude', 'Submission Date'
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(',')];

    for (const r of rows) {
      csvRows.push([
        escapeCSV(r.id),
        escapeCSV(r.district),
        escapeCSV(r.place),
        escapeCSV(r.pincode),
        escapeCSV(r.shop_name),
        escapeCSV(r.owner_name),
        escapeCSV(r.years_in_business),
        escapeCSV(r.opening_time),
        escapeCSV(r.closing_time),
        escapeCSV(parseJSONField(r.holiday_days, []).join('; ')),
        escapeCSV(r.workers_count),
        escapeCSV(r.daily_customers),
        escapeCSV(parseJSONField(r.peak_customer_days, []).join('; ')),
        escapeCSV(r.regular_meat_rate),
        escapeCSV(parseJSONField(r.meat_types, []).join('; ')),
        escapeCSV(parseJSONField(r.processed_meat_consumption, []).join('; ')),
        escapeCSV(r.average_daily_sale_kg),
        escapeCSV(r.procurement_source),
        escapeCSV(r.customer_type),
        escapeCSV(parseJSONField(r.masalas_available, []).join('; ')),
        escapeCSV(r.bbmp_license_issued),
        escapeCSV(r.bbmp_license_issues),
        escapeCSV(r.bbmp_issue_reasons),
        escapeCSV(r.cleanliness_rating),
        escapeCSV(r.spoc_name),
        escapeCSV(r.spoc_mobile),
        escapeCSV(r.location_link),
        escapeCSV(r.latitude),
        escapeCSV(r.longitude),
        escapeCSV(r.created_at)
      ].join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="pork_survey_data.csv"');
    return res.status(200).send(csvRows.join('\r\n'));
  } catch (error) {
    console.error('Error in exportCSV:', error);
    return res.status(500).json({ success: false, message: 'Failed to export CSV', error: error.message });
  }
};
