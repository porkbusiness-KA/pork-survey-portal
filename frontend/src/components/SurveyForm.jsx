import React, { useState } from 'react';
import {
  MapPin, Store, User, Clock, Calendar, Users, ShoppingBag,
  DollarSign, CheckSquare, Award, Phone, Image as ImageIcon,
  Send, Sparkles, Navigation, AlertCircle, CheckCircle2, Trash2,
  FileCheck, ShieldAlert, X, LayoutDashboard, Database, ArrowRight,
  Search, Check, Loader2, Compass
} from 'lucide-react';
import {
  DISTRICTS, PINCODE_DATABASE, HOLIDAY_OPTIONS, WORKER_OPTIONS,
  DAILY_CUSTOMER_OPTIONS, PEAK_DAY_OPTIONS, MEAT_TYPES_OPTIONS,
  PROCESSED_VOLUME_OPTIONS, PROCESSED_PRODUCT_TYPES,
  CUSTOMER_TYPE_OPTIONS, MASALA_OPTIONS
} from '../data/surveyQuestions';
import { TRANSLATIONS } from '../data/translations';
import TimePicker from './TimePicker';
import { submitSurvey } from '../services/api';

export default function SurveyForm({ onSurveySubmitted, onSwitchToDashboard, onSwitchToRecords, lang = 'en', onSetLang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const initialFormState = {
    country: '',
    state: '',
    district: '',
    taluk: '',
    village: '',
    place: '',
    pincode: '',
    shop_name: '',
    owner_name: '',
    owner_mobile: '',
    years_in_business: '',
    opening_time: '08:00',
    closing_time: '20:30',
    holiday_days: ['No holiday'],
    workers_count: '2',
    workers_other: '',
    daily_customers: '20–30',
    daily_customers_other: '',
    peak_customer_days: ['Sunday'],
    regular_meat_rate: '340',
    meat_types: ['Fresh meat (Pork)'],
    meat_types_other: '',
    processed_meat_volume: '<1 Kg',
    processed_meat_volume_other: '',
    processed_meat_products: ['Ham'],
    processed_meat_other: '',
    average_daily_sale_kg: '50',
    procurement_source: '',
    customer_type: 'Both localities and non-Localities',
    has_masalas: 'Yes',
    masalas_available: ['Both Chandrakala and Jeevith masala'],
    masala_other: '',
    bbmp_license_issued: 'No',
    bbmp_license_issues: 'No',
    bbmp_issue_reasons: '',
    cleanliness_rating: 0,
    behavior_rating: 0,
    spoc_same_as_owner: true,
    spoc_name: '',
    spoc_mobile: '',
    location_link: '',
    latitude: '',
    longitude: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState(null);
  const [pincodeAreas, setPincodeAreas] = useState([]);
  const [successModalData, setSuccessModalData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // AUTO-FETCH FULL LOCATION HIERARCHY (Country, State, District, Taluk, Village)
  const handlePincodeLookup = async (code) => {
    const pin = (code || '').trim();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPincodeSuccess(null);
      setPincodeAreas([]);
      return;
    }

    setIsFetchingPincode(true);

    // 1. Check offline local database first for instant lookup
    if (PINCODE_DATABASE[pin]) {
      const entry = PINCODE_DATABASE[pin];
      const talukName = entry.taluk || '';
      const villageName = entry.village || entry.areas?.[0] || entry.place;
      const combinedPlace = `${villageName}${talukName ? `, ${talukName} Taluk` : ''}`;

      setPincodeAreas(entry.areas || [entry.place]);
      setPincodeSuccess(`📍 Found: ${villageName} (Taluk: ${talukName || 'N/A'}, District: ${entry.district})`);
      setFormData(prev => ({
        ...prev,
        pincode: pin,
        country: entry.country || 'India',
        state: entry.state || 'Karnataka',
        district: entry.district,
        taluk: talukName,
        village: villageName,
        place: combinedPlace,
        latitude: entry.lat || prev.latitude,
        longitude: entry.lng || prev.longitude,
        location_link: `https://maps.google.com/?q=${entry.lat ? `${entry.lat},${entry.lng}` : encodeURIComponent(`${villageName}, ${talukName}, ${entry.district}, ${entry.state || 'Karnataka'} ${pin}`)}`
      }));
      setIsFetchingPincode(false);
      return;
    }

    // 2. Query India Post Free API
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data && data[0] && data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice || [];
        if (postOffices.length > 0) {
          const firstPO = postOffices[0];
          const distName = firstPO.District || '';
          const stateName = firstPO.State || 'Karnataka';
          const countryName = firstPO.Country || 'India';
          const talukName = firstPO.Block && firstPO.Block !== 'NA' ? firstPO.Block : (firstPO.Division || '');
          const villageName = firstPO.Name || '';
          const areaNames = postOffices.map(po => po.Name);

          const exactDistrict = distName || 'Karnataka';
          const combinedPlace = `${villageName}${talukName ? `, ${talukName} Taluk` : ''}${exactDistrict ? `, ${exactDistrict}` : ''}`;

          setPincodeAreas(areaNames);
          setPincodeSuccess(`📍 Found: ${villageName} | Taluk: ${talukName || 'N/A'} | District: ${exactDistrict} | State: ${stateName}`);
          setFormData(prev => ({
            ...prev,
            pincode: pin,
            country: countryName,
            state: stateName,
            district: exactDistrict,
            taluk: talukName,
            village: villageName,
            place: combinedPlace,
            location_link: `https://maps.google.com/?q=${encodeURIComponent(`${villageName}, ${talukName ? `${talukName} Taluk, ` : ''}${exactDistrict}, ${stateName} ${pin}`)}`
          }));
        } else {
          setPincodeSuccess(null);
        }
      } else {
        setPincodeSuccess(null);
      }
    } catch (err) {
      console.warn('Pincode fetch error:', err);
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const handlePincodeInput = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, pincode: val }));
    if (val.length === 6) {
      handlePincodeLookup(val);
    } else {
      setPincodeSuccess(null);
      setPincodeAreas([]);
    }
  };

  const handleSelectArea = (areaName) => {
    setFormData(prev => {
      const combinedPlace = `${areaName}${prev.taluk ? `, ${prev.taluk} Taluk` : ''}`;
      return {
        ...prev,
        village: areaName,
        place: combinedPlace,
        location_link: `https://maps.google.com/?q=${encodeURIComponent(`${areaName}, ${prev.taluk ? `${prev.taluk} Taluk, ` : ''}${prev.district}, ${prev.state} ${prev.pincode}`)}`
      };
    });
  };

  // Handle generic inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Toggle multi-select array values
  const handleMultiToggle = (field, item) => {
    // Special logic for holiday_days: mutual exclusion for 'No holiday'
    if (field === 'holiday_days') {
      setFormData(prev => {
        const currentList = prev[field] || [];
        const NO_HOLIDAY = 'No holiday';
        if (item === NO_HOLIDAY) {
          // If selecting 'No holiday' → clear everything, set only 'No holiday'
          if (currentList.includes(NO_HOLIDAY)) {
            return { ...prev, [field]: [] }; // deselect No holiday
          }
          return { ...prev, [field]: [NO_HOLIDAY] };
        } else {
          // Selecting a specific day → remove 'No holiday' if present
          const withoutNoHoliday = currentList.filter(x => x !== NO_HOLIDAY);
          if (withoutNoHoliday.includes(item)) {
            return { ...prev, [field]: withoutNoHoliday.filter(x => x !== item) };
          }
          return { ...prev, [field]: [...withoutNoHoliday, item] };
        }
      });
      return;
    }
    // Default toggle for other fields
    setFormData(prev => {
      const currentList = prev[field] || [];
      if (currentList.includes(item)) {
        return { ...prev, [field]: currentList.filter(x => x !== item) };
      } else {
        return { ...prev, [field]: [...currentList, item] };
      }
    });
  };

  // Geolocation auto-detection
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location_link: mapUrl
        }));
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert('Could not retrieve GPS coordinates. Please enter Google Maps link manually.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Image Upload handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      alert('You can upload a maximum of 5 images in total.');
      return;
    }

    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);

    const urls = updatedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    const urls = updatedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.cleanliness_rating || formData.cleanliness_rating === 0) {
      setErrorMessage('Please provide the Cleanliness rating (Internal rating at the bottom of the form).');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    if (!formData.behavior_rating || formData.behavior_rating === 0) {
      setErrorMessage('Please provide the Behavior rating (Internal rating at the bottom of the form).');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    if (!formData.shop_name.trim()) {
      setErrorMessage('Please enter the name of the pork shop (ಹಂದಿಮಾಂಸದ ಅಂಗಡಿಯ ಹೆಸರು).');
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }
    if (!formData.owner_name.trim()) {
      setErrorMessage("Please enter the shop's owner name (ಅಂಗಡಿಯ ಮಾಲೀಕರ ಹೆಸರು).");
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }
    if (!formData.location_link.trim()) {
      const fallbackLink = `https://maps.google.com/?q=${encodeURIComponent(formData.shop_name + ', ' + formData.place + ', ' + formData.district)}`;
      formData.location_link = fallbackLink;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      const effectiveSpocName = formData.spoc_same_as_owner ? formData.owner_name : (formData.spoc_name || formData.owner_name);
      
      const effectiveProcessedVolume = formData.processed_meat_volume === 'Other'
        ? (formData.processed_meat_volume_other ? `${formData.processed_meat_volume_other} Kg` : 'Other')
        : formData.processed_meat_volume;

      const combinedProcessed = [
        effectiveProcessedVolume,
        ...formData.processed_meat_products,
        formData.processed_meat_other
      ].filter(Boolean);

      Object.keys(formData).forEach(key => {
        if (['holiday_days', 'peak_customer_days', 'meat_types', 'masalas_available'].includes(key)) {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'spoc_name') {
          data.append('spoc_name', effectiveSpocName);
        } else {
          data.append(key, formData[key]);
        }
      });

      data.append('processed_meat_consumption', JSON.stringify(combinedProcessed));

      selectedFiles.forEach(file => {
        data.append('images', file);
      });

      const response = await submitSurvey(data);

      if (response.success) {
        setSuccessModalData({
          surveyId: response.surveyId,
          shop_name: formData.shop_name,
          owner_name: formData.owner_name,
          district: formData.district,
          place: formData.place
        });

        setFormData(initialFormState);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setPincodeAreas([]);
        setPincodeSuccess(null);
        if (onSurveySubmitted) onSurveySubmitted();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to submit survey.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOptLabel = (opt) => {
    if (typeof opt === 'string') return opt;
    if (lang === 'en') {
      return <div><div style={{ fontSize: '0.88rem', fontWeight: '500' }}>{opt.en}</div></div>;
    }
    if (lang === 'kn') {
      return <div><div className="kannada-text" style={{ fontSize: '0.88rem', fontWeight: '500' }}>{opt.kn || opt.en}</div></div>;
    }
    return (
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{opt.en}</div>
        <div className="kannada-text" style={{ fontSize: '0.72rem' }}>{opt.kn}</div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '2rem',
        marginBottom: '2rem',
        borderLeft: '5px solid #d97706',
        background: 'var(--banner-bg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.6rem' }}>
              <Sparkles size={13} /> {lang === 'en' ? 'Official Retail Survey Form' : lang === 'kn' ? 'ಅಧಿಕೃತ ಚಿಲ್ಲರೆ ಸಮೀಕ್ಷಾ ನಮೂನೆ' : 'Official Retail Survey Form (ಅಧಿಕೃತ ಸಮೀಕ್ಷೆ)'}
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {lang === 'kn' ? 'ಹಂದಿಮಾಂಸದ ಚಿಲ್ಲರೆ ಮಾರಾಟ ಅಂಗಡಿಗಳ ಸಮೀಕ್ಷಾ ನಮೂನೆ' : 'Pork Retail Shop Outlet Survey Form'}
            </h1>
            {lang !== 'en' && (
              <p className="kannada-text" style={{ fontSize: '1.05rem', color: 'var(--text-kannada)' }}>
                {lang === 'both' ? 'ಹಂದಿಮಾಂಸದ ಚಿಲ್ಲರೆ ಮಾರಾಟ ಅಂಗಡಿಗಳ ಸಮಗ್ರ ಸಮೀಕ್ಷಾ ನಮೂನೆ' : 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ಪಶುಸಂಗೋಪನೆ ಮತ್ತು ಪಶುವೈದ್ಯಕೀಯ ಸೇವಾ ಇಲಾಖೆ'}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {onSetLang && (
              <div style={{
                display: 'inline-flex',
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
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: lang === 'en' ? '700' : '500',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: lang === 'en' ? '#d97706' : 'transparent',
                    color: lang === 'en' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onSetLang('kn')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: lang === 'kn' ? '700' : '500',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: lang === 'kn' ? '#d97706' : 'transparent',
                    color: lang === 'kn' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  ಕನ್ನಡ
                </button>
                <button
                  type="button"
                  onClick={() => onSetLang('both')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: lang === 'both' ? '700' : '500',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: lang === 'both' ? '#d97706' : 'transparent',
                    color: lang === 'both' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  Both
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onSwitchToDashboard}
              className="btn btn-secondary"
              style={{ fontSize: '0.88rem' }}
            >
              📊 {lang === 'en' ? 'View Dashboard' : lang === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ವೀಕ್ಷಿಸಿ' : 'View Dashboard (ಡ್ಯಾಶ್‌ಬೋರ್ಡ್)'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="glass-card animate-fade-in" style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#dc2626'
        }}>
          <AlertCircle size={22} />
          <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>{errorMessage}</div>
        </div>
      )}

      {/* Survey Form Card */}
      <form onSubmit={handleSubmit}>
        
        {/* SECTION 1: Complete Location Hierarchy */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>

          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ background: 'rgba(225,29,72,0.12)', borderRadius: '10px', padding: '0.45rem' }}>
                <MapPin size={20} color="#d97706" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0 }}>{t.sec1Title}</h2>
                <p className="kannada-text" style={{ fontSize: '0.82rem', margin: '0.1rem 0 0', color: 'var(--text-muted)' }}>{t.sec1Sub}</p>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.12)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '20px', padding: '0.3rem 0.75rem', fontWeight: '600' }}>
              {t.autoFillBadge}
            </span>
          </div>

          {/* ROW 1: Pincode */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700' }}>
              {t.q1} <span className="required-star">*</span>
            </label>
            <div style={{ position: 'relative', maxWidth: '360px' }}>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handlePincodeInput}
                placeholder="Enter 6-digit pincode (e.g. 562123)"
                maxLength="6"
                className="form-input"
                style={{ letterSpacing: '0.15em', fontWeight: '600', fontSize: '1rem' }}
                required
              />
              {isFetchingPincode && (
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#d97706' }}>
                  <Loader2 size={18} className="pulse-glow" />
                </span>
              )}
              {!isFetchingPincode && formData.country && (
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }}>
                  <CheckCircle2 size={18} />
                </span>
              )}
            </div>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
              💡 {t.q1Hint}
            </small>
          </div>

          {/* PINCODE RESULT BANNER */}
          {pincodeSuccess && (
            <div className="animate-fade-in" style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.28)',
              borderRadius: '10px',
              padding: '0.7rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: '#059669', fontWeight: '600', fontSize: '0.84rem', lineHeight: '1.5' }}>{pincodeSuccess}</span>
            </div>
          )}

          {/* ROW 2: Country | State */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                {t.q2} <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Auto-filled from pincode"
                className="form-input"
                style={{ background: formData.country ? '' : 'rgba(var(--bg-card-rgb, 18,18,26), 0.5)' }}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                {t.q3} <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Auto-filled from pincode"
                className="form-input"
                style={{ background: formData.state ? '' : 'rgba(var(--bg-card-rgb, 18,18,26), 0.5)' }}
                required
              />
            </div>
          </div>

          {/* ROW 3: District | Taluk */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                {t.q4} <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Auto-filled from pincode"
                className="form-input"
                style={{ background: formData.district ? '' : 'rgba(var(--bg-card-rgb, 18,18,26), 0.5)' }}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                {t.q5} <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="taluk"
                value={formData.taluk}
                onChange={handleChange}
                placeholder="Auto-filled from pincode"
                className="form-input"
                style={{ background: formData.taluk ? '' : 'rgba(var(--bg-card-rgb, 18,18,26), 0.5)' }}
                required
              />
            </div>
          </div>

          {/* ROW 4: Village (with chips below) */}
          <div className="form-group" style={{ marginBottom: pincodeAreas.length > 1 ? '0.75rem' : '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
              {t.q6} <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="Auto-filled · or tap a chip below to select"
              className="form-input"
              style={{ background: formData.village ? '' : 'rgba(var(--bg-card-rgb, 18,18,26), 0.5)' }}
              required
            />
          </div>

          {/* VILLAGE CHIPS */}
          {pincodeAreas.length > 1 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>
                {t.selectVillagePill} {pincodeAreas.length} found under pincode {formData.pincode}:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {pincodeAreas.map((area, idx) => {
                  const isSelected = formData.village === area;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectArea(area)}
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        border: isSelected ? '1.5px solid #10b981' : '1.5px solid var(--border-color)',
                        background: isSelected ? 'rgba(16,185,129,0.18)' : 'transparent',
                        color: isSelected ? '#059669' : 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      {isSelected && <CheckCircle2 size={12} />}
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ROW 5: Complete Address */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
              {t.q7} <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              placeholder="e.g. Arasinakunte Village, Nelamangala Taluk, Bengaluru Rural"
              className="form-input"
              required
            />
          </div>

        </div>

        {/* SECTION 2: Shop & Owner Info (Q8, Q9, Q10, Q11, Q12, Q13) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Store size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.sec2Title}</h2>
              <p className="kannada-text">{t.sec2Sub}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                {t.q8} <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="shop_name"
                value={formData.shop_name}
                onChange={handleChange}
                placeholder="e.g. St. Anthony Fresh Pork Meat Centre"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.q9} <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                placeholder="e.g. Francis Fernandes"
                className="form-input"
                required
              />
            </div>

            {/* Owner's Mobile Number */}
            <div className="form-group">
              <label className="form-label">
                {t.q10}
              </label>
              <input
                type="tel"
                name="owner_mobile"
                value={formData.owner_mobile || ''}
                onChange={handleChange}
                placeholder="e.g. 9845012345"
                maxLength="12"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.q11}
              </label>
              <input
                type="number"
                name="years_in_business"
                value={formData.years_in_business}
                onChange={handleChange}
                placeholder="e.g. 10"
                min="0"
                className="form-input"
              />
            </div>

            {/* Q12: SPOC Name */}
            <div className="form-group">
              <label className="form-label">
                {t.q12} <span className="required-star">*</span>
              </label>
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    name="spoc_same_as_owner"
                    checked={formData.spoc_same_as_owner}
                    onChange={handleChange}
                    style={{ accentColor: '#d97706' }}
                  />
                  <span>{t.q12SameAsOwner}</span>
                </label>
              </div>
              {!formData.spoc_same_as_owner ? (
                <input
                  type="text"
                  name="spoc_name"
                  value={formData.spoc_name}
                  onChange={handleChange}
                  placeholder="Enter SPOC full name"
                  className="form-input"
                  required={!formData.spoc_same_as_owner}
                />
              ) : (
                <input
                  type="text"
                  value={formData.owner_name ? `${formData.owner_name} (Owner)` : '(Will mirror Owner Name)'}
                  className="form-input"
                  disabled
                  style={{ opacity: 0.75, background: 'var(--bg-card-subtle)' }}
                />
              )}
            </div>

            {/* Q13: SPOC Mobile */}
            <div className="form-group">
              <label className="form-label">
                {t.q13}
              </label>
              <input
                type="tel"
                name="spoc_mobile"
                value={formData.spoc_mobile}
                onChange={handleChange}
                placeholder="e.g. 9845012345"
                maxLength="12"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Timings & Weekly Holidays (Q14, Q15, Q16) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Clock size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.sec3Title}</h2>
              <p className="kannada-text">{t.sec3Sub}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Opening Time */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                {t.q14} <span className="required-star">*</span>
              </label>
              <TimePicker
                name="opening_time"
                value={formData.opening_time}
                onChange={handleChange}
                required
              />
            </div>

            {/* Closing Time */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                {t.q15} <span className="required-star">*</span>
              </label>
              <TimePicker
                name="closing_time"
                value={formData.closing_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.q16}
            </label>

            {/* No holiday banner */}
            {formData.holiday_days.includes('No holiday') && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(16,185,129,0.09)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '10px', padding: '0.55rem 0.9rem', marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '1rem' }}>🎉</span>
                <span style={{ fontSize: '0.84rem', color: '#059669', fontWeight: '600' }}>
                  {t.q16NoHolidayBanner}
                </span>
                <span style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {t.q16DeselectHint}
                </span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {HOLIDAY_OPTIONS.map(opt => {
                const NO_HOLIDAY = 'No holiday';
                const noHolidayActive = formData.holiday_days.includes(NO_HOLIDAY);
                const isSelected = formData.holiday_days.includes(opt.id);
                // Disable regular day options when 'No holiday' is selected
                const isDisabled = noHolidayActive && opt.id !== NO_HOLIDAY;

                return (
                  <label
                    key={opt.id}
                    title={isDisabled ? t.q16DeselectHint : ''}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      background: isSelected
                        ? (opt.id === NO_HOLIDAY ? 'rgba(16,185,129,0.13)' : 'rgba(225,29,72,0.12)')
                        : isDisabled ? 'rgba(0,0,0,0.04)' : 'var(--bg-card-subtle)',
                      border: isSelected
                        ? (opt.id === NO_HOLIDAY ? '1px solid #10b981' : '1px solid #d97706')
                        : '1px solid var(--border-color)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.4 : 1,
                      transition: 'all 0.15s ease',
                      userSelect: 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => !isDisabled && handleMultiToggle('holiday_days', opt.id)}
                      style={{ accentColor: opt.id === NO_HOLIDAY ? '#10b981' : '#d97706', cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    />
                    <div>{renderOptLabel(opt)}</div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 4: Operations & Customer Footfall (Q17, Q18, Q19) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Users size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.sec4Title}</h2>
              <p className="kannada-text">{t.sec4Sub}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                {t.q17} <span className="required-star">*</span>
              </label>
              <select
                name="workers_count"
                value={formData.workers_count}
                onChange={handleChange}
                className="form-select"
              >
                {WORKER_OPTIONS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              {formData.workers_count === 'Other' && (
                <input
                  type="text"
                  name="workers_other"
                  value={formData.workers_other}
                  onChange={handleChange}
                  placeholder="Specify worker count..."
                  className="form-input"
                  style={{ marginTop: '0.5rem' }}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.q18}
              </label>
              <select
                name="daily_customers"
                value={formData.daily_customers}
                onChange={handleChange}
                className="form-select"
              >
                {DAILY_CUSTOMER_OPTIONS.map(c => (
                  <option key={c} value={c}>{c} {t.customersPerDay}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.q19}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.6rem' }}>
              {PEAK_DAY_OPTIONS.map(p => {
                const isSelected = formData.peak_customer_days.includes(p.id);
                return (
                  <label
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-card-subtle)',
                      border: isSelected ? '1px solid #d97706' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiToggle('peak_customer_days', p.id)}
                      style={{ accentColor: '#d97706' }}
                    />
                    <div>{renderOptLabel(p)}</div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 5: Meat Products & Sales (Q20, Q21, Q22, Q23, Q24, Q25) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShoppingBag size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.sec5Title}</h2>
              <p className="kannada-text">{t.sec5Sub}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                {t.q20} <span className="required-star">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '700' }}>₹</span>
                <input
                  type="number"
                  name="regular_meat_rate"
                  value={formData.regular_meat_rate}
                  onChange={handleChange}
                  placeholder="340"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.q21}
              </label>
              <input
                type="number"
                name="average_daily_sale_kg"
                value={formData.average_daily_sale_kg}
                onChange={handleChange}
                placeholder="50"
                className="form-input"
              />
            </div>
          </div>

          {/* Q22: Meat Types */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.q22} <span className="required-star">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem' }}>
              {MEAT_TYPES_OPTIONS.map(m => {
                const isSelected = formData.meat_types.includes(m.id);
                return (
                  <label
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-card-subtle)',
                      border: isSelected ? '1px solid #d97706' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiToggle('meat_types', m.id)}
                      style={{ accentColor: '#d97706' }}
                    />
                    <div>{renderOptLabel(m)}</div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Q23: Processed Meat Products */}
          <div className="form-group" style={{ marginBottom: '1.5rem', background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem', fontWeight: '700' }}>
              {t.q23}
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* Dropdown 1: Weekly Volume */}
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  {t.q23Volume}
                </label>
                <select
                  name="processed_meat_volume"
                  value={formData.processed_meat_volume}
                  onChange={handleChange}
                  className="form-select"
                  style={{ fontSize: '0.92rem' }}
                >
                  {PROCESSED_VOLUME_OPTIONS.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>

                {formData.processed_meat_volume === 'Other' && (
                  <div className="animate-fade-in" style={{ marginTop: '0.65rem' }}>
                    <input
                      type="text"
                      name="processed_meat_volume_other"
                      value={formData.processed_meat_volume_other || ''}
                      onChange={handleChange}
                      placeholder={lang === 'kn' ? 'ಉದಾಹರಣೆಗೆ: 15 ಕೆಜಿ ಅಥವಾ 25 ಕೆಜಿ' : 'e.g. 15 Kg or 25 Kg'}
                      className="form-input"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Dropdown 2: Product Variety */}
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  {t.q23Varieties}
                </label>
                <select
                  name="processed_meat_product"
                  value={Array.isArray(formData.processed_meat_products) ? (formData.processed_meat_products[0] || 'Ham') : formData.processed_meat_products}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, processed_meat_products: [val] }));
                  }}
                  className="form-select"
                  style={{ fontSize: '0.92rem' }}
                >
                  {PROCESSED_PRODUCT_TYPES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {(Array.isArray(formData.processed_meat_products) ? formData.processed_meat_products.includes('Others') : formData.processed_meat_products === 'Others') && (
                  <div className="animate-fade-in" style={{ marginTop: '0.65rem' }}>
                    <input
                      type="text"
                      name="processed_meat_other"
                      value={formData.processed_meat_other || ''}
                      onChange={handleChange}
                      placeholder={lang === 'kn' ? 'ಇತರ ಸಂಸ್ಕರಿಸಿದ ಮಾಂಸದ ವಿಧ ನಮೂದಿಸಿ...' : 'Specify other processed meat product...'}
                      className="form-input"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                {t.q24}
              </label>
              <input
                type="text"
                name="procurement_source"
                value={formData.procurement_source}
                onChange={handleChange}
                placeholder="e.g. Registered piggeries in Hoskote, KGF, or Mandya"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.q25}
              </label>
              <select
                name="customer_type"
                value={formData.customer_type}
                onChange={handleChange}
                className="form-select"
              >
                {CUSTOMER_TYPE_OPTIONS.map(c => (
                  <option key={c.id} value={c.id}>
                    {lang === 'en' ? c.en : lang === 'kn' ? c.kn : `${c.en} (${c.kn})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 6: Masala Availability (Q26) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Sparkles size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.sec6Title}</h2>
              <p className="kannada-text">{t.sec6Sub}</p>
            </div>
          </div>

          {/* STEP 1: Are masalas sold? (Yes / No) */}
          <div className="form-group" style={{ marginBottom: formData.has_masalas === 'Yes' ? '1.25rem' : '0' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              {t.q26} <span className="required-star">*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem' }}>
              {['Yes', 'No'].map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '500' }}>
                  <input
                    type="radio"
                    name="has_masalas"
                    value={val}
                    checked={formData.has_masalas === val}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        has_masalas: v,
                        masalas_available: v === 'Yes'
                          ? (prev.masalas_available && prev.masalas_available[0] === 'None' ? ['Both Chandrakala and Jeevith masala'] : prev.masalas_available)
                          : ['None']
                      }));
                    }}
                    style={{ accentColor: '#d97706' }}
                  />
                  <span>{val === 'Yes' ? (lang === 'kn' ? 'ಹೌದು' : lang === 'both' ? 'Yes (ಹೌದು)' : 'Yes') : (lang === 'kn' ? 'ಇಲ್ಲ' : lang === 'both' ? 'No (ಇಲ್ಲ)' : 'No')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* STEP 2: If Yes, show dropdown for masala brands */}
          {formData.has_masalas === 'Yes' && (
            <div className="form-group animate-fade-in" style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.15rem',
              margin: 0
            }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                {t.q26Brand} <span className="required-star">*</span>
              </label>
              <select
                name="masalas_available"
                value={Array.isArray(formData.masalas_available) ? (formData.masalas_available[0] || 'Both Chandrakala and Jeevith masala') : formData.masalas_available}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, masalas_available: [val] }));
                }}
                className="form-select"
                style={{ fontSize: '0.95rem' }}
              >
                {MASALA_OPTIONS.map(m => (
                  <option key={m.id} value={m.id}>
                    {lang === 'en' ? m.en : lang === 'kn' ? m.kn : `${m.en} (${m.kn})`}
                  </option>
                ))}
              </select>

              {(Array.isArray(formData.masalas_available) ? formData.masalas_available.includes('Other') : formData.masalas_available === 'Other') && (
                <div className="animate-fade-in" style={{ marginTop: '0.85rem' }}>
                  <input
                    type="text"
                    name="masala_other"
                    value={formData.masala_other || ''}
                    onChange={handleChange}
                    placeholder={lang === 'kn' ? 'ಇತರ ಮಸಾಲಾ ಬ್ರಾಂಡ್‌ಗಳ ಹೆಸರು ನಮೂದಿಸಿ...' : 'Specify other masala brand name...'}
                    className="form-input"
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* If No, helpful confirmation banner */}
          {formData.has_masalas === 'No' && (
            <div className="animate-fade-in" style={{
              marginTop: '0.85rem',
              padding: '0.6rem 0.9rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#059669',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} />
              <span>{lang === 'kn' ? 'ಈ ಅಂಗಡಿಯಲ್ಲಿ ಯಾವುದೇ ಹಂದಿ ಮಸಾಲಾಗಳು ಲಭ್ಯವಿಲ್ಲ / ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ.' : 'No pork masalas are sold in this shop.'}</span>
            </div>
          )}
        </div>

        {/* SECTION 7: BBMP Trade Licensing (Q27, Q28, Q29) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <FileCheck size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.sec7Title}</h2>
              <p className="kannada-text">{t.sec7Sub}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: formData.bbmp_license_issues === 'Yes' ? '1.25rem' : '0' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                {t.q27}
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                {['Yes', 'No'].map(val => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input
                      type="radio"
                      name="bbmp_license_issued"
                      value={val}
                      checked={formData.bbmp_license_issued === val}
                      onChange={handleChange}
                      style={{ accentColor: '#d97706' }}
                    />
                    <span>{val === 'Yes' ? (lang === 'kn' ? 'ಹೌದು' : lang === 'both' ? 'Yes (ಹೌದು)' : 'Yes') : (lang === 'kn' ? 'ಇಲ್ಲ' : lang === 'both' ? 'No (ಇಲ್ಲ)' : 'No')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                {t.q28}
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                {['Yes', 'No'].map(val => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input
                      type="radio"
                      name="bbmp_license_issues"
                      value={val}
                      checked={formData.bbmp_license_issues === val}
                      onChange={handleChange}
                      style={{ accentColor: '#d97706' }}
                    />
                    <span>{val === 'Yes' ? (lang === 'kn' ? 'ಹೌದು' : lang === 'both' ? 'Yes (ಹೌದು)' : 'Yes') : (lang === 'kn' ? 'ಇಲ್ಲ' : lang === 'both' ? 'No (ಇಲ್ಲ)' : 'No')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {formData.bbmp_license_issues === 'Yes' && (
            <div className="form-group animate-fade-in" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
              <label className="form-label">
                {t.q29}
              </label>
              <textarea
                name="bbmp_issue_reasons"
                value={formData.bbmp_issue_reasons}
                onChange={handleChange}
                placeholder="Explain the issues faced with BBMP trade licensing..."
                rows="2"
                className="form-textarea"
              />
            </div>
          )}
        </div>

        {/* SECTION 8: Shop Photos & Map Link (Q31, Q32) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ImageIcon size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.sec8Title}</h2>
              <p className="kannada-text">{t.sec8Sub}</p>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              {t.q31}
            </label>

            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '14px',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--bg-card-subtle)',
            }}>
              {/* Hidden file inputs */}
              <input
                type="file"
                id="shop-image-input"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <input
                type="file"
                id="shop-camera-input"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {/* Icon */}
              <ImageIcon size={36} color="#d97706" style={{ marginBottom: '0.75rem' }} />

              {/* Two buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <label htmlFor="shop-image-input" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  cursor: 'pointer', padding: '0.55rem 1.1rem',
                  background: 'rgba(217,119,6,0.12)', border: '1px solid #d97706',
                  borderRadius: '10px', fontWeight: '600', fontSize: '0.85rem',
                  color: '#d97706', transition: 'all 0.2s'
                }}>
                  📁 {t.q31UploadHint}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    // Create a fresh input each click to ensure camera app opens directly
                    const camInput = document.createElement('input');
                    camInput.type = 'file';
                    camInput.accept = 'image/*';
                    camInput.capture = 'environment';
                    camInput.onchange = handleImageChange;
                    camInput.click();
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    cursor: 'pointer', padding: '0.55rem 1.1rem',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981',
                    borderRadius: '10px', fontWeight: '600', fontSize: '0.85rem',
                    color: '#10b981', transition: 'all 0.2s'
                  }}
                >
                  📷 {t.q31CameraBtn}
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                {t.q31UploadSub}
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {previewUrls.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              {t.q32} <span className="required-star">*</span>
            </label>
            
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <input
                  type="url"
                  name="location_link"
                  value={formData.location_link}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=..."
                  className="form-input"
                />
              </div>

              <button
                type="button"
                onClick={handleFetchLocation}
                disabled={isLocating}
                className="btn btn-secondary"
                style={{ whiteSpace: 'nowrap', borderColor: '#d97706' }}
              >
                <Navigation size={16} color="#d97706" />
                <span>{isLocating ? t.q32Locating : t.q32GpsBtn}</span>
              </button>
            </div>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'block' }}>
              {t.q32Hint}
            </small>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '3rem' }}>
          <button
            type="button"
            onClick={() => setFormData(initialFormState)}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            {t.resetBtn}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', minWidth: '220px' }}
          >
            {isSubmitting ? (
              <span>{t.submittingBtn}</span>
            ) : (
              <>
                <Send size={18} />
                <span>{t.submitBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Subtle Ratings (Hidden in plain sight) */}
        <div style={{ marginTop: '2rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.4, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9} onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}>
          <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginRight: '0.5rem', userSelect: 'none', width: '45px', textAlign: 'right' }}>Clean:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setFormData(prev => ({ ...prev, cleanliness_rating: star }))}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  opacity: formData.cleanliness_rating >= star ? 1 : 0.2,
                  padding: '2px',
                  outline: 'none'
                }}
                title="Cleanliness Rating"
              >
                ⭐
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginRight: '0.5rem', userSelect: 'none', width: '45px', textAlign: 'right' }}>Behavior:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setFormData(prev => ({ ...prev, behavior_rating: star }))}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  opacity: formData.behavior_rating >= star ? 1 : 0.2,
                  padding: '2px',
                  outline: 'none'
                }}
                title="Behavior Rating"
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

      </form>

      {/* POPUP CONFIRMATION MODAL ON SUCCESS */}
      {successModalData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '1.5rem'
        }}>
          <div
            className="glass-card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '2.25rem',
              textAlign: 'center',
              position: 'relative',
              background: 'var(--modal-bg)',
              border: '2px solid #10b981',
              boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSuccessModalData(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Success Icon */}
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={44} />
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {t.surveySuccessTitle}
            </h2>
            <p className="kannada-text" style={{ fontSize: '0.95rem', color: '#059669', marginBottom: '1.25rem', fontWeight: '600' }}>
              {t.surveySuccessSub}
            </p>

            {/* Stored Details Card */}
            <div style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Survey Record ID:</span>
                <span style={{ fontWeight: '800', color: '#d97706' }}>#{successModalData.surveyId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shop Name:</span>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{successModalData.shop_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Owner:</span>
                <span style={{ color: 'var(--text-main)' }}>{successModalData.owner_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                <span style={{ color: 'var(--text-main)' }}>{successModalData.place}, {successModalData.district}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setSuccessModalData(null);
                  if (onSwitchToDashboard) onSwitchToDashboard();
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <LayoutDashboard size={17} />
                <span>Go to Analytics Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setSuccessModalData(null);
                  if (onSwitchToRecords) onSwitchToRecords();
                }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <Database size={17} />
                <span>{t.viewInTableBtn}</span>
              </button>

              <button
                onClick={() => setSuccessModalData(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  padding: '0.35rem'
                }}
              >
                + {t.submitAnotherBtn}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
