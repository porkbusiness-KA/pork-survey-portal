import React, { useState } from 'react';
import {
  ClipboardList, LayoutDashboard, Database, PlusCircle,
  Sun, Moon, ShieldCheck, Globe, Printer, Lock, LogOut,
  Menu, X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

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

        {/* Desktop Controls (hidden on mobile) */}
        <div className="desktop-nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          
          {/* Admin Status & Logout */}
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

          {/* LANGUAGE SELECTOR */}
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

        {/* Mobile Header Actions (Visible ONLY on mobile screens <= 768px) */}
        <div className="mobile-header-actions" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '0.45rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} color="#4f46e5" /> : <Sun size={16} color="#f59e0b" />}
          </button>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="btn btn-primary"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.88rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '700'
            }}
            aria-label="Open Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
            {!isMobileMenuOpen && (
              <span style={{
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '999px',
                padding: '1px 6px',
                fontSize: '0.7rem',
                fontWeight: '800'
              }}>
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Horizontal Navigation Tabs (Hidden on Mobile) */}
        <div className="desktop-tabs-wrapper" style={{ width: '100%', overflowX: 'auto', paddingBottom: '2px' }}>
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

      {/* Mobile Slide-Down Menu Drawer (Opens when Menu button is clicked) */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer animate-fade-in" style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
        }}>
          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              onClick={() => handleTabClick('form')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: activeTab === 'form' ? '#d97706' : 'var(--border-color)',
                background: activeTab === 'form' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card-subtle)',
                color: activeTab === 'form' ? '#d97706' : 'var(--text-main)',
                fontWeight: activeTab === 'form' ? '700' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <PlusCircle size={18} color="#d97706" />
                <span>{t.newSurveyTab}</span>
              </div>
              {activeTab === 'form' && <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>● Active</span>}
            </button>

            <button
              onClick={() => handleTabClick('records')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: activeTab === 'records' ? '#d97706' : 'var(--border-color)',
                background: activeTab === 'records' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card-subtle)',
                color: activeTab === 'records' ? '#d97706' : 'var(--text-main)',
                fontWeight: activeTab === 'records' ? '700' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Database size={18} color="#d97706" />
                <span>{t.recordsTab}</span>
              </div>
              <span className="badge badge-emerald" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                {totalCount} Records
              </span>
            </button>

            {/* Admin Dashboard */}
            {isAdmin && (
              <button
                onClick={() => handleTabClick('dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: activeTab === 'dashboard' ? '#d97706' : 'var(--border-color)',
                  background: activeTab === 'dashboard' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card-subtle)',
                  color: activeTab === 'dashboard' ? '#d97706' : 'var(--text-main)',
                  fontWeight: activeTab === 'dashboard' ? '700' : '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <LayoutDashboard size={18} color="#d97706" />
                  <span>{t.dashboardTab}</span>
                </div>
                {activeTab === 'dashboard' && <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>● Active</span>}
              </button>
            )}

            <button
              onClick={() => handleTabClick('print')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: activeTab === 'print' ? '#d97706' : 'var(--border-color)',
                background: activeTab === 'print' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card-subtle)',
                color: activeTab === 'print' ? '#d97706' : 'var(--text-main)',
                fontWeight: activeTab === 'print' ? '700' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Printer size={18} color="#d97706" />
                <span>{t.physicalFormTab}</span>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.4rem 0' }}></div>

          {/* Language Switcher in Mobile Drawer */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
              Language / ಭಾಷೆ
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => onSetLang('en')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: lang === 'en' ? '700' : '500',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: lang === 'en' ? '#d97706' : 'var(--bg-card-subtle)',
                  color: lang === 'en' ? '#fff' : 'var(--text-main)',
                  textAlign: 'center'
                }}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => onSetLang('kn')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: lang === 'kn' ? '700' : '500',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: lang === 'kn' ? '#d97706' : 'var(--bg-card-subtle)',
                  color: lang === 'kn' ? '#fff' : 'var(--text-main)',
                  textAlign: 'center'
                }}
              >
                ಕನ್ನಡ
              </button>

              <button
                type="button"
                onClick={() => onSetLang('both')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: lang === 'both' ? '700' : '500',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: lang === 'both' ? '#d97706' : 'var(--bg-card-subtle)',
                  color: lang === 'both' ? '#fff' : 'var(--text-main)',
                  textAlign: 'center'
                }}
              >
                Both
              </button>
            </div>
          </div>

          {/* Admin Info / Logout in Mobile Drawer */}
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontWeight: '700', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} />
                <span>Admin Logged In</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAdminLogout();
                }}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

