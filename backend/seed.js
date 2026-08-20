const { pool, initDatabase } = require('./config/db');

const sampleSurveys = [
  {
    district: 'Bengaluru Urban',
    place: 'Shivajinagar Market',
    pincode: '560051',
    shop_name: 'St. Anthony Fresh Pork Meat Centre',
    owner_name: 'Francis Fernandes',
    years_in_business: 12,
    opening_time: '07:30 AM',
    closing_time: '08:30 PM',
    holiday_days: JSON.stringify(['Monday']),
    workers_count: '3',
    daily_customers: '50–60',
    peak_customer_days: JSON.stringify(['Sunday', 'Wednesday', 'Friday']),
    regular_meat_rate: 340.00,
    meat_types: JSON.stringify(['Fresh meat (Pork)', 'Processed meat products (Pork)']),
    processed_meat_consumption: JSON.stringify(['<5 Kg', 'Ham', 'Bacon', 'Sausage']),
    average_daily_sale_kg: 85.00,
    procurement_source: 'Local registered piggeries in Hoskote & Kanakapura',
    customer_type: 'Both localities and non-Localities',
    masalas_available: JSON.stringify(['Both Chandrakala and Jeevith masala']),
    bbmp_license_issued: 'Yes',
    bbmp_license_issues: 'No',
    bbmp_issue_reasons: '',
    cleanliness_rating: 5,
    spoc_name: 'Francis Fernandes',
    spoc_mobile: '9845012345',
    location_link: 'https://maps.google.com/?q=12.9856,77.6057',
    latitude: 12.9856,
    longitude: 77.6057,
    shop_images: JSON.stringify([])
  },
  {
    district: 'Bengaluru Urban',
    place: 'Frazer Town / Pulikeshi Nagar',
    pincode: '560005',
    shop_name: 'Royal Pork & Cold Cuts Express',
    owner_name: 'Santhosh Kumar M',
    years_in_business: 8,
    opening_time: '08:00 AM',
    closing_time: '09:00 PM',
    holiday_days: JSON.stringify(['Tuesday']),
    workers_count: '4',
    daily_customers: '70–80',
    peak_customer_days: JSON.stringify(['Saturday', 'Sunday']),
    regular_meat_rate: 360.00,
    meat_types: JSON.stringify(['Both fresh meat, processed meat products and whole pig (Pork)']),
    processed_meat_consumption: JSON.stringify(['>10 Kg', 'Ham', 'Bacon', 'Salami', 'Pepperoni', 'Sausage']),
    average_daily_sale_kg: 120.00,
    procurement_source: 'Government certified farm, Malur & Kolar',
    customer_type: 'Non-Localities',
    masalas_available: JSON.stringify(['Chandrakala masala']),
    bbmp_license_issued: 'Yes',
    bbmp_license_issues: 'No',
    bbmp_issue_reasons: '',
    cleanliness_rating: 4,
    spoc_name: 'Santhosh Kumar M',
    spoc_mobile: '9741238901',
    location_link: 'https://maps.google.com/?q=12.9982,77.6154',
    latitude: 12.9982,
    longitude: 77.6154,
    shop_images: JSON.stringify([])
  },
  {
    district: 'Bengaluru Rural',
    place: 'Nelamangala Town Main Road',
    pincode: '562123',
    shop_name: 'Sri Manjunatha Pork Stalls',
    owner_name: 'Ramesh Gowda',
    years_in_business: 15,
    opening_time: '06:30 AM',
    closing_time: '07:00 PM',
    holiday_days: JSON.stringify(['No holiday']),
    workers_count: '2',
    daily_customers: '30–40',
    peak_customer_days: JSON.stringify(['Sunday', 'Thursday']),
    regular_meat_rate: 310.00,
    meat_types: JSON.stringify(['Fresh meat (Pork)', 'Whole pig']),
    processed_meat_consumption: JSON.stringify(['<1 Kg']),
    average_daily_sale_kg: 60.00,
    procurement_source: 'Direct farmers in Kunigal & Magadi',
    customer_type: 'Localities',
    masalas_available: JSON.stringify(['Jeevith masala']),
    bbmp_license_issued: 'No',
    bbmp_license_issues: 'Yes',
    bbmp_issue_reasons: 'Rural zone classification transition pending with local municipality',
    cleanliness_rating: 3,
    spoc_name: 'Ramesh Gowda',
    spoc_mobile: '9448123789',
    location_link: 'https://maps.google.com/?q=13.0987,77.3912',
    latitude: 13.0987,
    longitude: 77.3912,
    shop_images: JSON.stringify([])
  },
  {
    district: 'Kolar District',
    place: 'Robertsonpet, KGF',
    pincode: '563122',
    shop_name: 'Champion Reefs Pork & Meat Mart',
    owner_name: 'David Raj',
    years_in_business: 20,
    opening_time: '07:00 AM',
    closing_time: '08:00 PM',
    holiday_days: JSON.stringify(['Only during festival']),
    workers_count: '3',
    daily_customers: '40–50',
    peak_customer_days: JSON.stringify(['Sunday', 'Wednesday']),
    regular_meat_rate: 320.00,
    meat_types: JSON.stringify(['Fresh meat (Pork)']),
    processed_meat_consumption: JSON.stringify(['<3 Kg', 'Sausage']),
    average_daily_sale_kg: 75.00,
    procurement_source: 'Bangarapet breeders association',
    customer_type: 'Localities',
    masalas_available: JSON.stringify(['Both Chandrakala and Jeevith masala']),
    bbmp_license_issued: 'No',
    bbmp_license_issues: 'No',
    bbmp_issue_reasons: 'Under Kolar District Health & Trade Dept jurisdiction',
    cleanliness_rating: 4,
    spoc_name: 'David Raj',
    spoc_mobile: '9880192834',
    location_link: 'https://maps.google.com/?q=12.9592,78.2723',
    latitude: 12.9592,
    longitude: 78.2723,
    shop_images: JSON.stringify([])
  },
  {
    district: 'Ramanagara District',
    place: 'Channapatna Old Bus Stand Area',
    pincode: '562160',
    shop_name: 'Kaveri Pork & Fresh Cuts',
    owner_name: 'Shankar Narayana',
    years_in_business: 5,
    opening_time: '08:00 AM',
    closing_time: '07:30 PM',
    holiday_days: JSON.stringify(['Monday']),
    workers_count: '2',
    daily_customers: '20–30',
    peak_customer_days: JSON.stringify(['Sunday']),
    regular_meat_rate: 300.00,
    meat_types: JSON.stringify(['Fresh meat (Pork)']),
    processed_meat_consumption: JSON.stringify(['<1 Kg']),
    average_daily_sale_kg: 45.00,
    procurement_source: 'Mandya & Ramanagara wholesale cooperative',
    customer_type: 'Both localities and non-Localities',
    masalas_available: JSON.stringify(['Chandrakala masala']),
    bbmp_license_issued: 'No',
    bbmp_license_issues: 'Yes',
    bbmp_issue_reasons: 'Documentation renewal in progress',
    cleanliness_rating: 4,
    spoc_name: 'Shankar Narayana',
    spoc_mobile: '9632114455',
    location_link: 'https://maps.google.com/?q=12.6518,77.2089',
    latitude: 12.6518,
    longitude: 77.2089,
    shop_images: JSON.stringify([])
  },
  {
    district: 'Bengaluru Urban',
    place: 'Koramangala 5th Block',
    pincode: '560095',
    shop_name: 'Artisan Gourmet Pork & Deli',
    owner_name: 'Vikram Joseph',
    years_in_business: 4,
    opening_time: '09:00 AM',
    closing_time: '10:00 PM',
    holiday_days: JSON.stringify(['No holiday']),
    workers_count: '5',
    daily_customers: '80–90',
    peak_customer_days: JSON.stringify(['Friday', 'Saturday', 'Sunday']),
    regular_meat_rate: 420.00,
    meat_types: JSON.stringify(['Both fresh meat, processed meat products and whole pig (Pork)']),
    processed_meat_consumption: JSON.stringify(['>10 Kg', 'Ham', 'Bacon', 'Salami', 'Pepperoni', 'Sausage']),
    average_daily_sale_kg: 140.00,
    procurement_source: 'Organic certified farm - Coorg & Wayanad',
    customer_type: 'Both localities and non-Localities',
    masalas_available: JSON.stringify(['Both Chandrakala and Jeevith masala']),
    bbmp_license_issued: 'Yes',
    bbmp_license_issues: 'No',
    bbmp_issue_reasons: '',
    cleanliness_rating: 5,
    spoc_name: 'Vikram Joseph',
    spoc_mobile: '9900188224',
    location_link: 'https://maps.google.com/?q=12.9352,77.6245',
    latitude: 12.9352,
    longitude: 77.6245,
    shop_images: JSON.stringify([])
  }
];

