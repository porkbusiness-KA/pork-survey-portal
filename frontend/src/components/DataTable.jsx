import React, { useState } from 'react';
import {
  Search, Filter, Download, ExternalLink, Trash2, Eye,
  MapPin, Store, CheckCircle, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { DISTRICTS } from '../data/surveyQuestions';
import { getExportCSVUrl, deleteSurvey } from '../services/api';

export default function DataTable({ surveys, onSelectSurvey, onSurveyDeleted, onRefresh }) {
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedLicense, setSelectedLicense] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter surveys
  const filteredSurveys = surveys.filter(item => {
    const matchesSearch = search.trim() === '' ||
      item.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.place?.toLowerCase().includes(search.toLowerCase()) ||
      item.pincode?.includes(search);

    const matchesDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
    const matchesLicense = selectedLicense === 'All' || item.bbmp_license_issued === selectedLicense;
    const matchesRating = selectedRating === 'All' || item.cleanliness_rating >= parseInt(selectedRating, 10);

    return matchesSearch && matchesDistrict && matchesLicense && matchesRating;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage) || 1;
  const currentItems = filteredSurveys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (e, id, shopName) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete survey record for "${shopName}"?`)) {
      try {
        await deleteSurvey(id);
        if (onSurveyDeleted) onSurveyDeleted(id);
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleExport = () => {
    window.location.href = getExportCSVUrl();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Header & Export Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
            Survey Database Records
          </h1>
          <p className="kannada-text" style={{ fontSize: '0.95rem' }}>
            ಸಮೀಕ್ಷಾ ದತ್ತಾಂಶ ಕೋಷ್ಟಕ (ಒಟ್ಟು {filteredSurveys.length} ದಾಖಲೆಗಳು)
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn btn-primary"
          style={{ fontSize: '0.9rem' }}
        >
          <Download size={17} />
          <span>Export All Data to CSV (ಡೌನ್‌ಲೋಡ್)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search shop, owner, place..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
              className="form-select"
            >
              <option value="All">All Districts (ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು)</option>
              {DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.en}</option>
              ))}
            </select>
          </div>

          {/* BBMP License Filter */}
          <div>
            <select
              value={selectedLicense}
              onChange={(e) => { setSelectedLicense(e.target.value); setCurrentPage(1); }}
              className="form-select"
            >
              <option value="All">All License Status</option>
              <option value="Yes">BBMP Licensed (Yes)</option>
              <option value="No">Unlicensed (No)</option>
            </select>
          </div>

          {/* Cleanliness Rating Filter */}
          <div>
            <select
              value={selectedRating}
              onChange={(e) => { setSelectedRating(e.target.value); setCurrentPage(1); }}
              className="form-select"
            >
              <option value="All">All Cleanliness Ratings</option>
              <option value="5">5 Stars Only (★★★★★)</option>
              <option value="4">4+ Stars (★★★★☆)</option>
              <option value="3">3+ Stars (★★★☆☆)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>#ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>Shop Name & Location</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>Owner / SPOC</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>Rate (₹/Kg)</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>Daily Sale (Kg)</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>BBMP License</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>Rating</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No survey records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectSurvey(item)}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem', fontWeight: '700', color: '#e11d48' }}>
                      #{item.id}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.shop_name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                        <MapPin size={12} color="#e11d48" />
                        <span>{item.place} ({item.pincode}) • <strong style={{ color: 'var(--text-main)' }}>{item.district}</strong></span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{item.owner_name}</div>
                      {item.spoc_mobile && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>📞 {item.spoc_mobile}</div>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '700', color: '#059669' }}>₹{item.regular_meat_rate}</span>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                      {item.average_daily_sale_kg} Kg
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {item.bbmp_license_issued === 'Yes' ? (
                        <span className="badge badge-emerald">
                          <CheckCircle size={12} /> Licensed
                        </span>
                      ) : (
                        <span className="badge badge-amber">
                          <XCircle size={12} /> Pending / No
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: '#d97706', fontWeight: '700', fontSize: '0.9rem' }}>
                        {'★'.repeat(item.cleanliness_rating || 3)}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onSelectSurvey(item); }}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          title="View Details"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item.id, item.shop_name)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          title="Delete Survey"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-card-subtle)'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSurveys.length)} of {filteredSurveys.length} entries
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '600' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
