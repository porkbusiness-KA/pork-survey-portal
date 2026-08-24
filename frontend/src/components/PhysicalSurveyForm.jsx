import React from 'react';
import { Printer, ArrowLeft, Download, FileText, CheckSquare, Sparkles } from 'lucide-react';
import {
  COMMUNITY_OPTIONS, HANDI_JOGI_AREA_OPTIONS, HOLIDAY_OPTIONS,
  PEAK_DAY_OPTIONS, MEAT_TYPES_OPTIONS, PROCESSED_PRODUCT_TYPES,
  CUSTOMER_TYPE_OPTIONS, MASALA_OPTIONS, SPOC_SKILL_OPTIONS,
  SHOP_OWNERSHIP_OPTIONS, MEAT_CUTS_OPTIONS, UNSOLD_MEAT_OPTIONS,
  STORAGE_CAPACITY_OPTIONS, PROCUREMENT_SOURCE_OPTIONS,
  PROCUREMENT_FREQUENCY_OPTIONS, PROCUREMENT_QUANTITY_OPTIONS,
  BILLING_OPTIONS, BUSINESS_CHALLENGE_OPTIONS, TRAINING_SKILL_OPTIONS
} from '../data/surveyQuestions';

export default function PhysicalSurveyForm({ onBackToForm }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="physical-form-wrapper" style={{ minHeight: '100vh', background: '#f8fafc', padding: '1.5rem 1rem' }}>
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print" style={{
        maxWidth: '900px',
        margin: '0 auto 1.5rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#ffffff',
        padding: '1rem 1.5rem',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onBackToForm}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Portal</span>
          </button>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
              📄 Printable Physical Questionnaire
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              Bilingual (English + ಕನ್ನಡ) Field Survey Form (A4 Ready)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.4rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
            }}
          >
            <Printer size={18} />
            <span>Print Form / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 Paper Styling) */}
      <div className="printable-sheet" style={{
        maxWidth: '850px',
        margin: '0 auto',
        background: '#ffffff',
        padding: '2.5rem 3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
        color: '#000000',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        fontSize: '13px',
        lineHeight: '1.45'
      }}>
        {/* Document Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: '#475569' }}>
            DEPARTMENT OF ANIMAL HUSBANDRY & VETERINARY SERVICES / RESEARCH STUDY
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Pork Retail Shop & Business Survey Questionnaire
          </h1>
          <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '2px 0', color: '#334155' }}>
            ಹಂದಿ ಮಾಂಸ ಮಾರಾಟ ಮಳಿಗೆ ಮತ್ತು ವ್ಯಾಪಾರ ಸಮೀಕ್ಷಾ ನಮೂನೆ
          </h2>
          <div style={{ fontSize: '11px', marginTop: '4px', color: '#64748b' }}>
            State: Karnataka (ಕರ್ನಾಟಕ) | District Focus: Bengaluru Urban, Rural, Kolar, Ramanagara
          </div>

          {/* Surveyor Meta Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            marginTop: '1rem',
            padding: '0.5rem',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'left'
          }}>
            <div><strong>Survey / Shop ID:</strong> _________________</div>
            <div><strong>Survey Date (ದಿನಾಂಕ):</strong> _____ / _____ / 2026</div>
            <div><strong>Surveyor Name (ಸಮೀಕ್ಷಕರು):</strong> _________________</div>
          </div>
        </div>

        {/* SECTION 1: GEOGRAPHIC LOCATION */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            1. Geographic Location Details (ಭೌಗೋಳಿಕ ವಿವರಗಳು)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <strong>1. Pincode (ಪಿನ್‌ಕೋಡ್):</strong>{' '}
              <span style={{ display: 'inline-block', minWidth: '160px', borderBottom: '1px solid #000', height: '18px' }}></span>
            </div>
            <div><strong>2. Country (ದೇಶ):</strong> [ ✓ ] India &nbsp;&nbsp; [ &nbsp; ] Other: <span style={{ display: 'inline-block', minWidth: '100px', borderBottom: '1px solid #000', height: '18px' }}></span></div>
            <div><strong>3. State (ರಾಜ್ಯ):</strong> [ ✓ ] Karnataka &nbsp;&nbsp; [ &nbsp; ] Other: <span style={{ display: 'inline-block', minWidth: '100px', borderBottom: '1px solid #000', height: '18px' }}></span></div>
            <div><strong>4. District (ಜಿಲ್ಲೆ):</strong> [ &nbsp; ] Bengaluru Urban &nbsp; [ &nbsp; ] Bengaluru Rural &nbsp; [ &nbsp; ] Kolar &nbsp; [ &nbsp; ] Ramanagara &nbsp; [ &nbsp; ] Other: <span style={{ display: 'inline-block', minWidth: '80px', borderBottom: '1px solid #000', height: '18px' }}></span></div>
            <div><strong>5. Taluk / Block (ತಾಲ್ಲೂಕು):</strong> <span style={{ display: 'inline-block', minWidth: '180px', borderBottom: '1px solid #000', height: '18px' }}></span></div>
            <div><strong>6. Village / Town / Ward (ಗ್ರಾಮ / ಪಟ್ಟಣ):</strong> <span style={{ display: 'inline-block', minWidth: '180px', borderBottom: '1px solid #000', height: '18px' }}></span></div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>7. Complete Shop Address (ಅಂಗಡಿಯ ಸಂಪೂರ್ಣ ವಿಳಾಸ):</strong><br />
              <div style={{ borderBottom: '1px solid #000', height: '22px', marginTop: '2px' }}></div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SHOP & OWNER INFORMATION */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            2. Shop & Owner Information (ಅಂಗಡಿ ಮತ್ತು ಮಾಲೀಕರ ವಿವರಗಳು)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div><strong>8. Name of Pork Shop (ಅಂಗಡಿಯ ಹೆಸರು):</strong><br /><div style={{ borderBottom: '1px solid #000', height: '22px', marginTop: '2px' }}></div></div>
            <div><strong>9. Shop Owner Name (ಮಾಲೀಕರ ಹೆಸರು):</strong><br /><div style={{ borderBottom: '1px solid #000', height: '22px', marginTop: '2px' }}></div></div>
            <div><strong>10. Owner Mobile No (ಮೊಬೈಲ್ ಸಂಖ್ಯೆ):</strong><br /><div style={{ borderBottom: '1px solid #000', height: '22px', marginTop: '2px', maxWidth: '240px' }}></div></div>
            <div><strong>11. Owner Email ID (ಇಮೇಲ್ ಐಡಿ - ಐಚ್ಛಿಕ):</strong><br /><div style={{ borderBottom: '1px solid #000', height: '22px', marginTop: '2px' }}></div></div>
            <div><strong>12. Years in Business (ಅಂಗಡಿ ಎಷ್ಟು ವರ್ಷದಿಂದ ಇದೆ?):</strong> <span style={{ display: 'inline-block', minWidth: '80px', borderBottom: '1px solid #000', height: '18px' }}></span> Years (ವರ್ಷಗಳು)</div>
            <div>
              <strong>13. Shop Owner's Community (ಮಾಲೀಕರ ಸಮುದಾಯ):</strong><br />
              [ &nbsp; ] Handi Jogi's (ಹಂದಿ ಜೋಗಿಗಳು)<br />
              [ &nbsp; ] Christian (ಕ್ರೈಸ್ತರು)<br />
              [ &nbsp; ] Gouda's (ಗೌಡರು)<br />
              [ &nbsp; ] Tamilian's (ತಮಿಳರು)<br />
              [ &nbsp; ] Reddy's (ರೆಡ್ಡಿಗಳು)<br />
              [ &nbsp; ] Others (ಇತರರು): __________________
            </div>
            <div style={{ gridColumn: 'span 2', padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <strong>14. Area / Location (ಪ್ರದೇಶ/ಸ್ಥಳ) — <em>If Handi Jogi's selected</em>:</strong><br />
              <span style={{ fontSize: '11.5px', color: '#334155' }}>
                [ &nbsp; ] Anekal &nbsp; [ &nbsp; ] Bannerghatta &nbsp; [ &nbsp; ] Bapuji Nagar &nbsp; [ &nbsp; ] Basanapura &nbsp; [ &nbsp; ] Bidadi &nbsp; [ &nbsp; ] Bidadi - Byramangala &nbsp; [ &nbsp; ] Bidadi - Chatra &nbsp; [ &nbsp; ] Bileshivale &nbsp; [ &nbsp; ] Chandapura &nbsp; [ &nbsp; ] Devanahalli &nbsp; [ &nbsp; ] Doddaballapura &nbsp; [ &nbsp; ] Electronic City &nbsp; [ &nbsp; ] Goripalya &nbsp; [ &nbsp; ] Harohalli &nbsp; [ &nbsp; ] Hegganahalli &nbsp; [ &nbsp; ] Hoskote &nbsp; [ &nbsp; ] Jigani &nbsp; [ &nbsp; ] Kamakshipalya &nbsp; [ &nbsp; ] Kengeri &nbsp; [ &nbsp; ] KGF &nbsp; [ &nbsp; ] Kolar &nbsp; [ &nbsp; ] Magadi &nbsp; [ &nbsp; ] Malur &nbsp; [ &nbsp; ] Nelamangala &nbsp; [ &nbsp; ] Peenya &nbsp; [ &nbsp; ] Ramanagara &nbsp; [ &nbsp; ] Sarjapura &nbsp; [ &nbsp; ] Shivajinagar &nbsp; [ &nbsp; ] Singasandra &nbsp; [ &nbsp; ] Sumanahalli &nbsp; [ &nbsp; ] Tavarekere &nbsp; [ &nbsp; ] Whitefield &nbsp; [ &nbsp; ] Yeshwanthpur &nbsp; [ &nbsp; ] Other: ______________
              </span>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
              <strong>15. Contact Person(s) / SPOC Details & Skills (ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಗಳ ವಿವರಗಳು - ಐಚ್ಛಿಕ):</strong>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px', fontSize: '11.5px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ border: '1px solid #94a3b8', padding: '4px 6px', width: '35px', textAlign: 'center' }}>Sl</th>
                    <th style={{ border: '1px solid #94a3b8', padding: '4px 6px', textAlign: 'left' }}>SPOC Full Name (ಪೂರ್ಣ ಹೆಸರು)</th>
                    <th style={{ border: '1px solid #94a3b8', padding: '4px 6px', textAlign: 'left', width: '140px' }}>Mobile No (ಮೊಬೈಲ್)</th>
                    <th style={{ border: '1px solid #94a3b8', padding: '4px 6px', textAlign: 'left' }}>Role / Skills (ಪಾತ್ರ / ಕೌಶಲ್ಯಗಳು)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px', textAlign: 'center' }}>1</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px' }}></td>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px' }}></td>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px' }}>[ &nbsp; ] Butchery &nbsp; [ &nbsp; ] Sales &nbsp; [ &nbsp; ] Sourcing &nbsp; [ &nbsp; ] Other</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px', textAlign: 'center' }}>2</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px' }}></td>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px' }}></td>
                    <td style={{ border: '1px solid #94a3b8', padding: '6px' }}>[ &nbsp; ] Butchery &nbsp; [ &nbsp; ] Sales &nbsp; [ &nbsp; ] Sourcing &nbsp; [ &nbsp; ] Other</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: OPERATING HOURS & HOLIDAYS */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            3. Operating Hours & Weekly Holidays (ವ್ಯವಹಾರದ ಸಮಯ ಮತ್ತು ರಜೆ)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div><strong>16. Opening Time (ತೆರೆಯುವ ಸಮಯ):</strong> ______ : ______ AM / PM</div>
            <div><strong>17. Closing Time (ಮುಚ್ಚುವ ಸಮಯ):</strong> ______ : ______ AM / PM</div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>18. On which day the shop will be holiday? (ಯಾವ ದಿನ ಅಂಗಡಿಗೆ ರಜೆ?):</strong><br />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '3px' }}>
                {HOLIDAY_OPTIONS.map(h => (
                  <span key={h.id}>[ &nbsp; ] {h.en} ({h.kn})</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 & 5: WORKERS, FOOTFALL & OWNERSHIP */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            4 & 5. Workers, Customer Footfall & Shop Ownership (ಕಾರ್ಮಿಕರು, ಗ್ರಾಹಕರು ಮತ್ತು ಮಾಲೀಕತ್ವ)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <strong>19. Workers in Shop (ಕಾರ್ಮಿಕರ ಸಂಖ್ಯೆ):</strong><br />
              [ &nbsp; ] 1 &nbsp;&nbsp; [ &nbsp; ] 2 &nbsp;&nbsp; [ &nbsp; ] 3 &nbsp;&nbsp; [ &nbsp; ] 4 &nbsp;&nbsp; [ &nbsp; ] 5 &nbsp;&nbsp; [ &nbsp; ] Other: ____
            </div>
            <div>
              <strong>20. Daily Customer Visits (ದೈನಂದಿನ ಗ್ರಾಹಕರು):</strong><br />
              [ &nbsp; ] 1–10 &nbsp; [ &nbsp; ] 10–20 &nbsp; [ &nbsp; ] 20–30 &nbsp; [ &nbsp; ] 30–50 &nbsp; [ &nbsp; ] 50–100 &nbsp; [ &nbsp; ] &gt;100
            </div>
            <div>
              <strong>21. Peak Customer Day (ಹೆಚ್ಚು ಗ್ರಾಹಕರು ಬರುವ ದಿನ):</strong><br />
              [ &nbsp; ] Mon &nbsp; [ &nbsp; ] Tue &nbsp; [ &nbsp; ] Wed &nbsp; [ &nbsp; ] Thu &nbsp; [ &nbsp; ] Fri &nbsp; [ &nbsp; ] Sat &nbsp; [ &nbsp; ] Sun &nbsp; [ &nbsp; ] All days
            </div>
            <div>
              <strong>22. Shop Ownership Status (ಮಾಲೀಕತ್ವದ ಸ್ಥಿತಿ):</strong><br />
              [ &nbsp; ] Rented (ಬಾಡಿಗೆ) &nbsp;&nbsp; [ &nbsp; ] Leased (ಲೀಸ್) &nbsp;&nbsp; [ &nbsp; ] Owned (ಸ್ವಂತ) &nbsp;&nbsp; [ &nbsp; ] Other: ______
            </div>
          </div>
        </div>

        {/* SECTION 6: MEAT PRODUCTS, PRICING & SALES */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            6. Meat Products, Pricing & Sales Volume (ಮಾಂಸದ ವಿಧಗಳು, ದರ ಮತ್ತು ಮಾರಾಟ)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div><strong>23. Regular Meat Rate (ಸಾಮಾನ್ಯ ಮಾಂಸದ ದರ):</strong> ₹ ____________ / Kg</div>
            <div><strong>24. Average Daily Meat Sale (ದಿನದ ಸರಾಸರಿ ಮಾರಾಟ):</strong> ____________ Kg / day</div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>25. What types of meat available in shop? (ಲಭ್ಯವಿರುವ ಮಾಂಸದ ವಿಧಗಳು?):</strong><br />
              [ &nbsp; ] Fresh meat (Pork) (ತಾಜಾ ಮಾಂಸ) &nbsp;&nbsp;
              [ &nbsp; ] Processed meat products (ಸಂಸ್ಕರಿಸಿದ ಮಾಂಸ) &nbsp;&nbsp;
              [ &nbsp; ] Whole live pig (ಜೀವಂತ ಹಂದಿ) &nbsp;&nbsp;
              [ &nbsp; ] All (ಎಲ್ಲವೂ) &nbsp;&nbsp;
              [ &nbsp; ] Other: ____________
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>26. Processed Meat Consumption per Week (ಸಂಸ್ಕರಿಸಿದ ಉತ್ಪನ್ನಗಳ ಬಳಕೆ):</strong> &nbsp;&nbsp; [ &nbsp; ] None (ಯಾವುದೂ ಇಲ್ಲ)<br />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 8px', marginTop: '4px', fontSize: '11.5px' }}>
                <div>• Ham (ಹ್ಯಾಮ್): [ ] &lt;1Kg [ ] &lt;3Kg [ ] &gt;5Kg</div>
                <div>• Bacon (ಬೇಕನ್): [ ] &lt;1Kg [ ] &lt;3Kg [ ] &gt;5Kg</div>
                <div>• Salami (ಸಲಾಮಿ): [ ] &lt;1Kg [ ] &lt;3Kg [ ] &gt;5Kg</div>
                <div>• Pepperoni (ಪೆಪ್ಪೆರೋನಿ): [ ] &lt;1Kg [ ] &lt;3Kg [ ] &gt;5Kg</div>
                <div>• Sausage (ಸಾಸೇಜ್): [ ] &lt;1Kg [ ] &lt;3Kg [ ] &gt;5Kg</div>
                <div>• Other: ______________________</div>
              </div>
            </div>
            <div>
              <strong>27. Customer Profile (ಗ್ರಾಹಕರ ಪ್ರಕಾರ):</strong><br />
              [ &nbsp; ] Localities (ಸ್ಥಳೀಯರು) &nbsp;&nbsp; [ &nbsp; ] Non-Localities (ಸ್ಥಳೀಯರಲ್ಲದವರು) &nbsp;&nbsp; [ &nbsp; ] Both (ಇಬ್ಬರೂ)
            </div>
            <div>
              <strong>28. Does shop sell pork fry & food? (ಹಂದಿ ಫ್ರೈ ಮತ್ತು ಆಹಾರ ಲಭ್ಯವಿದೆಯೇ?):</strong><br />
              [ &nbsp; ] Yes (ಹೌದು) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] No (ಇಲ್ಲ)<br />
              <em>If Yes, <strong>29. Quantity (ಎಷ್ಟು ಕಿಲೋ):</strong></em> _________ Kg/day
            </div>
          </div>
        </div>

        {/* SECTION 7: MEAT CUTS, STORAGE & UNSOLD MEAT */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            7. Meat Cuts, Unsold Meat & Storage (ಭಾಗಗಳು, ಮಾರಾಟವಾಗದ ಮಾಂಸ ಮತ್ತು ಶೇಖರಣೆ)
          </div>
          <div style={{ marginBottom: '6px' }}>
            <strong>30. Which cuts or parts of pork are sold most? (ಯಾವ ಭಾಗಗಳು ಹೆಚ್ಚು ಮಾರಾಟವಾಗುತ್ತವೆ?):</strong><br />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 8px', marginTop: '3px', fontSize: '11.5px' }}>
              <div>[ &nbsp; ] Pork Belly (ಹೊಟ್ಟೆಯ ಭಾಗ)</div>
              <div>[ &nbsp; ] Pork Chops (ಚಾಪ್ಸ್)</div>
              <div>[ &nbsp; ] Pork Ribs (ಪಕ್ಕೆಲುಬು)</div>
              <div>[ &nbsp; ] Shoulder / Butt (ಭುಜದ ಭಾಗ)</div>
              <div>[ &nbsp; ] Leg / Ham (ಕಾಲು / ತೊಡೆ)</div>
              <div>[ &nbsp; ] Pork Loin (ಬೆನ್ನಿನ ಭಾಗ)</div>
              <div>[ &nbsp; ] Head Meat (ತಲೆಯ ಮಾಂಸ)</div>
              <div>[ &nbsp; ] Trotters / Legs (ಕಾಲುಗಳು)</div>
              <div>[ &nbsp; ] Liver / Organs (ಲಿವರ್, ಕರುಳು)</div>
              <div>[ &nbsp; ] Skin / Rind (ಚರ್ಮ)</div>
              <div>[ &nbsp; ] Fat / Lard (ಕೊಬ್ಬು)</div>
              <div>[ &nbsp; ] Bone with Meat (ಮೂಳೆ ಮಾಂಸ)</div>
              <div>[ &nbsp; ] Boneless Meat (ಬೋನ್ಲೆಸ್)</div>
              <div>[ &nbsp; ] Minced Pork (ಖೀಮಾ)</div>
              <div>[ &nbsp; ] No idea (ಗೊತ್ತಿಲ್ಲ)</div>
              <div style={{ gridColumn: 'span 3' }}>[ &nbsp; ] Other: ________________________________________________</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '8px 16px', marginTop: '6px' }}>
            <div>
              <strong>31. Unsold Meat Handling (ಮಾರಾಟವಾಗದ ಮಾಂಸ ನಿರ್ವಹಣೆ):</strong><br />
              <span style={{ fontSize: '11.5px' }}>
                [ &nbsp; ] Returned to wholesale dealer (ಸಗಟು ವ್ಯಾಪಾರಿಗೆ ವಾಪಸ್)<br />
                [ &nbsp; ] Stored in refrigerator/freezer (ಫ್ರಿಡ್ಜ್‌ನಲ್ಲಿ ಶೇಖರಣೆ)<br />
                [ &nbsp; ] Sold at discounted price (ರಿಯಾಯಿತಿ ದರದಲ್ಲಿ ಮಾರಾಟ)<br />
                [ &nbsp; ] Processed into other meat products (ಇತರ ಉತ್ಪನ್ನಗಳಾಗಿ ಸಂಸ್ಕರಣೆ)<br />
                [ &nbsp; ] Disposed of (ವಿಲೇವಾರಿ ಮಾಡುವುದು)<br />
                [ &nbsp; ] Supplied to hotels (ಹೋಟೆಲ್‌ಗಳಿಗೆ ಪೂರೈಕೆ)<br />
                [ &nbsp; ] Other: ____________________________________
              </span>
            </div>
            <div>
              <strong>32. Meat Storage Capacity (ಶೇಖರಣಾ ಸಾಮರ್ಥ್ಯ):</strong><br />
              <span style={{ fontSize: '11.5px' }}>
                [ &nbsp; ] 10-25 Kg<br />
                [ &nbsp; ] 25-50 Kg<br />
                [ &nbsp; ] 50-100 Kg<br />
                [ &nbsp; ] 100-200 Kg<br />
                [ &nbsp; ] 200-500 Kg<br />
                [ &nbsp; ] Above 500 Kg<br />
                [ &nbsp; ] No Cold Storage (ಶೇಖರಣಾ ಸೌಲಭ್ಯವಿಲ್ಲ)
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 8 & 9: PROCUREMENT & MASALAS */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            8 & 9. Meat Procurement & Masalas (ಖರೀದಿ ಮೂಲ ಮತ್ತು ಮಸಾಲಾಗಳು)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <strong>33. Primary Meat Procurement Source (ಮಾಂಸ ಖರೀದಿ ಮೂಲ):</strong><br />
              <span style={{ fontSize: '11.5px' }}>
                [ &nbsp; ] Local Farmers (ಸ್ಥಳೀಯ ರೈತರಿಂದ)<br />
                [ &nbsp; ] Wholesale Meat Market (ಸಗಟು ಮಾರುಕಟ್ಟೆ)<br />
                [ &nbsp; ] Direct Farm Contract (ನೇರ ಫಾರ್ಮ್ ಒಪ್ಪಂದ)<br />
                [ &nbsp; ] Pig Traders / Middlemen (ಮಧ್ಯವರ್ತಿಗಳು)<br />
                [ &nbsp; ] Own Farm Rearing (ಸ್ವಂತ ಫಾರ್ಮ್)<br />
                [ &nbsp; ] Other: __________________________________
              </span>
            </div>
            <div>
              <strong>34. Purchase Frequency (ಖರೀದಿ ಆವರ್ತನ):</strong><br />
              <span style={{ fontSize: '11.5px' }}>
                [ &nbsp; ] Daily &nbsp; [ &nbsp; ] 2-3 Times/Week &nbsp; [ &nbsp; ] Weekly Once &nbsp; [ &nbsp; ] Fortnightly<br />
              </span>
              <div style={{ marginTop: '6px' }}>
                <strong>35. Procurement Quantity / Order (ಪ್ರತಿ ಆದೇಶದ ಪ್ರಮಾಣ):</strong><br />
                <span style={{ fontSize: '11.5px' }}>
                  [ &nbsp; ] 20-50 Kg &nbsp; [ &nbsp; ] 50-100 Kg &nbsp; [ &nbsp; ] 100-200 Kg &nbsp; [ &nbsp; ] 1-2 Live Pigs &nbsp; [ &nbsp; ] &gt;3 Live Pigs
                </span>
              </div>
              <div style={{ marginTop: '6px' }}>
                <strong>36. Pork Masalas Available (ಮಸಾಲಾಗಳು):</strong><br />
                <span style={{ fontSize: '11.5px' }}>
                  [ &nbsp; ] Chandrakala & Jeevith &nbsp; [ &nbsp; ] Chandrakala Only &nbsp; [ &nbsp; ] Jeevith Only &nbsp; [ &nbsp; ] None &nbsp; [ &nbsp; ] Other: _______
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 10 & 11: BBMP & FSSAI LICENSING */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            10 & 11. BBMP & FSSAI Trade Licensing (ಬಿಬಿಎಂಪಿ ಮತ್ತು FSSAI ಪರವಾನಗಿ)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <strong>37. Is BBMP License Issued? (ಬಿಬಿಎಂಪಿ ಪರವಾನಗಿ ಇದೆಯೇ?):</strong><br />
              [ &nbsp; ] Yes (ಹೌದು) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] No (ಇಲ್ಲ)<br />
              <strong>38. Issues in procuring BBMP License?:</strong> [ &nbsp; ] Yes &nbsp; [ &nbsp; ] No<br />
              <strong>39. Reason for BBMP Issue:</strong> ____________________________
            </div>
            <div>
              <strong>40. Is FSSAI License Issued? (FSSAI ಪರವಾನಗಿ ಇದೆಯೇ?):</strong><br />
              [ &nbsp; ] Yes (ಹೌದು) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] No (ಇಲ್ಲ)<br />
              <strong>41. Issues in procuring FSSAI License?:</strong> [ &nbsp; ] Yes &nbsp; [ &nbsp; ] No<br />
              <strong>42. Reason for FSSAI Issue:</strong> ____________________________
            </div>
          </div>
        </div>

        {/* SECTION 12: BILLING & CHALLENGES */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            12. Billing & Business Challenges (ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ವ್ಯಾಪಾರದ ಸವಾಲುಗಳು)
          </div>
          <div>
            <strong>43. Provide Bill / Receipt? (ಬಿಲ್ / ರಸೀದಿ ನೀಡುತ್ತೀರಾ?):</strong><br />
            [ &nbsp; ] Printed Tax Invoice / POS &nbsp;&nbsp;
            [ &nbsp; ] Handwritten Cash Bill &nbsp;&nbsp;
            [ &nbsp; ] No Bill Provided (ಬಿಲ್ ನೀಡುವುದಿಲ್ಲ) &nbsp;&nbsp;
            [ &nbsp; ] On Request Only &nbsp;&nbsp;
            [ &nbsp; ] Other: ______
          </div>
          <div style={{ marginTop: '6px' }}>
            <strong>44. Facing Business Challenges? (ವ್ಯಾಪಾರದಲ್ಲಿ ತೊಂದರೆಗಳಿವೆಯೇ?):</strong> [ &nbsp; ] Yes (ಹೌದು) &nbsp;&nbsp; [ &nbsp; ] No (ಇಲ್ಲ)<br />
            <strong>45. If Yes, What Challenges? (ಯಾವ ತೊಂದರೆಗಳಿವೆ?):</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px', marginTop: '3px', fontSize: '11px' }}>
              <div>[ &nbsp; ] High live pig purchase prices (ಹೆಚ್ಚು ಖರೀದಿ ದರ)</div>
              <div>[ &nbsp; ] Irregular supply / Shortage of live pigs (ಪೂರೈಕೆ ಕೊರತೆ)</div>
              <div>[ &nbsp; ] Lack of modern slaughtering facilities (ವಧಾಗೃಹ ಕೊರತೆ)</div>
              <div>[ &nbsp; ] Electricity & cold storage issues (ವಿದ್ಯುತ್ / ಶೇಖರಣಾ ಸಮಸ್ಯೆ)</div>
              <div>[ &nbsp; ] Waste disposal & BBMP hygiene pressure (ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ ಸಮಸ್ಯೆ)</div>
              <div>[ &nbsp; ] Lack of working capital / Bank loans (ಬಂಡವಾಳ / ಸಾಲ ಕೊರತೆ)</div>
              <div>[ &nbsp; ] Social stigma / Lack of government schemes (ಯೋಜನೆಗಳ ಕೊರತೆ)</div>
              <div>[ &nbsp; ] Competition from unorganized sellers (ಅನಧಿಕೃತ ಪೈಪೋಟಿ)</div>
              <div style={{ gridColumn: 'span 2' }}>[ &nbsp; ] Other: ____________________________________________________________________</div>
            </div>
          </div>
        </div>

        {/* SECTION 13: TRAINING & SKILLS */}
        <div className="section-block" style={{ marginBottom: '1.25rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            13. Pig Farming & Pork Selling Skills & Training (ಹಂದಿ ಸಾಕಾಣಿಕೆ ಮತ್ತು ಮಾಂಸ ಮಾರಾಟ ತರಬೇತಿ)
          </div>
          <div>
            <strong>46. Want training on pig-related skills? (ತರಬೇತಿ ಪಡೆಯಲು ಬಯಸುತ್ತೀರಾ?):</strong> [ &nbsp; ] Yes (ಹೌದು) &nbsp;&nbsp; [ &nbsp; ] No (ಇಲ್ಲ)<br />
            <strong>47. If Yes, Desired Training Topics (ಅಗತ್ಯವಿರುವ ತರಬೇತಿ ವಿಷಯಗಳು):</strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px 8px', marginTop: '3px', fontSize: '11px' }}>
              <div>[ &nbsp; ] Pig Rearing & Farm Mgmt</div>
              <div>[ &nbsp; ] Pig Breeding & Reproduction</div>
              <div>[ &nbsp; ] Pig Feeding & Nutrition</div>
              <div>[ &nbsp; ] Health & Disease Mgmt</div>
              <div>[ &nbsp; ] Pig Housing & Hygiene</div>
              <div>[ &nbsp; ] Piglet Care & Rearing</div>
              <div>[ &nbsp; ] Fattening & Growth</div>
              <div>[ &nbsp; ] Vaccination & Care</div>
              <div>[ &nbsp; ] Waste & Dung Mgmt</div>
              <div>[ &nbsp; ] Hygienic Slaughtering</div>
              <div>[ &nbsp; ] Meat Cutting & Butchery</div>
              <div>[ &nbsp; ] Preservation & Freezing</div>
              <div>[ &nbsp; ] Value Addition (Sausage/Ham)</div>
              <div>[ &nbsp; ] Packaging & Labelling</div>
              <div>[ &nbsp; ] FSSAI Compliance</div>
              <div>[ &nbsp; ] Retail Shop Marketing</div>
              <div>[ &nbsp; ] Costing & Financial Mgmt</div>
              <div>[ &nbsp; ] By-product Utilization</div>
              <div style={{ gridColumn: 'span 3' }}>[ &nbsp; ] Other: ____________________________________________________________________</div>
            </div>
          </div>
        </div>

        {/* SECTION 14: VERIFICATION & SIGNATURES */}
        <div className="section-block" style={{ borderTop: '2px solid #000000', paddingTop: '10px', marginTop: '1rem' }}>
          <div className="section-header" style={{ fontWeight: '800', fontSize: '13.5px', background: '#e2e8f0', padding: '4px 8px', borderLeft: '4px solid #000000', marginBottom: '8px' }}>
            14. Verification, Photo Proof & Rating (ದೃಢೀಕರಣ ಮತ್ತು ರೇಟಿಂಗ್)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <strong>48. Shop Photos Taken / Attached:</strong><br />
              <span style={{ fontSize: '11.5px' }}>
                [ &nbsp; ] Front Nameboard &nbsp; [ &nbsp; ] Meat Display Counter &nbsp; [ &nbsp; ] Cutting Area &nbsp; [ &nbsp; ] Freezer
              </span>
            </div>
            <div>
              <strong>49. GPS Coordinates:</strong><br />
              Lat: ____________________ &nbsp; Lng: ____________________
            </div>
            <div>
              <strong>50. Shop Cleanliness Rating (ಶುಚಿತ್ವ ರೇಟಿಂಗ್):</strong><br />
              [ &nbsp; ] 1 ★ &nbsp;&nbsp; [ &nbsp; ] 2 ★★ &nbsp;&nbsp; [ &nbsp; ] 3 ★★★ &nbsp;&nbsp; [ &nbsp; ] 4 ★★★★ &nbsp;&nbsp; [ &nbsp; ] 5 ★★★★★
            </div>
            <div>
              <strong>51. Shopkeeper Attitude / Behavior Rating (ವರ್ತನೆ ರೇಟಿಂಗ್):</strong><br />
              [ &nbsp; ] 1 ★ &nbsp;&nbsp; [ &nbsp; ] 2 ★★ &nbsp;&nbsp; [ &nbsp; ] 3 ★★★ &nbsp;&nbsp; [ &nbsp; ] 4 ★★★★ &nbsp;&nbsp; [ &nbsp; ] 5 ★★★★★
            </div>
          </div>

          {/* Signature Block */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px dashed #64748b'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #000', height: '30px', margin: '0 30px' }}></div>
              <div style={{ marginTop: '6px', fontWeight: '700', fontSize: '12px' }}>
                Signature / Seal of Shopkeeper (ಅಂಗಡಿಯವರ ಸಹಿ / ಮೊಹರು)
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #000', height: '30px', margin: '0 30px' }}></div>
              <div style={{ marginTop: '6px', fontWeight: '700', fontSize: '12px' }}>
                Signature of Field Surveyor (ಸಮೀಕ್ಷಕರ ಸಹಿ)
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Print CSS */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print, header, nav {
            display: none !important;
          }
          .physical-form-wrapper {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-sheet {
            max-width: 100% !important;
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 10mm 15mm !important;
            margin: 0 !important;
          }
          .section-block {
            page-break-inside: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 10mm;
          }
        }
      `}</style>
    </div>
  );
}
