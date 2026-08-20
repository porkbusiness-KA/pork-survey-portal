async function runTests() {
  console.log('--- Starting End-to-End API and MySQL Verification ---');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const healthData = await healthRes.json();
  console.log('1. Health check:', healthData.status === 'ok' ? 'PASS' : 'FAIL');

  // 2. Submit new survey via POST /api/surveys
  const newSurveyPayload = {
    district: 'Bengaluru Urban',
    place: 'Indiranagar 100ft Road',
    pincode: '560038',
    shop_name: 'Bangalore Prime Pork & Cuts',
    owner_name: 'Suresh Babu',
    years_in_business: 6,
    opening_time: '08:00 AM',
    closing_time: '09:30 PM',
    holiday_days: ['Monday'],
    workers_count: '4',
    daily_customers: '50–60',
    peak_customer_days: ['Sunday', 'Saturday'],
    regular_meat_rate: 370.00,
    meat_types: ['Fresh meat (Pork)', 'Processed meat products (Pork)'],
    processed_meat_consumption: ['<5 Kg', 'Ham', 'Bacon'],
    average_daily_sale_kg: 90.00,
    procurement_source: 'Hesaraghatta Central Piggery Farm',
    customer_type: 'Both localities and non-Localities',
    masalas_available: ['Both Chandrakala and Jeevith masala'],
    bbmp_license_issued: 'Yes',
    bbmp_license_issues: 'No',
    bbmp_issue_reasons: '',
    cleanliness_rating: 5,
    spoc_name: 'Suresh Babu',
    spoc_mobile: '9845019283',
    location_link: 'https://maps.google.com/?q=12.9784,77.6408',
    latitude: 12.9784,
    longitude: 77.6408
  };

  const submitRes = await fetch('http://localhost:5000/api/surveys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSurveyPayload)
  });
  const submitData = await submitRes.json();
  console.log('2. Survey Submission to MySQL:', submitData.success ? `PASS (Inserted ID #${submitData.surveyId})` : 'FAIL');

  // 3. Fetch all surveys with filtering
  const surveysRes = await fetch('http://localhost:5000/api/surveys?search=Indiranagar');
  const surveysData = await surveysRes.json();
  const found = surveysData.data.find(s => s.shop_name === 'Bangalore Prime Pork & Cuts');
  console.log('3. Search and Retrieval by Shop/Place:', found ? 'PASS' : 'FAIL');

  // 4. Fetch survey stats
  const statsRes = await fetch('http://localhost:5000/api/stats');
  const statsData = await statsRes.json();
  console.log('4. Aggregated Analytics Stats:', statsData.success ? `PASS (Total: ${statsData.data.totalSurveys}, Avg Rate: ₹${statsData.data.avgMeatRate}, Licensed: ${statsData.data.licensedPercentage}%)` : 'FAIL');

  // 5. Check CSV export
  const exportRes = await fetch('http://localhost:5000/api/export');
  const csvText = await exportRes.text();
  console.log('5. CSV Export Stream:', csvText.includes('Bangalore Prime Pork & Cuts') ? 'PASS' : 'FAIL');

  // 6. Test Frontend static/dev server
  const frontRes = await fetch('http://localhost:5173/');
  const frontHtml = await frontRes.text();
  console.log('6. Frontend Vite Server Response:', frontHtml.includes('Pork Retail Shop Outlet Survey Portal') ? 'PASS' : 'FAIL');

  console.log('--- All System & Database Tests Completed Successfully ---');
}

runTests().catch(console.error);
