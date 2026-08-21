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
import { submitSurvey } from '../services/api';

export default function SurveyForm({ onSurveySubmitted, onSwitchToDashboard, onSwitchToRecords }) {
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
    years_in_business: '',
    opening_time: '08:00 AM',
    closing_time: '08:30 PM',
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
    processed_meat_products: [],
    processed_meat_other: '',
    average_daily_sale_kg: '50',
    procurement_source: '',
    customer_type: 'Both localities and non-Localities',
    masalas_available: ['Both Chandrakala and Jeevith masala'],
    masala_other: '',
    bbmp_license_issued: 'No',
    bbmp_license_issues: 'No',
    bbmp_issue_reasons: '',
    cleanliness_rating: 4,
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
      
      const combinedProcessed = [
        formData.processed_meat_volume,
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

  return (
    <div style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '2rem',
        marginBottom: '2rem',
        borderLeft: '5px solid #e11d48',
        background: 'var(--banner-bg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.6rem' }}>
              <Sparkles size={13} /> Official Retail Survey Form
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Pork Retail Shop Outlet Survey Form
            </h1>
            <p className="kannada-text" style={{ fontSize: '1.05rem', color: 'var(--text-kannada)' }}>
              ಹಂದಿಮಾಂಸದ ಚಿಲ್ಲರೆ ಮಾರಾಟ ಅಂಗಡಿಗಳ ಸಮಗ್ರ ಸಮೀಕ್ಷಾ ನಮೂನೆ
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToDashboard}
            className="btn btn-secondary"
            style={{ fontSize: '0.88rem' }}
          >
            📊 View Real-Time Dashboard
          </button>
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
                <MapPin size={20} color="#e11d48" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0 }}>1. Location Details</h2>
                <p className="kannada-text" style={{ fontSize: '0.82rem', margin: '0.1rem 0 0', color: 'var(--text-muted)' }}>ದೇಶ · ರಾಜ್ಯ · ಜಿಲ್ಲೆ · ತಾಲ್ಲೂಕು · ಗ್ರಾಮ</p>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.12)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '20px', padding: '0.3rem 0.75rem', fontWeight: '600' }}>
              ⚡ Type Pincode → Auto-fills all fields
            </span>
          </div>

          {/* ROW 1: Pincode (full width, prominent) */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: '700' }}>
              Pincode <span className="required-star">*</span>
              <span className="kannada-text" style={{ display: 'block', fontWeight: '400', fontSize: '0.78rem' }}>ಪಿನ್‌ಕೋಡ್ (6 ಸಂಖ್ಯೆಗಳು)</span>
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
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#e11d48' }}>
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
              💡 All location fields below are auto‑filled once you enter a valid pincode
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
                Country <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block', fontWeight: '400', fontSize: '0.77rem' }}>ದೇಶ</span>
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
                State <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block', fontWeight: '400', fontSize: '0.77rem' }}>ರಾಜ್ಯ</span>
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
                District <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block', fontWeight: '400', fontSize: '0.77rem' }}>ಜಿಲ್ಲೆ</span>
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
                Taluk / Block <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block', fontWeight: '400', fontSize: '0.77rem' }}>ತಾಲ್ಲೂಕು</span>
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
              Village / Town / Locality <span className="required-star">*</span>
              <span className="kannada-text" style={{ display: 'block', fontWeight: '400', fontSize: '0.77rem' }}>ಗ್ರಾಮ / ಪಟ್ಟಣ</span>
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
                🏘️ Select your village / locality — {pincodeAreas.length} found under pincode {formData.pincode}:
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
              Complete Shop Address <span className="required-star">*</span>
              <span className="kannada-text" style={{ display: 'block', fontWeight: '400', fontSize: '0.77rem' }}>ಸ್ಥಳದ ಸಂಪೂರ್ಣ ವಿಳಾಸ</span>
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

        {/* SECTION 2: Shop & Owner Info (Q5, Q6, Q7, Q25, Q26) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Store size={20} color="#e11d48" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>2. Shop & Owner Details</h2>
              <p className="kannada-text">ಅಂಗಡಿ, ಮಾಲೀಕರ ಮತ್ತು ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಯ ವಿವರಗಳು</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                5. Name of Pork Shop <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block' }}>(ಹಂದಿಮಾಂಸದ ಅಂಗಡಿಯ ಹೆಸರು)</span>
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
                6. Shop's Owner Name <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಯ ಮಾಲೀಕರ ಹೆಸರು)</span>
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

            <div className="form-group">
              <label className="form-label">
                7. From how many years the shop is there?
                <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿ ಎಷ್ಟು ವರ್ಷದಿಂದ ಇದೆ?)</span>
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

            {/* Q25: SPOC Name */}
            <div className="form-group">
              <label className="form-label">
                25. Name of SPOC of shop <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block' }}>(ಸಂಪರ್ಕಿಸಬೇಕಾದ ವ್ಯಕ್ತಿಯ ಹೆಸರು)</span>
              </label>
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    name="spoc_same_as_owner"
                    checked={formData.spoc_same_as_owner}
                    onChange={handleChange}
                    style={{ accentColor: '#e11d48' }}
                  />
                  <span>Same as owner's name (ಮಾಲೀಕರ ಹೆಸರೇ SPOC)</span>
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

            {/* Q26: SPOC Mobile */}
            <div className="form-group">
              <label className="form-label">
                26. Mobile number of SPOC
                <span className="kannada-text" style={{ display: 'block' }}>(ಸಂಪರ್ಕಿಸಬೇಕಾದ ವ್ಯಕ್ತಿಯ ದೂರವಾಣಿ ಸಂಖ್ಯೆ)</span>
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

        {/* SECTION 3: Timings & Weekly Holidays (Q8, Q9, Q10) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Clock size={20} color="#e11d48" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>3. Shop Timings & Weekly Holidays</h2>
              <p className="kannada-text">ಅಂಗಡಿ ತೆರೆಯುವ/ಮುಚ್ಚುವ ಸಮಯ ಮತ್ತು ರಜೆ ದಿನಗಳು</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">
                8. Opening Time of Shop <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿ ತೆರೆಯುವ ಸಮಯ)</span>
              </label>
              <input
                type="text"
                name="opening_time"
                value={formData.opening_time}
                onChange={handleChange}
                placeholder="e.g. 07:30 AM"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                9. Closing Time of Shop <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿ ಮುಚ್ಚುವ ಸಮಯ)</span>
              </label>
              <input
                type="text"
                name="closing_time"
                value={formData.closing_time}
                onChange={handleChange}
                placeholder="e.g. 09:00 PM"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              10. On which day the shop will be holiday?
              <span className="kannada-text" style={{ display: 'block' }}>(ಯಾವ ದಿನ ಅಂಗಡಿಯನ್ನು ಮುಚ್ಚಲಾಗುತ್ತದೆ?)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {HOLIDAY_OPTIONS.map(opt => {
                const isSelected = formData.holiday_days.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-card-subtle)',
                      border: isSelected ? '1px solid #e11d48' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiToggle('holiday_days', opt.id)}
                      style={{ accentColor: '#e11d48' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', color: isSelected ? '#e11d48' : 'var(--text-main)', fontWeight: isSelected ? '600' : 'normal' }}>{opt.en}</div>
                      <div className="kannada-text" style={{ fontSize: '0.72rem' }}>{opt.kn}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 4: Operations & Customer Footfall (Q11, Q12, Q13) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Users size={20} color="#e11d48" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>4. Workers & Customer Footfall</h2>
              <p className="kannada-text">ಕಾರ್ಮಿಕರ ಸಂಖ್ಯೆ ಮತ್ತು ಗ್ರಾಹಕರ ಭೇಟಿ ವಿವರ</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                11. Number of Workers in Shop <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಯಲ್ಲಿರುವ ಕಾರ್ಮಿಕರ ಸಂಖ್ಯೆ)</span>
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
                12. Daily Customer Visits
                <span className="kannada-text" style={{ display: 'block' }}>(ದೈನಂದಿನ ಆಧಾರದಲ್ಲಿ ಎಷ್ಟು ಗ್ರಾಹಕರು ಭೇಟಿ ನೀಡುತ್ತಾರೆ?)</span>
              </label>
              <select
                name="daily_customers"
                value={formData.daily_customers}
                onChange={handleChange}
                className="form-select"
              >
                {DAILY_CUSTOMER_OPTIONS.map(c => (
                  <option key={c} value={c}>{c} Customers / day</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              13. On which day customers visit most to shop?
              <span className="kannada-text" style={{ display: 'block' }}>(ಯಾವ ದಿನ ಗ್ರಾಹಕರು ಅಂಗಡಿಗೆ ಹೆಚ್ಚು ಭೇಟಿ ನೀಡುತ್ತಾರೆ?)</span>
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
                      border: isSelected ? '1px solid #e11d48' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiToggle('peak_customer_days', p.id)}
                      style={{ accentColor: '#e11d48' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', color: isSelected ? '#e11d48' : 'var(--text-main)', fontWeight: isSelected ? '600' : 'normal' }}>{p.en}</div>
                      <div className="kannada-text" style={{ fontSize: '0.72rem' }}>{p.kn}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 5: Meat Products & Sales (Q14, Q15, Q16, Q17, Q18, Q19) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShoppingBag size={20} color="#e11d48" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>5. Meat Products, Pricing & Sales Volume</h2>
              <p className="kannada-text">ಮಾಂಸದ ವಿಧಗಳು, ದರ ಮತ್ತು ಮಾರಾಟ ಪ್ರಮಾಣ</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                14. Regular Meat Rate (₹ per Kg) <span className="required-star">*</span>
                <span className="kannada-text" style={{ display: 'block' }}>(ಪ್ರತಿ ಕೆಜಿಗೆ ಸಾಮಾನ್ಯ ಮಾಂಸದ ದರ ಎಷ್ಟು?)</span>
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
                17. Average Daily Meat Sale (Kg/day)
                <span className="kannada-text" style={{ display: 'block' }}>(ದಿನಕ್ಕೆ ಸರಾಸರಿ ಮಾಂಸ ಮಾರಾಟ ಕೆಜಿಯಲ್ಲಿ)</span>
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

          {/* Q15: Meat Types */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              15. What types of meat available in shop? <span className="required-star">*</span>
              <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಮಾಂಸದ ವಿಧಗಳು?)</span>
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
                      border: isSelected ? '1px solid #e11d48' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiToggle('meat_types', m.id)}
                      style={{ accentColor: '#e11d48' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', color: isSelected ? '#e11d48' : 'var(--text-main)', fontWeight: isSelected ? '600' : 'normal' }}>{m.en}</div>
                      <div className="kannada-text" style={{ fontSize: '0.72rem' }}>{m.kn}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Q16: Processed Meat Products */}
          <div className="form-group" style={{ marginBottom: '1.5rem', background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              16. Processed Meat Products Consumption in a Week
              <span className="kannada-text" style={{ display: 'block' }}>(ಒಂದು ವಾರದಲ್ಲಿ ಸಂಸ್ಕರಿಸಿದ ಮಾಂಸ ಉತ್ಪನ್ನಗಳ ಬಳಕೆ?)</span>
            </label>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>Weekly Volume:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PROCESSED_VOLUME_OPTIONS.map(v => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setFormData(prev => ({ ...prev, processed_meat_volume: v }))}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: formData.processed_meat_volume === v ? '1px solid #e11d48' : '1px solid var(--border-color)',
                      background: formData.processed_meat_volume === v ? 'rgba(225, 29, 72, 0.15)' : 'var(--bg-card)',
                      color: formData.processed_meat_volume === v ? '#e11d48' : 'var(--text-main)'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>Product Varieties:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PROCESSED_PRODUCT_TYPES.map(p => {
                  const isSelected = formData.processed_meat_products.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => handleMultiToggle('processed_meat_products', p)}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: isSelected ? '1px solid #059669' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                        color: isSelected ? '#059669' : 'var(--text-main)'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                18. Wholesale Meat Procurement Source
                <span className="kannada-text" style={{ display: 'block' }}>(ಮೂಲ ಅಥವಾ ಸಗಟು ಮಾಂಸವನ್ನು ಎಲ್ಲಿಂದ ತರಲಾಗುತ್ತದೆ?)</span>
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
                19. Type of Customers Visiting Shop
                <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡುವ ಗ್ರಾಹಕರ ಪ್ರಕಾರ?)</span>
              </label>
              <select
                name="customer_type"
                value={formData.customer_type}
                onChange={handleChange}
                className="form-select"
              >
                {CUSTOMER_TYPE_OPTIONS.map(c => (
                  <option key={c.id} value={c.id}>{c.en} ({c.kn})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 6: Masala & BBMP Licensing (Q20, Q21, Q22, Q23) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <FileCheck size={20} color="#e11d48" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>6. Masalas & BBMP Trade License</h2>
              <p className="kannada-text">ಮಸಾಲಾಗಳು ಮತ್ತು ಬಿಬಿಎಂಪಿ ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಸ್ಥಿತಿ</p>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              20. What Pork masalas are available in shop?
              <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಯಲ್ಲಿ ಯಾವ ಹಂದಿಯ ಮಸಾಲಾಗಳು ಲಭ್ಯವಿದೆಯೇ?)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem' }}>
              {MASALA_OPTIONS.map(m => {
                const isSelected = formData.masalas_available.includes(m.id);
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
                      border: isSelected ? '1px solid #e11d48' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiToggle('masalas_available', m.id)}
                      style={{ accentColor: '#e11d48' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', color: isSelected ? '#e11d48' : 'var(--text-main)', fontWeight: isSelected ? '600' : 'normal' }}>{m.en}</div>
                      <div className="kannada-text" style={{ fontSize: '0.72rem' }}>{m.kn}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                21. Is BBMP Trade License Issued?
                <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಗೆ ಬಿಬಿಎಂಪಿ ವ್ಯಾಪಾರ ಪರವಾನಗಿ ನೀಡಲಾಗಿದೆಯೇ?)</span>
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
                      style={{ accentColor: '#e11d48' }}
                    />
                    <span>{val === 'Yes' ? 'Yes (ಹೌದು)' : 'No (ಇಲ್ಲ)'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                22. Facing Issues in Procuring BBMP License?
                <span className="kannada-text" style={{ display: 'block' }}>(ಬಿಬಿಎಂಪಿ ಪರವಾನಗಿ ಪಡೆಯುವಲ್ಲಿ ಸಮಸ್ಯೆಗಳಿವೆಯೇ?)</span>
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
                      style={{ accentColor: '#e11d48' }}
                    />
                    <span>{val === 'Yes' ? 'Yes (ಹೌದು)' : 'No (ಇಲ್ಲ)'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {formData.bbmp_license_issues === 'Yes' && (
            <div className="form-group animate-fade-in">
              <label className="form-label">
                23. Reason for issues faced in procuring BBMP license
                <span className="kannada-text" style={{ display: 'block' }}>(ಪರವಾನಗಿ ಪಡೆಯುವಲ್ಲಿ ಎದುರಿಸುತ್ತಿರುವ ಸಮಸ್ಯೆಗಳಿಗೆ ಕಾರಣವೇನು?)</span>
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

        {/* SECTION 7: Cleanliness Rating (Q24) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Award size={20} color="#e11d48" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>7. Cleanliness Rating</h2>
              <p className="kannada-text">ಅಂಗಡಿಯ ಶುಚಿತ್ವದ ರೇಟಿಂಗ್</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              24. Provide the rating on the cleanliness of pork shop (1 to 5 Stars)
              <span className="kannada-text" style={{ display: 'block' }}>(ಹಂದಿಮಾಂಸದ ಅಂಗಡಿಯ ಶುಚಿತ್ವದ ಮೇಲೆ ರೇಟಿಂಗ್ ಒದಗಿಸಿ)</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData(prev => ({ ...prev, cleanliness_rating: star }))}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: formData.cleanliness_rating >= star ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card-subtle)',
                    border: formData.cleanliness_rating >= star ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>⭐</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: formData.cleanliness_rating >= star ? '#d97706' : 'var(--text-dim)' }}>
                    {star}
                  </span>
                </button>
              ))}
              <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#d97706', fontWeight: '600' }}>
                {formData.cleanliness_rating === 5 ? 'Excellent (ಉತ್ತಮ)' :
                 formData.cleanliness_rating === 4 ? 'Very Good (ತುಂಬಾ ಒಳ್ಳೆಯದು)' :
                 formData.cleanliness_rating === 3 ? 'Average (ಸಾಧಾರಣ)' :
                 formData.cleanliness_rating === 2 ? 'Below Average' : 'Poor (ಕಳಪೆ)'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 8: Shop Photos & Map Link (Q27, Q28) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ImageIcon size={20} color="#e11d48" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>8. Shop Photos & GPS Location Link</h2>
              <p className="kannada-text">ಅಂಗಡಿಯ ಚಿತ್ರಗಳು ಮತ್ತು ನಕ್ಷೆಯ ಲಿಂಕ್</p>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              27. Image of Shop (Upload up to 5 photos)
              <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಯ ಚಿತ್ರ - ಗರಿಷ್ಠ 5 ಫೋಟೋಗಳು)</span>
            </label>

            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '14px',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--bg-card-subtle)',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                id="shop-image-input"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="shop-image-input" style={{ cursor: 'pointer' }}>
                <ImageIcon size={36} color="#e11d48" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  Click to Browse or Drag & Drop Shop Photos
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Supports JPG, PNG, WEBP (Max 5 images, up to 25MB each)
                </div>
              </label>
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
              28. Address of the shop (LINKS OF LOCATION ONLY) <span className="required-star">*</span>
              <span className="kannada-text" style={{ display: 'block' }}>(ಅಂಗಡಿಯ ವಿಳಾಸ - ಸ್ಥಳದ ಲಿಂಕ್‌ಗಳು ಮಾತ್ರ)</span>
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
                style={{ whiteSpace: 'nowrap', borderColor: '#e11d48' }}
              >
                <Navigation size={16} color="#e11d48" />
                <span>{isLocating ? 'Locating...' : 'Get Current GPS Link'}</span>
              </button>
            </div>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'block' }}>
              Auto-generated when entering Pincode, or click "Get Current GPS Link" for exact live coordinates.
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
            Reset Form (ನಮೂನೆ ಮರುಹೊಂದಿಸಿ)
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', minWidth: '220px' }}
          >
            {isSubmitting ? (
              <span>Saving to MySQL...</span>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Survey (ಸಲ್ಲಿಸಿ)</span>
              </>
            )}
          </button>
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
              Survey Submitted Successfully!
            </h2>
            <p className="kannada-text" style={{ fontSize: '0.95rem', color: '#059669', marginBottom: '1.25rem', fontWeight: '600' }}>
              ಸಮೀಕ್ಷೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ ಮತ್ತು ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ!
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
                <span style={{ fontWeight: '800', color: '#e11d48' }}>#{successModalData.surveyId}</span>
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
                <span>Go to Analytics Dashboard (ಡ್ಯಾಶ್‌ಬೋರ್ಡ್)</span>
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
                <span>View in Records Table (ದಾಖಲೆಗಳು)</span>
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
                + Fill Another Survey (ಮತ್ತೊಂದು ನಮೂನೆ ಭರ್ತಿ ಮಾಡಿ)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
