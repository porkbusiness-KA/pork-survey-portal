import React from 'react';
import {
  ClipboardList, LayoutDashboard, Database, PlusCircle,
  Sun, Moon, ShieldCheck, Globe, Printer, Lock, LogOut
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({
  activeTab,
  setActiveTab,
  totalCount = 0,
  theme = 'light',
  onToggleTheme,
  lang = 'en',
  onSetLang,
  isAdmin = false,
  onOpenAdminLogin,
  onAdminLogout
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

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
        {/* Brand Logo & Title (with Secret Admin Trigger on logo) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            onClick={(e) => {
              if (onOpenAdminLogin) {
                // Secret Multi-Click Trigger (3 quick clicks within 2 seconds opens Admin Login)
                window._logoClickCount = (window._logoClickCount || 0) + 1;
                clearTimeout(window._logoClickTimer);
                window._logoClickTimer = setTimeout(() => {
                  window._logoClickCount = 0;
                }, 2000);
                if (window._logoClickCount >= 3) {
                  window._logoClickCount = 0;
                  onOpenAdminLogin();
                }
              }
            }}
            style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)',
              color: 'white',
              fontWeight: '800',
              fontSize: '1.2rem',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            🥩
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                {t.appTitle}
              </span>
              <span className="badge badge-primary" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>{t.stateBadge}</span>
            </div>
            <div className="kannada-text" style={{ fontSize: '0.72rem', lineHeight: '1.2' }}>
              {t.appSubtitle}
            </div>
          </div>
        </div>

        {/* Right Section: Language Switcher, Theme Toggle, Admin Status (Only when logged in) & DB Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          
          {/* Admin Status & Logout - Only shown when Admin is actively authenticated */}
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.65rem',
                  background: 'rgba(217, 119, 6, 0.15)',
                  border: '1px solid rgba(217, 119, 6, 0.4)',
                  borderRadius: '10px',
                  color: '#d97706',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}
              >
                <ShieldCheck size={14} />
                <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್' : 'Admin'}</span>
              </span>
              <button
                onClick={onAdminLogout}
                className="btn btn-secondary"
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.76rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: 'var(--text-muted)'
                }}
                title={lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಲಾಗೌಟ್' : 'Logout Admin'}
              >
                <LogOut size={13} />
                <span>{lang === 'kn' ? 'ಲಾಗೌಟ್' : 'Logout'}</span>
              </button>
            </div>
          )}

          {/* LANGUAGE SELECTOR (English / ಕನ್ನಡ / Both) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '2px',
            gap: '2px'
          }}>
            <button
              type="button"
              onClick={() => onSetLang('en')}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: lang === 'en' ? '700' : '500',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: lang === 'en' ? '#d97706' : 'transparent',
                color: lang === 'en' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.18s ease'
              }}
              title="English interface only"
            >
              English
            </button>

            <button
              type="button"
              onClick={() => onSetLang('kn')}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: lang === 'kn' ? '700' : '500',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: lang === 'kn' ? '#d97706' : 'transparent',
                color: lang === 'kn' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.18s ease'
              }}
              title="ಕನ್ನಡ ರೂಪಾಂತರ ಮಾತ್ರ"
            >
              ಕನ್ನಡ
            </button>

            <button
              type="button"
              onClick={() => onSetLang('both')}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: lang === 'both' ? '700' : '500',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: lang === 'both' ? '#d97706' : 'transparent',
                color: lang === 'both' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.18s ease'
              }}
              title="Bilingual / ದ್ವಿಭಾಷಾ"
            >
              Both
            </button>
          </div>

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
            <span>{t.liveDb}</span>
          </div>
        </div>

        {/* Navigation Tabs (Responsive grid on mobile, inline-flex on desktop) */}
        <div className="nav-tabs-wrapper">
          <nav className="nav-tabs-container">
            <button
              onClick={() => setActiveTab('form')}
              className="btn nav-tab-btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'form' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: activeTab === 'form' ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === 'form' ? '0 4px 10px rgba(217, 119, 6, 0.25)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <PlusCircle size={15} style={{ flexShrink: 0 }} />
              <span>{t.newSurveyTab}</span>
            </button>

            {/* Dashboard Tab - Only visible to authenticated Admin */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="btn nav-tab-btn"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                  color: activeTab === 'dashboard' ? '#fff' : 'var(--text-muted)',
                  boxShadow: activeTab === 'dashboard' ? '0 4px 10px rgba(217, 119, 6, 0.25)' : 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <LayoutDashboard size={15} style={{ flexShrink: 0 }} />
                <span>{t.dashboardTab}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('records')}
              className="btn nav-tab-btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'records' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: activeTab === 'records' ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === 'records' ? '0 4px 10px rgba(217, 119, 6, 0.25)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Database size={15} style={{ flexShrink: 0 }} />
              <span>
                {t.recordsTab} <span className="badge badge-emerald" style={{ marginLeft: '2px', padding: '1px 5px', fontSize: '0.68rem' }}>{totalCount}</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('print')}
              className="btn nav-tab-btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'print' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: activeTab === 'print' ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === 'print' ? '0 4px 10px rgba(217, 119, 6, 0.25)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Printer size={15} style={{ flexShrink: 0 }} />
              <span>{t.physicalFormTab}</span>
            </button>
          </nav>
        </div>

      </div>
    </header>
  );
}

