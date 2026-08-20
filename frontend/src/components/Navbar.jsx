import React from 'react';
import {
  ClipboardList, LayoutDashboard, Database, PlusCircle,
  Sun, Moon, ShieldCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, totalCount = 0, theme = 'light', onToggleTheme }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-header)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'all 0.25s ease'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            minWidth: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)',
            color: 'white',
            fontWeight: '800',
            fontSize: '1.2rem'
          }}>
            🥩
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Pork Survey Portal
              </span>
              <span className="badge badge-primary" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>Karnataka</span>
            </div>
            <div className="kannada-text" style={{ fontSize: '0.72rem', lineHeight: '1.2' }}>
              ಹಂದಿಮಾಂಸದ ಚಿಲ್ಲರೆ ಮಾರಾಟ ಅಂಗಡಿಗಳ ಸಮೀಕ್ಷಾ ಪೋರ್ಟಲ್
            </div>
          </div>
        </div>

        {/* Right Section: Theme Toggle & DB Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <>
                <Moon size={15} color="#4f46e5" />
                <span style={{ fontWeight: '600' }}>Dark</span>
              </>
            ) : (
              <>
                <Sun size={15} color="#f59e0b" />
                <span style={{ fontWeight: '600' }}>Light</span>
              </>
            )}
          </button>

          {/* MySQL DB Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.65rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            color: '#059669',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
            <span>MySQL Live</span>
          </div>
        </div>

        {/* Navigation Tabs (Full width scrollable on mobile) */}
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '2px' }}>
          <nav style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '3px',
            gap: '3px',
            minWidth: 'max-content'
          }}>
            <button
              onClick={() => setActiveTab('form')}
              className="btn"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'form' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'transparent',
                color: activeTab === 'form' ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === 'form' ? '0 4px 10px rgba(225, 29, 72, 0.25)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <PlusCircle size={15} />
              <span>New Survey <small style={{ opacity: 0.8 }}>(ಹೊಸ ಸಮೀಕ್ಷೆ)</small></span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'transparent',
                color: activeTab === 'dashboard' ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === 'dashboard' ? '0 4px 10px rgba(225, 29, 72, 0.25)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard <small style={{ opacity: 0.8 }}>(ಡ್ಯಾಶ್‌ಬೋರ್ಡ್)</small></span>
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className="btn"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'records' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'transparent',
                color: activeTab === 'records' ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === 'records' ? '0 4px 10px rgba(225, 29, 72, 0.25)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Database size={15} />
              <span>All Records <span className="badge badge-emerald" style={{ marginLeft: '4px', padding: '1px 5px', fontSize: '0.7rem' }}>{totalCount}</span></span>
            </button>
          </nav>
        </div>

      </div>
    </header>
  );
}
