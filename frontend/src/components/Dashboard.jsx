import React from 'react';
import {
  Store, TrendingUp, DollarSign, Award, ShieldCheck,
  MapPin, ShoppingBag, Users, Calendar, ArrowUpRight,
  ExternalLink, Eye, RefreshCw
} from 'lucide-react';

export default function Dashboard({ stats, surveys, onSelectSurvey, onRefresh, onAddNewSurvey }) {
  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="pulse-glow" style={{ marginBottom: '1rem' }} />
        <div>Loading real-time analytics from database...</div>
      </div>
    );
  }

  const {
    totalSurveys = 0,
    avgMeatRate = 0,
    totalDailyKg = 0,
    avgDailyKgPerShop = 0,
    avgRating = 0,
    licensedPercentage = 0,
    districtStats = {},
    meatTypeStats = {},
    dailyCustomerStats = {},
    peakDayStats = {},
    masalaStats = {},
    licenseStats = { Yes: 0, No: 0 },
    cleanlinessDist = {}
  } = stats;

  const districtEntries = Object.entries(districtStats);
  const meatTypeEntries = Object.entries(meatTypeStats);
  const peakDayEntries = Object.entries(peakDayStats);
  const masalaEntries = Object.entries(masalaStats);

  return (
    <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Dashboard Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Analytics & Intelligence Dashboard</h1>
            <span className="badge badge-emerald">Live Metrics</span>
          </div>
          <p className="kannada-text" style={{ fontSize: '0.95rem' }}>
            ಹಂದಿಮಾಂಸದ ಚಿಲ್ಲರೆ ಮಾರಾಟ ಅಂಗಡಿಗಳ ದತ್ತಾಂಶ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಒಳನೋಟಗಳು
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onRefresh}
            className="btn btn-secondary"
            style={{ fontSize: '0.88rem' }}
          >
            <RefreshCw size={15} /> Refresh Data
          </button>
          <button
            onClick={onAddNewSurvey}
            className="btn btn-primary"
            style={{ fontSize: '0.88rem' }}
          >
            + Add New Survey Entry
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* KPI 1 */}
        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Outlets
              </div>
              <div className="kannada-text" style={{ fontSize: '0.72rem' }}>
                ಒಟ್ಟು ಸಮೀಕ್ಷೆ ನಡೆಸಿದ ಅಂಗಡಿಗಳು
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.4rem' }}>
                {totalSurveys}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.12)', color: '#d97706' }}>
              <Store size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Across 4 Districts in Karnataka</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Avg Meat Rate
              </div>
              <div className="kannada-text" style={{ fontSize: '0.72rem' }}>
                ಸರಾಸರಿ ದರ (ಪ್ರತಿ ಕೆಜಿ)
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#059669', marginTop: '0.4rem' }}>
                ₹{avgMeatRate}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
              <DollarSign size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Standard Regular Pork / Kg
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #4f46e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Daily Sales Volume
              </div>
              <div className="kannada-text" style={{ fontSize: '0.72rem' }}>
                ದೈನಂದಿನ ಒಟ್ಟು ಮಾರಾಟ ಪ್ರಮಾಣ
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#4f46e5', marginTop: '0.4rem' }}>
                {totalDailyKg} <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Kg/day</span>
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', color: '#4f46e5' }}>
              <TrendingUp size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Avg ~{avgDailyKgPerShop} Kg per outlet
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Cleanliness Index
              </div>
              <div className="kannada-text" style={{ fontSize: '0.72rem' }}>
                ಸರಾಸರಿ ಶುಚಿತ್ವದ ರೇಟಿಂಗ್
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#d97706', marginTop: '0.4rem' }}>
                {avgRating} <span style={{ fontSize: '1.1rem', color: '#d97706' }}>★</span>
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}>
              <Award size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Out of 5.0 Star Quality Scale
          </div>
        </div>

        {/* KPI 5 */}
        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #0891b2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                BBMP Licensed
              </div>
              <div className="kannada-text" style={{ fontSize: '0.72rem' }}>
                ಪರವಾನಗಿ ಹೊಂದಿರುವ ಪ್ರಮಾಣ
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0891b2', marginTop: '0.4rem' }}>
                {licensedPercentage}%
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891b2' }}>
              <ShieldCheck size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {licenseStats.Yes || 0} Licensed / {totalSurveys} Total
          </div>
        </div>
      </div>

      {/* Analytics Charts & Visualizations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Chart 1: District Distribution */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <MapPin size={20} color="#d97706" />
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Geographic District Distribution</h3>
              <p className="kannada-text" style={{ fontSize: '0.75rem' }}>ಜಿಲ್ಲಾವಾರು ಅಂಗಡಿಗಳ ಹಂಚಿಕೆ</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {districtEntries.map(([district, count]) => {
              const pct = Math.round((count / (totalSurveys || 1)) * 100);
              return (
                <div key={district}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{district}</span>
                    <span style={{ color: '#d97706', fontWeight: '700' }}>{count} outlets ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'var(--bg-card-subtle)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b 0%, #b45309 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.8s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Meat Types Available */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <ShoppingBag size={20} color="#059669" />
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Meat Products Availability</h3>
              <p className="kannada-text" style={{ fontSize: '0.75rem' }}>ಲಭ್ಯವಿರುವ ಮಾಂಸದ ವಿಧಗಳು</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {meatTypeEntries.map(([type, count]) => {
              const pct = Math.round((count / (totalSurveys || 1)) * 100);
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600', maxWidth: '75%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {type}
                    </span>
                    <span style={{ color: '#059669', fontWeight: '700' }}>{count} shops</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'var(--bg-card-subtle)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div style={{
                      width: `${Math.min(100, pct)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.8s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Peak Customer Visit Days */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Calendar size={20} color="#4f46e5" />
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Peak Customer Shopping Days</h3>
              <p className="kannada-text" style={{ fontSize: '0.75rem' }}>ಗ್ರಾಹಕರು ಹೆಚ್ಚು ಭೇಟಿ ನೀಡುವ ದಿನಗಳು</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
            {['Sunday', 'Saturday', 'Friday', 'Wednesday', 'Thursday', 'Tuesday', 'Monday'].map(day => {
              const count = peakDayStats[day] || 0;
              const maxCount = Math.max(...Object.values(peakDayStats), 1);
              const heightPct = Math.round((count / maxCount) * 100);
              return (
                <div key={day} style={{
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '0.75rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ height: '70px', width: '28px', background: 'var(--bg-card)', borderRadius: '6px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div style={{
                      width: '100%',
                      height: `${Math.max(12, heightPct)}%`,
                      background: day === 'Sunday' || day === 'Saturday' ? 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)' : 'linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)',
                      borderRadius: '4px 4px 0 0'
                    }}></div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{day.slice(0, 3)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Masalas Available Breakdown */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Award size={20} color="#d97706" />
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Masala Brands Distribution</h3>
              <p className="kannada-text" style={{ fontSize: '0.75rem' }}>ಮಾರಾಟವಾಗುವ ಮಸಾಲಾ ಬ್ರಾಂಡ್‌ಗಳು</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {masalaEntries.map(([masala, count]) => {
              const pct = Math.round((count / (totalSurveys || 1)) * 100);
              return (
                <div key={masala}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{masala}</span>
                    <span style={{ color: '#d97706', fontWeight: '700' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'var(--bg-card-subtle)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.8s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Outlets Grid */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Recently Surveyed Pork Outlets</h3>
            <p className="kannada-text" style={{ fontSize: '0.8rem' }}>ಇತ್ತೀಚೆಗೆ ಸಮೀಕ್ಷೆ ಮಾಡಿದ ಅಂಗಡಿಗಳ ಪಟ್ಟಿ</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {surveys.slice(0, 6).map(shop => (
            <div
              key={shop.id}
              onClick={() => onSelectSurvey(shop)}
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d97706';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{shop.district}</span>
                  <span style={{ color: '#d97706', fontSize: '0.85rem', fontWeight: '700' }}>
                    {'★'.repeat(shop.cleanliness_rating || 3)}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {shop.shop_name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Owner: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{shop.owner_name}</span> • {shop.place} ({shop.pincode})
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#059669' }}>
                  ₹{shop.regular_meat_rate}/Kg
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#d97706', fontWeight: '600' }}>
                  <span>View Details</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