async function seed() {
  await initDatabase();
  console.log('Seeding initial survey data...');

  const [existing] = await pool.query('SELECT COUNT(*) as count FROM surveys');
  if (existing[0].count > 0) {
    console.log(`Table already has ${existing[0].count} entries. Skipping duplicate seed.`);
    process.exit(0);
  }

  const query = `
    INSERT INTO surveys (
      district, place, pincode, shop_name, owner_name, years_in_business,
      opening_time, closing_time, holiday_days, workers_count, daily_customers,
      peak_customer_days, regular_meat_rate, meat_types, processed_meat_consumption,
      average_daily_sale_kg, procurement_source, customer_type, masalas_available,
      bbmp_license_issued, bbmp_license_issues, bbmp_issue_reasons, cleanliness_rating,
      spoc_name, spoc_mobile, location_link, latitude, longitude, shop_images
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const s of sampleSurveys) {
    await pool.query(query, [
      s.district, s.place, s.pincode, s.shop_name, s.owner_name, s.years_in_business,
      s.opening_time, s.closing_time, s.holiday_days, s.workers_count, s.daily_customers,
      s.peak_customer_days, s.regular_meat_rate, s.meat_types, s.processed_meat_consumption,
      s.average_daily_sale_kg, s.procurement_source, s.customer_type, s.masalas_available,
      s.bbmp_license_issued, s.bbmp_license_issues, s.bbmp_issue_reasons, s.cleanliness_rating,
      s.spoc_name, s.spoc_mobile, s.location_link, s.latitude, s.longitude, s.shop_images
    ]);
  }

  console.log(`Seeded ${sampleSurveys.length} survey records successfully!`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
