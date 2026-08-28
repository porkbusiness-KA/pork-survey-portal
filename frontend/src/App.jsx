import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SurveyForm from './components/SurveyForm';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import ShopDetailModal from './components/ShopDetailModal';
import PhysicalSurveyForm from './components/PhysicalSurveyForm';
import AdminLoginModal from './components/AdminLoginModal';
import { fetchSurveys, fetchSurveyStats, isAdminLoggedIn, clearAdminToken } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'dashboard' | 'records' | 'print'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pork_portal_theme') || 'light';
  });
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pork_portal_lang') || 'en';
  });
  const [isAdmin, setIsAdmin] = useState(() => isAdminLoggedIn());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pork_portal_theme', theme);
  }, [theme]);

  // Secret Admin Triggers (Keyboard shortcut: Ctrl+Shift+A or Alt+A, and URL hash: #admin)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + A OR Alt + A
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsLoginModalOpen(true);
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    // Check hash on load
    if (window.location.hash === '#admin') {
      setIsLoginModalOpen(true);
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Fetch public surveys list
      const surveysRes = await fetchSurveys();
      if (surveysRes.success) setSurveys(surveysRes.data);

      // 2. Fetch stats only if admin is logged in
      if (isAdminLoggedIn()) {
        try {
          const statsRes = await fetchSurveyStats();
          if (statsRes.success) setStats(statsRes.data);
        } catch (err) {
          console.warn('Stats fetch restricted or failed:', err.message);
          setStats(null);
        }
      } else {
        setStats(null);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    loadData();
  };

  const handleAdminLogout = () => {
    clearAdminToken();
    setIsAdmin(false);
    setStats(null);
    if (activeTab === 'dashboard') {
      setActiveTab('records');
    }
  };

  const handleSurveySubmitted = () => {
    loadData();
  };

  const handleSurveyDeleted = (id) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
    loadData();
  };

  const handleEditSurvey = (survey) => {
    setSelectedSurvey(null);
    setEditingSurvey(survey);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingSurvey(null);
    setActiveTab('records');
  };

  const handleSurveyUpdated = () => {
    setEditingSurvey(null);
    loadData();
    setActiveTab('records');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCount={surveys.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onSetLang={setLang}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'form' && (
          <SurveyForm
            onSurveySubmitted={handleSurveySubmitted}
            onSwitchToDashboard={() => {
              if (isAdmin) {
                setActiveTab('dashboard');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            onSwitchToRecords={() => setActiveTab('records')}
            onSwitchToPrint={() => setActiveTab('print')}
            lang={lang}
            onSetLang={setLang}
            editSurveyData={editingSurvey}
            onCancelEdit={handleCancelEdit}
            onSurveyUpdated={handleSurveyUpdated}
          />
        )}

        {activeTab === 'dashboard' && (
          isAdmin ? (
            <Dashboard
              stats={stats}
              surveys={surveys}
              onSelectSurvey={(item) => setSelectedSurvey(item)}
              onRefresh={loadData}
              onAddNewSurvey={() => setActiveTab('form')}
              lang={lang}
            />
          ) : (
            <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#d97706' }}>
                  🔒 {lang === 'kn' ? 'ನಿರ್ವಾಹಕರ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ' : 'Admin Access Required'}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {lang === 'kn'
                    ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವರದಿಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ಅಡ್ಮಿನ್ ಆಗಿ ಲಾಗಿನ್ ಮಾಡಿ.'
                    : 'Please log in with your Admin PIN to view analytics, charts, and financial reports.'}
                </p>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem' }}
                >
                  {lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್ ಮಾಡಿ' : 'Unlock with Admin PIN'}
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'records' && (
          <DataTable
            surveys={surveys}
            onSelectSurvey={(item) => setSelectedSurvey(item)}
            onSurveyDeleted={handleSurveyDeleted}
            onRefresh={loadData}
            lang={lang}
            isAdmin={isAdmin}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
            onEditSurvey={handleEditSurvey}
          />
        )}

        {activeTab === 'print' && (
          <PhysicalSurveyForm
            onBackToForm={() => setActiveTab('form')}
          />
        )}
      </main>

      {/* Full Details Modal */}
      {selectedSurvey && (
        <ShopDetailModal
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          lang={lang}
          isAdmin={isAdmin}
          onEditSurvey={handleEditSurvey}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        lang={lang}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        background: 'var(--bg-card)',
        transition: 'all 0.25s ease'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            Pork Retail Shop Outlet Survey Portal • Department of Animal Husbandry & Veterinary Services
          </div>
          <div
            className="kannada-text"
            style={{ fontSize: '0.78rem', cursor: 'default', userSelect: 'none' }}
            onClick={() => {
              window._footerClickCount = (window._footerClickCount || 0) + 1;
              clearTimeout(window._footerClickTimer);
              window._footerClickTimer = setTimeout(() => {
                window._footerClickCount = 0;
              }, 2000);
              if (window._footerClickCount >= 3) {
                window._footerClickCount = 0;
                setIsLoginModalOpen(true);
              }
            }}
          >
            ಕರ್ನಾಟಕ ಹಂದಿಮಾಂಸದ ಮಾರಾಟ ಅಂಗಡಿಗಳ ಸಮೀಕ್ಷೆ
          </div>
        </div>
      </footer>
    </div>
  );
}
