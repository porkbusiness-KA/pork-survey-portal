import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SurveyForm from './components/SurveyForm';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import ShopDetailModal from './components/ShopDetailModal';
import { fetchSurveys, fetchSurveyStats } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'dashboard' | 'records'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pork_portal_theme') || 'light';
  });
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pork_portal_lang') || 'en';
  });
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pork_portal_theme', theme);
  }, [theme]);

  // Persist language selection
  useEffect(() => {
    localStorage.setItem('pork_portal_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [surveysRes, statsRes] = await Promise.all([
        fetchSurveys(),
        fetchSurveyStats()
      ]);

      if (surveysRes.success) setSurveys(surveysRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSurveySubmitted = () => {
    loadData();
  };

  const handleSurveyDeleted = (id) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
    loadData();
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
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'form' && (
          <SurveyForm
            onSurveySubmitted={handleSurveySubmitted}
            onSwitchToDashboard={() => setActiveTab('dashboard')}
            onSwitchToRecords={() => setActiveTab('records')}
            lang={lang}
            onSetLang={setLang}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            surveys={surveys}
            onSelectSurvey={(item) => setSelectedSurvey(item)}
            onRefresh={loadData}
            onAddNewSurvey={() => setActiveTab('form')}
            lang={lang}
          />
        )}

        {activeTab === 'records' && (
          <DataTable
            surveys={surveys}
            onSelectSurvey={(item) => setSelectedSurvey(item)}
            onSurveyDeleted={handleSurveyDeleted}
            onRefresh={loadData}
            lang={lang}
          />
        )}
      </main>

      {/* Full Details Modal */}
      {selectedSurvey && (
        <ShopDetailModal
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          lang={lang}
        />
      )}

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
          <div className="kannada-text" style={{ fontSize: '0.78rem' }}>
            ಕರ್ನಾಟಕ ಹಂದಿಮಾಂಸದ ಚಿಲ್ಲರೆ ಅಂಗಡಿಗಳ ಸಮೀಕ್ಷೆ
          </div>
        </div>
      </footer>
    </div>
  );
}
