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
  { id: 'Whole pig', en: 'Whole pig', kn: 'ಸಂಪೂರ್ಣ ಹಂದಿ' },
  { id: 'Both fresh meat, processed meat products and whole pig (Pork)', en: 'Both fresh meat, processed meat products and whole pig (Pork)', kn: 'ತಾಜಾ ಮಾಂಸ, ಸಂಸ್ಕರಿಸಿದ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಸಂಪೂರ್ಣ ಹಂದಿ' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ' }
];

export const PROCESSED_VOLUME_OPTIONS = ['<1 Kg', '<3 Kg', '<5 Kg', '>5 Kg', '>10 Kg', 'Other'];

export const PROCESSED_PRODUCT_TYPES = [
  'Ham',
  'Bacon',
  'Salami',
  'Pepperoni',
  'Sausage',
  'Ham & Bacon',
  'All Varieties (Ham, Bacon, Salami, Pepperoni, Sausage)',
  'Others'
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
