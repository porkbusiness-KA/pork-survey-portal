import React from 'react';
import {
  X, MapPin, Store, User, Clock, Users, ShoppingBag,
  DollarSign, CheckSquare, Award, Phone, ExternalLink,
  Calendar, ShieldCheck, AlertTriangle, Image as ImageIcon
} from 'lucide-react';

export default function ShopDetailModal({ survey, onClose }) {
  if (!survey) return null;

  const holidays = Array.isArray(survey.holiday_days) ? survey.holiday_days : [];
  const peakDays = Array.isArray(survey.peak_customer_days) ? survey.peak_customer_days : [];
  const meatTypes = Array.isArray(survey.meat_types) ? survey.meat_types : [];
  const processedConsumption = Array.isArray(survey.processed_meat_consumption) ? survey.processed_meat_consumption : [];
  const masalas = Array.isArray(survey.masalas_available) ? survey.masalas_available : [];
  const images = Array.isArray(survey.shop_images) ? survey.shop_images : [];
  const spocs = Array.isArray(survey.spocs) && survey.spocs.length > 0
    ? survey.spocs
    : [{ name: survey.spoc_name || survey.owner_name, mobile: survey.spoc_mobile, skills: [] }];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem'
    }} onClick={onClose}>
      
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          background: 'var(--modal-bg)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-amber">Survey ID: #{survey.id}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              {new Date(survey.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            {survey.shop_name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <MapPin size={16} color="#d97706" />
            <span>
              {survey.place || [survey.village, survey.taluk, survey.district].filter(Boolean).join(', ')}
              {survey.pincode ? ` — Pincode: ${survey.pincode}` : ''}
              {survey.state ? ` (${survey.state}, ${survey.country || 'India'})` : ''}
            </span>
          </div>
        </div>

        {/* 28 Survey Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
          
          {/* Group 1: Ownership & Experience */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> Owner & SPOC Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Shop Owner:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.owner_name}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Owner Mobile:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.owner_mobile || 'Not provided'}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Owner Email:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.owner_email || 'Not provided'}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Years in Operation:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.years_in_business || 0} years</span></div>
              
              {/* SPOCs List */}
              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                <strong style={{ color: '#d97706', display: 'block', marginBottom: '0.4rem' }}>
                  Contact Person(s) / SPOCs ({spocs.length}):
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {spocs.map((spoc, sIdx) => (
                    <div key={sIdx} style={{ background: 'var(--bg-main)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                          {spoc.name || 'Unnamed SPOC'}
                        </span>
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          SPOC #{sIdx + 1}
                        </span>
                      </div>
                      {spoc.mobile && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          📱 {spoc.mobile}
                        </div>
                      )}
                      {Array.isArray(spoc.skills) && spoc.skills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {spoc.skills.map((sk, kIdx) => (
                            <span key={kIdx} className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                              {sk === 'Other' && spoc.skills_other ? `${sk}: ${spoc.skills_other}` : sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Timings & Operations */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} /> Timings & Holidays
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Opening Time:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.opening_time}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Closing Time:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.closing_time}</span></div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Weekly Holidays:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                  {holidays.map((h, i) => (
                    <span key={i} className="badge badge-gray" style={{ fontSize: '0.72rem' }}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Group 3: Workforce & Customers */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} /> Staff & Customer Footfall
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Number of Workers:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.workers_count}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Daily Customer Footfall:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.daily_customers}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Customer Demographics:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.customer_type}</span></div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Peak Days:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                  {peakDays.map((d, i) => (
                    <span key={i} className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Group 4: Meat Sales & Pricing */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShoppingBag size={16} /> Products, Rates & Sourcing
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Regular Meat Rate:</strong> <span style={{ color: '#059669', fontWeight: '700' }}>₹{survey.regular_meat_rate} / Kg</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Average Daily Sale:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.average_daily_sale_kg} Kg/day</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Procurement Source:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.procurement_source || 'Not specified'}</span></div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Meat Types Available:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                  {meatTypes.map((m, i) => (
                    <span key={i} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Group 5: Masalas & Processed Products */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} /> Masalas & Processed Meat
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Pork Masalas Available:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                  {masalas.map((masala, i) => (
                    <span key={i} className="badge badge-amber" style={{ fontSize: '0.72rem' }}>{masala}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '0.4rem' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Processed Meat Consumption:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                  {processedConsumption.map((p, i) => (
                    <span key={i} className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Group 6: BBMP & FSSAI Trade License & Cleanliness */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Licensing & Hygiene
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>BBMP Trade License:</strong>{' '}
                <span style={{ color: survey.bbmp_license_issued === 'Yes' ? '#059669' : '#d97706', fontWeight: '700' }}>
                  {survey.bbmp_license_issued || 'No'}
                </span>
              </div>
              <div><strong style={{ color: 'var(--text-muted)' }}>BBMP License Issues:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.bbmp_license_issues || 'No'}</span></div>
              {survey.bbmp_issue_reasons && (
                <div><strong style={{ color: 'var(--text-muted)' }}>BBMP Issue Reason:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.bbmp_issue_reasons}</span></div>
              )}
              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.25rem 0' }}></div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>FSSAI Trade License:</strong>{' '}
                <span style={{ color: survey.fssai_license_issued === 'Yes' ? '#059669' : '#d97706', fontWeight: '700' }}>
                  {survey.fssai_license_issued || 'No'}
                </span>
              </div>
              <div><strong style={{ color: 'var(--text-muted)' }}>FSSAI License Issues:</strong> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{survey.fssai_license_issues || 'No'}</span></div>
              {survey.fssai_issue_reasons && (
                <div><strong style={{ color: 'var(--text-muted)' }}>FSSAI Issue Reason:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.fssai_issue_reasons}</span></div>
              )}
              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.25rem 0' }}></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Cleanliness Score:</strong> <span style={{ color: '#d97706', fontWeight: '700' }}>{'★'.repeat(survey.cleanliness_rating || 3)} ({survey.cleanliness_rating}/5)</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Behavior/Attitude Score:</strong> <span style={{ color: '#d97706', fontWeight: '700' }}>{'★'.repeat(survey.behavior_rating || 4)} ({survey.behavior_rating || 4}/5)</span></div>
            </div>
          </div>

          {/* Group 6b: New Fields – Ownership, Seasons, Cuts, Unsold, Storage, Training */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShoppingBag size={16} /> Business Insights & Training
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              {survey.shop_ownership && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Shop Ownership:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.shop_ownership}{survey.shop_ownership_other ? ` – ${survey.shop_ownership_other}` : ''}</span></div>
              )}
              {Array.isArray(survey.meat_cuts_sold_most) && survey.meat_cuts_sold_most.length > 0 && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Top Selling Cuts:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.meat_cuts_sold_most.join(', ')}{survey.meat_cuts_sold_most_other ? `, ${survey.meat_cuts_sold_most_other}` : ''}</span></div>
              )}
              {Array.isArray(survey.unsold_meat_handling) && survey.unsold_meat_handling.length > 0 && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Unsold Meat Handling:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.unsold_meat_handling.join(', ')}{survey.unsold_meat_handling_other ? `, ${survey.unsold_meat_handling_other}` : ''}</span></div>
              )}
              {survey.storage_capacity && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Storage Capacity:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.storage_capacity}</span></div>
              )}
              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.25rem 0' }}></div>
              {survey.wants_training && (
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Wants Pig Skills Training:</strong>{' '}
                  <span style={{ color: survey.wants_training === 'Yes' ? '#059669' : '#d97706', fontWeight: '700' }}>{survey.wants_training}</span>
                </div>
              )}
              {survey.wants_training === 'Yes' && Array.isArray(survey.training_skills) && survey.training_skills.length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Training Interests:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {survey.training_skills.map((skill, i) => (
                      <span key={i} style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.78rem', color: '#059669', fontWeight: '600' }}>{skill}</span>
                    ))}
                    {survey.training_skills_other && (
                      <span style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.78rem', color: '#059669', fontWeight: '600' }}>{survey.training_skills_other}</span>
                    )}
                  </div>
                </div>
              )}
              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.25rem 0' }}></div>
              {Array.isArray(survey.procurement_sources) && survey.procurement_sources.length > 0 && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Procurement Sources:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.procurement_sources.join(', ')}{survey.procurement_sources_other ? `, ${survey.procurement_sources_other}` : ''}</span></div>
              )}
              {survey.procurement_frequency && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Procurement Frequency:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.procurement_frequency}{survey.procurement_frequency_other ? ` – ${survey.procurement_frequency_other}` : ''}</span></div>
              )}
              {survey.procurement_quantity && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Procurement Quantity/Order:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.procurement_quantity}</span></div>
              )}
              {survey.provides_billing && (
                <div><strong style={{ color: 'var(--text-muted)' }}>Provides Bill/Receipt:</strong> <span style={{ color: 'var(--text-main)' }}>{survey.provides_billing}</span></div>
              )}
              {survey.has_challenges && (
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Facing Business Challenges:</strong>{' '}
                  <span style={{ color: survey.has_challenges === 'Yes' ? '#d97706' : '#059669', fontWeight: '700' }}>{survey.has_challenges}</span>
                </div>
              )}
              {survey.has_challenges === 'Yes' && Array.isArray(survey.business_challenges) && survey.business_challenges.length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Challenges:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {survey.business_challenges.map((c, i) => (
                      <span key={i} style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(217,119,6,0.4)', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.78rem', color: '#b45309', fontWeight: '600' }}>{c}</span>
                    ))}
                    {survey.business_challenges_other && (
                      <span style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(217,119,6,0.4)', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.78rem', color: '#b45309', fontWeight: '600' }}>{survey.business_challenges_other}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Uploaded Photos Section */}
        {images.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ImageIcon size={18} color="#d97706" /> Uploaded Shop Photos ({images.length})
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {images.map((imgUrl, i) => (
                <a key={i} href={imgUrl} target="_blank" rel="noreferrer" style={{ display: 'block', width: '120px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={imgUrl} alt="Shop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Location Link Action Button */}
        {survey.location_link && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(225, 29, 72, 0.08)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.2)', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="#d97706" />
              <div>
                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>Google Maps Location Pin</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{survey.location_link}</div>
              </div>
            </div>

            <a
              href={survey.location_link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '0.88rem' }}
            >
              <ExternalLink size={16} />
              <span>Open in Google Maps</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
