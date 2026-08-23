export const DISTRICTS = [
  { id: 'Bengaluru Urban', en: 'Bengaluru Urban', kn: 'ಬೆಂಗಳೂರು ನಗರ' },
  { id: 'Bengaluru Rural', en: 'Bengaluru Rural', kn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ' },
  { id: 'Kolar District', en: 'Kolar District', kn: 'ಕೋಲಾರ ಜಿಲ್ಲೆ' },
  { id: 'Ramanagara District', en: 'Ramanagara District', kn: 'ರಾಮನಗರ ಜಿಲ್ಲೆ' },
  { id: 'Other District', en: 'Other District', kn: 'ಇತರ ಜಿಲ್ಲೆ' }
];

// Curated Karnataka Pincode Lookup (Instant Offline Cache)
// Curated Karnataka Pincode Lookup (Instant Offline Cache)
export const PINCODE_DATABASE = {
  '560001': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore North', place: 'MG Road / Shivaji Nagar', village: 'Shivajinagar', areas: ['MG Road', 'Cubbon Park', 'Shivajinagar', 'Tasker Town'], lat: 12.9756, lng: 77.6067 },
  '560005': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore North', place: 'Frazer Town / Pulakeshinagar', village: 'Frazer Town', areas: ['Frazer Town', 'Pulakeshinagar', 'Cox Town', 'Cooke Town'], lat: 12.9982, lng: 77.6154 },
  '560008': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore East', place: 'Halasuru / Ulsoor', village: 'Halasuru', areas: ['Halasuru', 'Ulsoor', 'Someshwarapura', 'Jogupalya'], lat: 12.9814, lng: 77.6254 },
  '560025': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore South', place: 'Austin Town / Richmond Town', village: 'Austin Town', areas: ['Austin Town', 'Richmond Town', 'Neelasandra', 'Victoria Layout'], lat: 12.9632, lng: 77.6135 },
  '560034': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore South', place: 'Koramangala I Block', village: 'Koramangala', areas: ['Koramangala 1st Block', 'Madiwala', 'St. Johns', 'Tavarekere'], lat: 12.9279, lng: 77.6271 },
  '560038': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore East', place: 'Indiranagar', village: 'Indiranagar', areas: ['Indiranagar 100ft Road', 'HAL 2nd Stage', 'Defence Colony', 'Doopanahalli'], lat: 12.9784, lng: 77.6408 },
  '560047': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore South', place: 'Viveknagar / Ejipura', village: 'Viveknagar', areas: ['Viveknagar', 'Ejipura', 'Vannarpet', 'Austin Town'], lat: 12.9465, lng: 77.6212 },
  '560051': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore North', place: 'Shivajinagar Market / Broadway', village: 'Shivajinagar', areas: ['Shivajinagar Market', 'Tasker Town', 'Broadway', 'Russell Market'], lat: 12.9856, lng: 77.6057 },
  '560064': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Yelahanka', place: 'Yelahanka Satellite Town', village: 'Yelahanka', areas: ['Yelahanka Satellite Town', 'Attur', 'Kogilu', 'Puttenahalli'], lat: 13.1007, lng: 77.5963 },
  '560068': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore South', place: 'Bommanahalli / Electronic City Link', village: 'Bommanahalli', areas: ['Bommanahalli', 'Begur', 'Hongasandra', 'Devarachikkanahalli'], lat: 12.9038, lng: 77.6247 },
  '560095': { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', taluk: 'Bangalore South', place: 'Koramangala 5th Block', village: 'Koramangala', areas: ['Koramangala 5th Block', 'Koramangala 4th Block', 'National Games Village'], lat: 12.9352, lng: 77.6245 },
  '562114': { country: 'India', state: 'Karnataka', district: 'Bengaluru Rural', taluk: 'Hoskote', place: 'Hoskote Town', village: 'Hoskote', areas: ['Hoskote Town', 'Doddagattiganabbe', 'Kambalipura', 'Kolathur', 'Nandagudi'], lat: 13.0700, lng: 77.7981 },
  '562123': { country: 'India', state: 'Karnataka', district: 'Bengaluru Rural', taluk: 'Nelamangala', place: 'Nelamangala Main Road', village: 'Nelamangala', areas: ['Nelamangala Town', 'Arasinakunte', 'Budihal', 'Gollahalli', 'Honnasandra', 'Madalakote', 'Sompura'], lat: 13.0987, lng: 77.3912 },
  '562110': { country: 'India', state: 'Karnataka', district: 'Bengaluru Rural', taluk: 'Devanahalli', place: 'Devanahalli Town', village: 'Devanahalli', areas: ['Devanahalli Town', 'Binnamangala', 'Vijayapura', 'Avathi', 'Kundana'], lat: 13.2458, lng: 77.7126 },
  '562120': { country: 'India', state: 'Karnataka', district: 'Bengaluru Rural', taluk: 'Doddaballapura', place: 'Doddaballapura', village: 'Doddaballapura', areas: ['Doddaballapura Town', 'Kasaba', 'Tubagere', 'Sasalu', 'Madure'], lat: 13.2933, lng: 77.5342 },
  '563101': { country: 'India', state: 'Karnataka', district: 'Kolar District', taluk: 'Kolar', place: 'Kolar Town', village: 'Kolar', areas: ['Kolar Main Market', 'Fort Area', 'Gulpet', 'Doddapet', 'Gandhi Nagar', 'Hospital Circle'], lat: 13.1367, lng: 78.1291 },
  '563114': { country: 'India', state: 'Karnataka', district: 'Kolar District', taluk: 'Bangarapet', place: 'Bangarapet', village: 'Bangarapet', areas: ['Bangarapet Main', 'Desihalli', 'Kammasandra', 'Karamangala', 'Budikote'], lat: 12.9800, lng: 78.1900 },
  '563122': { country: 'India', state: 'Karnataka', district: 'Kolar District', taluk: 'KGF', place: 'Robertsonpet, KGF', village: 'Robertsonpet', areas: ['Robertsonpet', 'Champion Reefs', 'Oorgaum', 'Marikuppam', 'Andersonpet'], lat: 12.9592, lng: 78.2723 },
  '563130': { country: 'India', state: 'Karnataka', district: 'Kolar District', taluk: 'Malur', place: 'Malur Town', village: 'Malur', areas: ['Malur Town', 'Chikka Tirupathi', 'Lakkur', 'Masti', 'Tekal'], lat: 13.0033, lng: 77.9400 },
  '562159': { country: 'India', state: 'Karnataka', district: 'Ramanagara District', taluk: 'Ramanagara', place: 'Ramanagara Town', village: 'Ramanagara', areas: ['Ramanagara Main', 'Ijoor', 'Vaderahalli', 'Kailancha', 'Kootagal'], lat: 12.7209, lng: 77.2799 },
  '562160': { country: 'India', state: 'Karnataka', district: 'Ramanagara District', taluk: 'Channapatna', place: 'Channapatna', village: 'Channapatna', areas: ['Channapatna Town', 'Chakkere', 'Mankunda', 'Honganoor', 'Kudlur', 'Marchanhalli', 'Shettihalli'], lat: 12.6518, lng: 77.2089 },
  '562117': { country: 'India', state: 'Karnataka', district: 'Ramanagara District', taluk: 'Kanakapura', place: 'Kanakapura', village: 'Kanakapura', areas: ['Kanakapura Main', 'Harohalli', 'Sathnoor', 'Maralawadi', 'Uyyamballi'], lat: 12.5463, lng: 77.4199 },
  '562128': { country: 'India', state: 'Karnataka', district: 'Ramanagara District', taluk: 'Magadi', place: 'Magadi Town', village: 'Magadi', areas: ['Magadi Town', 'Kudur', 'Tavarekere', 'Madabal', 'Thippasandra'], lat: 12.9567, lng: 77.2289 }
};

export const HOLIDAY_OPTIONS = [
  { id: 'Monday', en: 'Monday', kn: 'ಸೋಮವಾರ' },
  { id: 'Tuesday', en: 'Tuesday', kn: 'ಮಂಗಳವಾರ' },
  { id: 'Wednesday', en: 'Wednesday', kn: 'ಬುಧವಾರ' },
  { id: 'Thursday', en: 'Thursday', kn: 'ಗುರುವಾರ' },
  { id: 'Friday', en: 'Friday', kn: 'ಶುಕ್ರವಾರ' },
  { id: 'Saturday', en: 'Saturday', kn: 'ಶನಿವಾರ' },
  { id: 'Sunday', en: 'Sunday', kn: 'ಭಾನುವಾರ' },
  { id: 'No holiday', en: 'No holiday', kn: 'ರಜೆ ಇಲ್ಲ' },
  { id: 'Only during festival', en: 'Only during festival', kn: 'ಹಬ್ಬದ ಸಮಯದಲ್ಲಿ ಮಾತ್ರ' }
];

export const WORKER_OPTIONS = ['1', '2', '3', '4', '5', 'Other'];

export const DAILY_CUSTOMER_OPTIONS = [
  '1–10', '10–20', '20–30', '30–40', '40–50',
  '50–60', '60–70', '70–80', '80–90', '90–100', 'Other'
];

export const PEAK_DAY_OPTIONS = [
  { id: 'Monday', en: 'Monday', kn: 'ಸೋಮವಾರ' },
  { id: 'Tuesday', en: 'Tuesday', kn: 'ಮಂಗಳವಾರ' },
  { id: 'Wednesday', en: 'Wednesday', kn: 'ಬುಧವಾರ' },
  { id: 'Thursday', en: 'Thursday', kn: 'ಗುರುವಾರ' },
  { id: 'Friday', en: 'Friday', kn: 'ಶುಕ್ರವಾರ' },
  { id: 'Saturday', en: 'Saturday', kn: 'ಶನಿವಾರ' },
  { id: 'Sunday', en: 'Sunday', kn: 'ಭಾನುವಾರ' },
  { id: 'All the days', en: 'All the days', kn: 'ಎಲ್ಲಾ ದಿನಗಳು' }
];

export const MEAT_TYPES_OPTIONS = [
  { id: 'Fresh meat (Pork)', en: 'Fresh meat (Pork)', kn: 'ತಾಜಾ ಮಾಂಸ (ಹಂದಿ)' },
  { id: 'Processed meat products (Pork)', en: 'Processed meat products (Pork)', kn: 'ಸಂಸ್ಕರಿಸಿದ ಮಾಂಸ ಉತ್ಪನ್ನಗಳು' },
  { id: 'Whole live pig', en: 'Whole live pig', kn: 'ಸಂಪೂರ್ಣ ಜೀವಂತ ಹಂದಿ (Whole live pig)' },
  { id: 'All (Fresh meat, processed meat products and whole live pig)', en: 'All (Fresh meat, processed meat products & whole live pig)', kn: 'ಎಲ್ಲವೂ (ತಾಜಾ ಮಾಂಸ, ಸಂಸ್ಕರಿಸಿದ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಜೀವಂತ ಹಂದಿ)' },
  { id: 'Other', en: 'Other', kn: 'ಇತರೆ (Other)' }
];

export const PROCESSED_VOLUME_OPTIONS = ['<1 Kg', '<3 Kg', '<5 Kg', '>5 Kg', '>10 Kg', 'Other'];

export const PROCESSED_PRODUCT_TYPES = [
  { id: 'Ham', en: 'Ham', kn: 'ಹ್ಯಾಮ್' },
  { id: 'Bacon', en: 'Bacon', kn: 'ಬೇಕನ್' },
  { id: 'Salami', en: 'Salami', kn: 'ಸಲಾಮಿ' },
  { id: 'Pepperoni', en: 'Pepperoni', kn: 'ಪೆಪ್ಪೆರೋನಿ' },
  { id: 'Sausage', en: 'Sausage', kn: 'ಸಾಸೇಜ್' },
  { id: 'Other', en: 'Other', kn: 'ಇತರೆ' }
];

export const CUSTOMER_TYPE_OPTIONS = [
  { id: 'Localities', en: 'Localities', kn: 'ಸ್ಥಳೀಯರು' },
  { id: 'Non-Localities', en: 'Non-Localities', kn: 'ಸ್ಥಳೀಯರಲ್ಲದವರು' },
  { id: 'Both localities and non-Localities', en: 'Both localities and non-Localities', kn: 'ಸ್ಥಳೀಯರು ಮತ್ತು ಅನ್ಯರು ಇಬ್ಬರೂ' }
];

export const MASALA_OPTIONS = [
  { id: 'Both Chandrakala and Jeevith masala', en: 'Both Chandrakala and Jeevith masala', kn: 'ಚಂದ್ರಕಲಾ ಮತ್ತು ಜೀವಿತ ಎರಡೂ ಮಸಾಲಾಗಳು' },
  { id: 'Chandrakala masala', en: 'Chandrakala masala only', kn: 'ಚಂದ್ರಕಲಾ ಮಸಾಲಾ ಮಾತ್ರ' },
  { id: 'Jeevith masala', en: 'Jeevith masala only', kn: 'ಜೀವಿತ ಮಸಾಲಾ ಮಾತ್ರ' },
  { id: 'Other', en: 'Other masala brands', kn: 'ಇತರ ಮಸಾಲಾ ಬ್ರಾಂಡ್‌ಗಳು' }
];

export const SPOC_SKILL_OPTIONS = [
  { id: 'Butchery / Meat Cutting', en: 'Butchery / Meat Cutting', kn: 'ಮಾಂಸ ಕತ್ತರಿಸುವುದು (Butchery)' },
  { id: 'Sales & Billing', en: 'Sales & Billing', kn: 'ಮಾರಾಟ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್ (Sales)' },
  { id: 'Shop Incharge / Management', en: 'Shop Incharge / Management', kn: 'ಅಂಗಡಿ ನಿರ್ವಹಣೆ (Manager)' },
  { id: 'Procurement & Sourcing', en: 'Procurement & Sourcing', kn: 'ಸಗಟು ಖರೀದಿ ಮತ್ತು ಸಾಗಾಣಿಕೆ' },
  { id: 'Cleaning & Maintenance', en: 'Cleaning & Maintenance', kn: 'ಶುಚಿತ್ವ ಮತ್ತು ಸ್ವಚ್ಛತೆ' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ' }
];

export const TRAINING_SKILL_OPTIONS = [
  { id: 'Pig Rearing and Farm Management', en: 'Pig Rearing and Farm Management', kn: 'ಹಂದಿ ಸಾಕಣೆ ಮತ್ತು ಫಾರ್ಮ್ ನಿರ್ವಹಣೆ' },
  { id: 'Pig Breeding and Reproduction', en: 'Pig Breeding and Reproduction', kn: 'ಹಂದಿ ತಳಿ ಅಭಿವೃದ್ಧಿ ಮತ್ತು ಸಂತಾನೋತ್ಪತ್ತಿ' },
  { id: 'Pig Feeding and Nutrition', en: 'Pig Feeding and Nutrition', kn: 'ಹಂದಿ ಆಹಾರ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶ' },
  { id: 'Pig Health and Disease Management', en: 'Pig Health and Disease Management', kn: 'ಹಂದಿ ಆರೋಗ್ಯ ಮತ್ತು ರೋಗ ನಿರ್ವಹಣೆ' },
  { id: 'Pig Housing and Farm Hygiene', en: 'Pig Housing and Farm Hygiene', kn: 'ಹಂದಿ ಶೆಡ್ ನಿರ್ಮಾಣ ಮತ್ತು ಫಾರ್ಮ್ ನೈರ್ಮಲ್ಯ' },
  { id: 'Piglet Care and Management', en: 'Piglet Care and Management', kn: 'ಹಂದಿ ಮರಿಗಳ ಆರೈಕೆ ಮತ್ತು ಪಾಲನೆ' },
  { id: 'Pig Fattening and Growth Management', en: 'Pig Fattening and Growth Management', kn: 'ಹಂದಿ ತೂಕ ಹೆಚ್ಚಿಸುವಿಕೆ ಮತ್ತು ಬೆಳವಣಿಗೆ' },
  { id: 'Pig Vaccination and Preventive Care', en: 'Pig Vaccination and Preventive Care', kn: 'ಲಸಿಕೆ ಮತ್ತು ಮುಂಜಾಗ್ರತಾ ಚಿಕಿತ್ಸೆ' },
  { id: 'Pig Waste Management', en: 'Pig Waste Management', kn: 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಗೊಬ್ಬರ ಬಳಕೆ' },
  { id: 'Pig Slaughtering and Meat Processing', en: 'Pig Slaughtering and Meat Processing', kn: 'ಹಂದಿ ಕಡಿಯುವುದು ಮತ್ತು ಸಂಸ್ಕರಣೆ' },
  { id: 'Meat Cutting and Butchering', en: 'Meat Cutting and Butchering', kn: 'ಮಾಂಸ ಕತ್ತರಿಸುವುದು ಮತ್ತು ಬಚರಿಂಗ್' },
  { id: 'Meat Preservation and Storage', en: 'Meat Preservation and Storage', kn: 'ಮಾಂಸ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಶೇಖರಣೆ' },
  { id: 'Meat Packaging and Handling', en: 'Meat Packaging and Handling', kn: 'ಪ್ಯಾಕಿಂಗ್ ಮತ್ತು ನಿರ್ವಹಣೆ' },
  { id: 'Value-Added Pig Meat Products', en: 'Value-Added Pig Meat Products', kn: 'ಮೌಲ್ಯವರ್ಧಿತ ಹಂದಿ ಮಾಂಸ ಉತ್ಪನ್ನಗಳು' },
  { id: 'Marketing and Selling Pig Meat', en: 'Marketing and Selling Pig Meat', kn: 'ಮಾರ್ಕೆಟಿಂಗ್ ಮತ್ತು ಮಾರಾಟ ತಂತ್ರಗಳು' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ' }
];

export const COMMUNITY_OPTIONS = [
  { id: "Handi Jogi's", en: "Handi Jogi's", kn: 'ಹಂದಿ ಜೋಗಿಗಳು' },
  { id: 'Christian', en: 'Christian', kn: 'ಕ್ರೈಸ್ತರು' },
  { id: "Gouda's", en: "Gouda's", kn: 'ಗೌಡರು' },
  { id: "Tamilian's", en: "Tamilian's", kn: 'ತಮಿಳರು' },
  { id: "Reddy's", en: "Reddy's", kn: 'ರೆಡ್ಡಿಗಳು' },
  { id: 'Others', en: 'Others', kn: 'ಇತರರು' }
];

export const HANDI_JOGI_AREA_OPTIONS = [
  { id: 'Anekal', en: 'Anekal', kn: 'ಆನೇಕಲ್' },
  { id: 'Bannerghatta', en: 'Bannerghatta', kn: 'ಬನ್ನೇರುಘಟ್ಟ' },
  { id: 'Bapuji Nagar', en: 'Bapuji Nagar', kn: 'ಬಾಪೂಜಿ ನಗರ' },
  { id: 'Basanapura', en: 'Basanapura', kn: 'ಬಸನಪುರ' },
  { id: 'Bidadi', en: 'Bidadi', kn: 'ಬಿಡದಿ' },
  { id: 'Bidadi - Byramangala', en: 'Bidadi - Byramangala', kn: 'ಬಿಡದಿ - ಬೈರಮಂಗಲ' },
  { id: 'Bidadi - Chatra', en: 'Bidadi - Chatra', kn: 'ಬಿಡದಿ - ಚತ್ರ' },
  { id: 'Bileshivale', en: 'Bileshivale', kn: 'ಬಿಳೇಶಿವಾಲೆ' },
  { id: 'Chandapura', en: 'Chandapura', kn: 'ಚಂದಾಪುರ' },
  { id: 'Devanahalli', en: 'Devanahalli', kn: 'ದೇವನಹಳ್ಳಿ' },
  { id: 'Doddaballapura', en: 'Doddaballapura', kn: 'ದೊಡ್ಡಬಳ್ಳಾಪುರ' },
  { id: 'Gunjur', en: 'Gunjur', kn: 'ಗುಂಜೂರು' },
  { id: 'Halasuru', en: 'Halasuru', kn: 'ಹಲಸೂರು' },
  { id: 'Hebbal', en: 'Hebbal', kn: 'ಹೆಬ್ಬಾಳ' },
  { id: 'Hoodi', en: 'Hoodi', kn: 'ಹೂಡಿ' },
  { id: 'Hoskote', en: 'Hoskote', kn: 'ಹೊಸಕೋಟೆ' },
  { id: 'Hosur (Tamil Nadu)', en: 'Hosur (Tamil Nadu)', kn: 'ಹೊಸೂರು - ತಮಿಳುನಾಡು' },
  { id: 'Huskur', en: 'Huskur', kn: 'ಹುಸ್ಕೂರು' },
  { id: 'Jayanagar', en: 'Jayanagar', kn: 'ಜಯನಗರ' },
  { id: 'Jigani', en: 'Jigani', kn: 'ಜಿಗಣಿ' },
  { id: 'Kammanahalli', en: 'Kammanahalli', kn: 'ಕಮ್ಮನಹಳ್ಳಿ' },
  { id: 'Kengeri', en: 'Kengeri', kn: 'ಕೆಂಗೇರಿ' },
  { id: 'Madapatna', en: 'Madapatna', kn: 'ಮಾದಾಪಟ್ಟಣ' },
  { id: 'Madiwala Check Post', en: 'Madiwala Check Post', kn: 'ಮಾದಿವಾಳ ಚೆಕ್ ಪೋಸ್ಟ್' },
  { id: 'Malur', en: 'Malur', kn: 'ಮಾಲೂರು' },
  { id: 'Nagawara', en: 'Nagawara', kn: 'ನಾಗವಾರ' },
  { id: 'Neleri', en: 'Neleri', kn: 'ನೆಲೇರಿ' },
  { id: 'R.T. Nagar', en: 'R.T. Nagar', kn: 'ಆರ್.ಟಿ. ನಗರ' },
  { id: 'Vijayanagar', en: 'Vijayanagar', kn: 'ವಿಜಯನಗರ' },
  { id: 'Vijayapura', en: 'Vijayapura', kn: 'ವಿಜಯಪುರ' },
  { id: 'Yelahanka', en: 'Yelahanka', kn: 'ಯಲಹಂಕ' },
  { id: 'Yeshwanthpur', en: 'Yeshwanthpur', kn: 'ಯಶವಂತಪುರ' },
  { id: 'Others', en: 'Others', kn: 'ಇತರರು' }
];

export const SHOP_OWNERSHIP_OPTIONS = [
  { id: 'Own shop', en: 'Own shop', kn: 'ಸ್ವಂತ ಅಂಗಡಿ (Own shop)' },
  { id: 'Rent-shop', en: 'Rent-shop', kn: 'ಬಾಡಿಗೆ ಅಂಗಡಿ (Rent-shop)' },
  { id: 'Lease', en: 'Lease', kn: 'ಲೀಸ್ / ಗುತ್ತಿಗೆ (Lease)' },
  { id: 'Other', en: 'Other', kn: 'ಇತರೆ (Other)' }
];

export const UNSOLD_MEAT_OPTIONS = [
  { id: 'Returned to the wholesale dealer', en: 'Returned to the wholesale dealer', kn: 'ಸಗಟು ವ್ಯಾಪಾರಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಗುತ್ತದೆ (Wholesale dealer)' },
  { id: 'Stored in a refrigerator/freezer', en: 'Stored in a refrigerator/freezer', kn: 'ರೆಫ್ರಿಜರೇಟರ್ / ಫ್ರೀಜರ್‌ನಲ್ಲಿ ಶೇಖರಿಸಲಾಗುತ್ತದೆ (Fridge/Freezer)' },
  { id: 'Sold at a discounted price', en: 'Sold at a discounted price', kn: 'ರಿಯಾಯಿತಿ ದರದಲ್ಲಿ ಮಾರಾಟ (Discounted price)' },
  { id: 'Processed into other meat products', en: 'Processed into other meat products', kn: 'ಇತರ ಮಾಂಸ ಉತ್ಪನ್ನಗಳಾಗಿ ಸಂಸ್ಕರಣೆ ಮಾಡಲಾಗುತ್ತದೆ' },
  { id: 'Disposed of', en: 'Disposed of', kn: 'ವಿಲೇವಾರಿ ಮಾಡಲಾಗುತ್ತದೆ (Disposed of)' },
  { id: 'Supplied to hotels', en: 'Supplied to hotels', kn: 'ಹೋಟೆಲ್‌ಗಳಿಗೆ ಸರಬರಾಜು ಮಾಡಲಾಗುತ್ತದೆ (Supplied to hotels)' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ ವಿಧಾನ' }
];

export const STORAGE_CAPACITY_OPTIONS = [
  { id: 'Less than 10 kg', en: 'Less than 10 kg', kn: '10 ಕೆಜಿಗಿಂತ ಕಡಿಮೆ (< 10 kg)' },
  { id: '10–25 kg', en: '10–25 kg', kn: '10–25 ಕೆಜಿ' },
  { id: '26–50 kg', en: '26–50 kg', kn: '26–50 ಕೆಜಿ' },
  { id: '51–100 kg', en: '51–100 kg', kn: '51–100 ಕೆಜಿ' },
  { id: '101–250 kg', en: '101–250 kg', kn: '101–250 ಕೆಜಿ' },
  { id: 'More than 250 kg', en: 'More than 250 kg', kn: '250 ಕೆಜಿಗಿಂತ ಹೆಚ್ಚು (> 250 kg)' },
  { id: 'No storage facility', en: 'No storage facility', kn: 'ಯಾವುದೇ ಶೇಖರಣಾ ಸೌಲಭ್ಯವಿಲ್ಲ (No storage)' }
];

export const MEAT_CUTS_OPTIONS = [
  { id: 'Shoulder', en: 'Shoulder', kn: 'ಭುಜದ ಭಾಗ (Shoulder)' },
  { id: 'Thigh', en: 'Thigh', kn: 'ತೊಡೆಯ ಭಾಗ (Thigh)' },
  { id: 'Leg', en: 'Leg', kn: 'ಕಾಲಿನ ಭಾಗ (Leg)' },
  { id: 'Belly', en: 'Belly', kn: 'ಹೊಟ್ಟೆಯ ಭಾಗ (Belly)' },
  { id: 'Ribs', en: 'Ribs', kn: 'ಪಕ್ಕೆಲುಬುಗಳು (Ribs)' },
  { id: 'Head', en: 'Head', kn: 'ತಲೆಯ ಭಾಗ (Head)' },
  { id: 'Loin', en: 'Loin', kn: 'ಬೆನ್ನಿನ ಮಾಂಸ (Loin)' },
  { id: 'Chops', en: 'Chops', kn: 'ಚಾಪ್ಸ್ (Chops)' },
  { id: 'Feet / Trotters', en: 'Feet / Trotters', kn: 'ಕಾಲುಗಳು / ಖುರಾಗಳು (Trotters)' },
  { id: 'Liver', en: 'Liver', kn: 'ಲಿವರ್ / ಯಕೃತ್ತು (Liver)' },
  { id: 'Heart', en: 'Heart', kn: 'ಗುಂಡಿಗೆ / ಹೃದಯ (Heart)' },
  { id: 'Kidney', en: 'Kidney', kn: 'ಮೂತ್ರಪಿಂಡ / ಕಿಡ್ನಿ (Kidney)' },
  { id: 'No idea', en: 'No idea', kn: 'ಮಾಹಿತಿ ಇಲ್ಲ / ಗೊತ್ತಿಲ್ಲ (No idea)' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ ಭಾಗಗಳು' }
];

export const PROCUREMENT_SOURCE_OPTIONS = [
  { id: 'Local wholesale market', en: 'Local wholesale market', kn: 'ಸ್ಥಳೀಯ ಸಗಟು ಮಾರುಕಟ್ಟೆ (Local wholesale)' },
  { id: 'Nearby meat wholesale shop', en: 'Nearby meat wholesale shop', kn: 'ಹತ್ತಿರದ ಮಾಂಸ ಸಗಟು ಅಂಗಡಿ' },
  { id: 'Slaughterhouse / Abattoir', en: 'Slaughterhouse / Abattoir', kn: 'ವಧ್ಯಗೃಹ / ಕಸಾಯಿಖಾನೆ (Slaughterhouse)' },
  { id: 'Directly from pig farmers', en: 'Directly from pig farmers', kn: 'ನೇರವಾಗಿ ಹಂದಿ ಸಾಕಣೆದಾರರಿಂದ' },
  { id: 'Meat processing unit', en: 'Meat processing unit', kn: 'ಮಾಂಸ ಸಂಸ್ಕರಣಾ ಘಟಕ (Processing unit)' },
  { id: 'Distributor / Supplier', en: 'Distributor / Supplier', kn: 'ಡಿಸ್ಟ್ರಿಬ್ಯೂಟರ್ / ಪೂರೈಕೆದಾರ' },
  { id: 'Agricultural / Livestock market', en: 'Agricultural / Livestock market', kn: 'ಕೃಷಿ / ಜಾನುವಾರು ಮಾರುಕಟ್ಟೆ' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ ಮೂಲ' }
];

export const PROCUREMENT_FREQUENCY_OPTIONS = [
  { id: 'Daily', en: 'Daily', kn: 'ಪ್ರತಿದಿನ (Daily)' },
  { id: '2–3 times a week', en: '2–3 times a week', kn: 'ವಾರಕ್ಕೆ 2–3 ಬಾರಿ' },
  { id: 'Once a week', en: 'Once a week', kn: 'ವಾರಕ್ಕೆ ಒಮ್ಮೆ (Weekly)' },
  { id: '2–3 times a month', en: '2–3 times a month', kn: 'ತಿಂಗಳಿಗೆ 2–3 ಬಾರಿ' },
  { id: 'Once a month', en: 'Once a month', kn: 'ತಿಂಗಳಿಗೆ ಒಮ್ಮೆ (Monthly)' },
  { id: 'Less than once a month', en: 'Less than once a month', kn: 'ತಿಂಗಳಿಗೆ ಒಮ್ಮೆಗಿಂತ ಕಡಿಮೆ' },
  { id: 'As per demand / requirement', en: 'As per demand / requirement', kn: 'ಬೇಡಿಕೆ ಆಧಾರದ ಮೇಲೆ (On demand)' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ' }
];

export const PROCUREMENT_QUANTITY_OPTIONS = [
  { id: 'Less than 10 kg', en: 'Less than 10 kg', kn: '10 ಕೆಜಿಗಿಂತ ಕಡಿಮೆ' },
  { id: '10–25 kg', en: '10–25 kg', kn: '10–25 ಕೆಜಿ' },
  { id: '26–50 kg', en: '26–50 kg', kn: '26–50 ಕೆಜಿ' },
  { id: '51–100 kg', en: '51–100 kg', kn: '51–100 ಕೆಜಿ' },
  { id: '101–250 kg', en: '101–250 kg', kn: '101–250 ಕೆಜಿ' },
  { id: '251–500 kg', en: '251–500 kg', kn: '251–500 ಕೆಜಿ' },
  { id: 'More than 500 kg', en: 'More than 500 kg', kn: '500 ಕೆಜಿಗಿಂತ ಹೆಚ್ಚು' },
  { id: 'Quantity varies based on demand', en: 'Quantity varies based on demand', kn: 'ಬೇಡಿಕೆ ಆಧಾರದ ಮೇಲೆ ಬದಲಾಗುತ್ತದೆ' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ' }
];

export const BILLING_OPTIONS = [
  { id: 'Yes, for every purchase', en: 'Yes, for every purchase', kn: 'ಹೌದು, ಪ್ರತಿ ಖರೀದಿಗೂ ರಸೀದಿ ನೀಡಲಾಗುತ್ತದೆ' },
  { id: 'Yes, only when requested', en: 'Yes, only when requested by the customer', kn: 'ಹೌದು, ಗ್ರಾಹಕ ಕೇಳಿದಾಗ ಮಾತ್ರ' },
  { id: 'No', en: 'No', kn: 'ಇಲ್ಲ (No bill provided)' },
  { id: 'Sometimes', en: 'Sometimes', kn: 'ಕೆಲವೊಮ್ಮೆ (Sometimes)' }
];

export const BUSINESS_CHALLENGE_OPTIONS = [
  { id: 'Difficulty in sourcing quality pork', en: 'Difficulty in sourcing quality pork', kn: 'ಗುಣಮಟ್ಟದ ಹಂದಿ ಮಾಂಸ ಪಡೆಯಲು ತೊಂದರೆ' },
  { id: 'High procurement cost', en: 'High procurement cost', kn: 'ಹೆಚ್ಚಿನ ಖರೀದಿ ವೆಚ್ಚ (High procurement cost)' },
  { id: 'Low customer demand', en: 'Low customer demand', kn: 'ಕಡಿಮೆ ಗ್ರಾಹಕ ಬೇಡಿಕೆ (Low demand)' },
  { id: 'Price fluctuations', en: 'Price fluctuations', kn: 'ಬೆಲೆ ಏರಿಳಿತ (Price fluctuations)' },
  { id: 'Unsold meat / wastage', en: 'Unsold meat / wastage', kn: 'ಮಾರಾಟವಾಗದ ಮಾಂಸ / ಪೋಲು (Wastage)' },
  { id: 'Lack of cold storage facilities', en: 'Lack of cold storage facilities', kn: 'ಶೀತಲ ಸಂಗ್ರಹ ಸೌಲಭ್ಯದ ಕೊರತೆ' },
  { id: 'Lack of working capital', en: 'Lack of working capital', kn: 'ಕಾರ್ಯ ಬಂಡವಾಳದ ಕೊರತೆ (Working capital)' },
  { id: 'Transportation issues', en: 'Transportation issues', kn: 'ಸಾರಿಗೆ ತೊಂದರೆಗಳು (Transportation)' },
  { id: 'Lack of skilled workers', en: 'Lack of skilled workers', kn: 'ನುರಿತ ಕಾರ್ಮಿಕರ ಕೊರತೆ (Skilled workers)' },
  { id: 'Meat quality or hygiene issues', en: 'Meat quality or hygiene issues', kn: 'ಮಾಂಸದ ಗುಣಮಟ್ಟ / ನೈರ್ಮಲ್ಯ ಸಮಸ್ಯೆ' },
  { id: 'Difficulty in maintaining records/billing', en: 'Difficulty in maintaining proper records/billing', kn: 'ಲೆಕ್ಕಪತ್ರ ನಿರ್ವಹಣೆ / ಬಿಲ್ಲಿಂಗ್ ತೊಂದರೆ' },
  { id: 'Competition from other shops', en: 'Competition from other shops', kn: 'ಇತರ ಅಂಗಡಿಗಳಿಂದ ಪ್ರತಿಸ್ಪರ್ಧೆ (Competition)' },
  { id: 'Lack of market information', en: 'Lack of market information', kn: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿಯ ಕೊರತೆ' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ ಸಮಸ್ಯೆ' }
];
