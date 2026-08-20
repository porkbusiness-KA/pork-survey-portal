export const DISTRICTS = [
  { id: 'Bengaluru Urban', en: 'Bengaluru Urban', kn: 'ಬೆಂಗಳೂರು ನಗರ' },
  { id: 'Bengaluru Rural', en: 'Bengaluru Rural', kn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ' },
  { id: 'Kolar District', en: 'Kolar District', kn: 'ಕೋಲಾರ ಜಿಲ್ಲೆ' },
  { id: 'Ramanagara District', en: 'Ramanagara District', kn: 'ರಾಮನಗರ ಜಿಲ್ಲೆ' },
  { id: 'Other District', en: 'Other District', kn: 'ಇತರ ಜಿಲ್ಲೆ' }
];

// Curated Karnataka Pincode Lookup (Instant Offline Cache)
export const PINCODE_DATABASE = {
  '560001': { district: 'Bengaluru Urban', place: 'MG Road / Shivaji Nagar', areas: ['MG Road', 'Cubbon Park', 'Shivajinagar'], lat: 12.9756, lng: 77.6067 },
  '560005': { district: 'Bengaluru Urban', place: 'Frazer Town / Pulakeshinagar', areas: ['Frazer Town', 'Pulakeshinagar', 'Cox Town'], lat: 12.9982, lng: 77.6154 },
  '560008': { district: 'Bengaluru Urban', place: 'Halasuru / Ulsoor', areas: ['Halasuru', 'Ulsoor', 'Someshwarapura'], lat: 12.9814, lng: 77.6254 },
  '560025': { district: 'Bengaluru Urban', place: 'Austin Town / Richmond Town', areas: ['Austin Town', 'Richmond Town', 'Neelasandra'], lat: 12.9632, lng: 77.6135 },
  '560034': { district: 'Bengaluru Urban', place: 'Koramangala I Block', areas: ['Koramangala 1st Block', 'Madiwala', 'St. Johns'], lat: 12.9279, lng: 77.6271 },
  '560038': { district: 'Bengaluru Urban', place: 'Indiranagar', areas: ['Indiranagar 100ft Road', 'HAL 2nd Stage', 'Defence Colony'], lat: 12.9784, lng: 77.6408 },
  '560047': { district: 'Bengaluru Urban', place: 'Viveknagar / Ejipura', areas: ['Viveknagar', 'Ejipura', 'Vannarpet'], lat: 12.9465, lng: 77.6212 },
  '560051': { district: 'Bengaluru Urban', place: 'Shivajinagar Market / Broadway', areas: ['Shivajinagar Market', 'Tasker Town', 'Broadway'], lat: 12.9856, lng: 77.6057 },
  '560064': { district: 'Bengaluru Urban', place: 'Yelahanka Satellite Town', areas: ['Yelahanka Satellite Town', 'Attur', 'Kogilu'], lat: 13.1007, lng: 77.5963 },
  '560068': { district: 'Bengaluru Urban', place: 'Bommanahalli / Electronic City Link', areas: ['Bommanahalli', 'Begur', 'Hongasandra'], lat: 12.9038, lng: 77.6247 },
  '560095': { district: 'Bengaluru Urban', place: 'Koramangala 5th Block', areas: ['Koramangala 5th Block', 'Koramangala 4th Block', 'National Games Village'], lat: 12.9352, lng: 77.6245 },
  '562114': { district: 'Bengaluru Rural', place: 'Hoskote Town', areas: ['Hoskote Town', 'Doddagattiganabbe', 'Kambalipura'], lat: 13.0700, lng: 77.7981 },
  '562123': { district: 'Bengaluru Rural', place: 'Nelamangala Main Road', areas: ['Nelamangala Town', 'Arasinakunte', 'Sompura'], lat: 13.0987, lng: 77.3912 },
  '562110': { district: 'Bengaluru Rural', place: 'Devanahalli Town', areas: ['Devanahalli', 'Binnamangala', 'Vijayapura'], lat: 13.2458, lng: 77.7126 },
  '562120': { district: 'Bengaluru Rural', place: 'Doddaballapura', areas: ['Doddaballapura Town', 'Kasaba', 'Tubagere'], lat: 13.2933, lng: 77.5342 },
  '563101': { district: 'Kolar District', place: 'Kolar Town', areas: ['Kolar Main Market', 'Fort Area', 'Gulpet'], lat: 13.1367, lng: 78.1291 },
  '563114': { district: 'Kolar District', place: 'Bangarapet', areas: ['Bangarapet Main', 'Desihalli', 'Kammasandra'], lat: 12.9800, lng: 78.1900 },
  '563122': { district: 'Kolar District', place: 'Robertsonpet, KGF', areas: ['Robertsonpet', 'Champion Reefs', 'Oorgaum', 'Marikuppam'], lat: 12.9592, lng: 78.2723 },
  '563130': { district: 'Kolar District', place: 'Malur Town', areas: ['Malur', 'Chikka Tirupathi', 'Lakkur'], lat: 13.0033, lng: 77.9400 },
  '562159': { district: 'Ramanagara District', place: 'Ramanagara Town', areas: ['Ramanagara Main', 'Ijoor', 'Vaderahalli'], lat: 12.7209, lng: 77.2799 },
  '562160': { district: 'Ramanagara District', place: 'Channapatna', areas: ['Channapatna Town', 'Mankunda', 'Honganoor'], lat: 12.6518, lng: 77.2089 },
  '562117': { district: 'Ramanagara District', place: 'Kanakapura', areas: ['Kanakapura Main', 'Harohalli', 'Sathnoor'], lat: 12.5463, lng: 77.4199 },
  '562128': { district: 'Ramanagara District', place: 'Magadi Town', areas: ['Magadi', 'Kudur', 'Tavarekere'], lat: 12.9567, lng: 77.2289 }
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

export const PROCESSED_VOLUME_OPTIONS = ['<1 Kg', '<3 Kg', '<5 Kg', '>5 Kg', '>10 Kg'];

export const PROCESSED_PRODUCT_TYPES = ['Ham', 'Bacon', 'Salami', 'Pepperoni', 'Sausage', 'Others'];

export const CUSTOMER_TYPE_OPTIONS = [
  { id: 'Localities', en: 'Localities', kn: 'ಸ್ಥಳೀಯರು' },
  { id: 'Non-Localities', en: 'Non-Localities', kn: 'ಸ್ಥಳೀಯರಲ್ಲದವರು' },
  { id: 'Both localities and non-Localities', en: 'Both localities and non-Localities', kn: 'ಸ್ಥಳೀಯರು ಮತ್ತು ಅನ್ಯರು ಇಬ್ಬರೂ' }
];

export const MASALA_OPTIONS = [
  { id: 'Chandrakala masala', en: 'Chandrakala masala', kn: 'ಚಂದ್ರಕಲಾ ಮಸಾಲಾ' },
  { id: 'Jeevith masala', en: 'Jeevith masala', kn: 'ಜೀವಿತ ಮಸಾಲಾ' },
  { id: 'Both Chandrakala and Jeevith masala', en: 'Both Chandrakala and Jeevith masala', kn: 'ಚಂದ್ರಕಲಾ ಮತ್ತು ಜೀವಿತ ಎರಡೂ' },
  { id: 'Other', en: 'Other', kn: 'ಇತರ ಮಸಾಲಾ' }
];
