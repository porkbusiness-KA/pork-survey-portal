import React, { useState } from 'react';
import {
  MapPin, Store, User, Clock, Calendar, Users, ShoppingBag,
  DollarSign, CheckSquare, Award, Phone, Image as ImageIcon,
  Send, Sparkles, Navigation, AlertCircle, CheckCircle2, Trash2,
  FileCheck, ShieldAlert, X, LayoutDashboard, Database, ArrowRight,
  Search, Check, Loader2, Compass, Plus, Briefcase
} from 'lucide-react';
import {
  DISTRICTS, PINCODE_DATABASE, HOLIDAY_OPTIONS, WORKER_OPTIONS,
  DAILY_CUSTOMER_OPTIONS, PEAK_DAY_OPTIONS, MEAT_TYPES_OPTIONS,
  PROCESSED_VOLUME_OPTIONS, PROCESSED_PRODUCT_TYPES,
  CUSTOMER_TYPE_OPTIONS, MASALA_OPTIONS, SPOC_SKILL_OPTIONS,
  SHOP_OWNERSHIP_OPTIONS, PEAK_SEASON_OPTIONS, MEAT_CUTS_OPTIONS,
  UNSOLD_MEAT_OPTIONS, STORAGE_CAPACITY_OPTIONS, TRAINING_SKILL_OPTIONS,
  PROCUREMENT_SOURCE_OPTIONS, PROCUREMENT_FREQUENCY_OPTIONS, PROCUREMENT_QUANTITY_OPTIONS,
  BILLING_OPTIONS, BUSINESS_CHALLENGE_OPTIONS
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
    owner_email: '',
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
    fssai_license_issued: 'No',
    fssai_license_issues: 'No',
    fssai_issue_reasons: '',
    shop_ownership: '',
    shop_ownership_other: '',
    peak_sales_seasons: [],
    peak_sales_seasons_other: '',
    meat_cuts_sold_most: [],
    meat_cuts_sold_most_other: '',
    unsold_meat_handling: [],
    unsold_meat_handling_other: '',
    storage_capacity: '',
    wants_training: '',
    training_skills: [],
    training_skills_other: '',
    procurement_sources: [],
    procurement_sources_other: '',
    procurement_frequency: '',
    procurement_frequency_other: '',
    procurement_quantity: '',
    procurement_quantity_other: '',
    provides_billing: '',
    has_challenges: '',
    business_challenges: [],
    business_challenges_other: '',
    cleanliness_rating: 0,
    behavior_rating: 0,
    spocs: [
      {
        name: '',
        mobile: '',
        same_as_owner: true,
        skills: ['Butchery / Meat Cutting'],
        skills_other: ''
      }
    ],
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

    // Special logic for peak_customer_days: 'All the days' selects/deselects everything
    if (field === 'peak_customer_days') {
      setFormData(prev => {
        const currentList = prev[field] || [];
        const ALL_DAYS = 'All the days';
        const ALL_DAY_IDS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', ALL_DAYS];
        const INDIVIDUAL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        if (item === ALL_DAYS) {
          // If 'All the days' is already selected → deselect everything
          if (currentList.includes(ALL_DAYS)) {
            return { ...prev, [field]: [] };
          }
          // Otherwise → select ALL days including individual ones
          return { ...prev, [field]: ALL_DAY_IDS };
        } else {
          // Toggle individual day, always remove 'All the days' first
          const withoutAllDays = currentList.filter(x => x !== ALL_DAYS);
          let newList;
          if (withoutAllDays.includes(item)) {
            newList = withoutAllDays.filter(x => x !== item);
          } else {
            newList = [...withoutAllDays, item];
          }
          // Auto-select 'All the days' if all 7 individual days are now checked
          const allIndividualSelected = INDIVIDUAL_DAYS.every(d => newList.includes(d));
          if (allIndividualSelected) {
            newList = [...newList, ALL_DAYS];
          }
          return { ...prev, [field]: newList };
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

  // SPOC management handlers
  const handleAddSpoc = () => {
    setFormData(prev => ({
      ...prev,
      spocs: [
        ...(prev.spocs || []),
        {
          name: '',
          mobile: '',
          same_as_owner: false,
          skills: ['Sales & Billing'],
          skills_other: ''
        }
      ]
    }));
  };

  const handleRemoveSpoc = (index) => {
    setFormData(prev => ({
      ...prev,
      spocs: (prev.spocs || []).filter((_, i) => i !== index)
    }));
  };

  const handleSpocChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.spocs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, spocs: updated };
    });
  };

  const handleSpocSkillToggle = (spocIndex, skillId) => {
    setFormData(prev => {
      const updated = [...(prev.spocs || [])];
      const curSkills = updated[spocIndex].skills || [];
      const newSkills = curSkills.includes(skillId)
        ? curSkills.filter(s => s !== skillId)
        : [...curSkills, skillId];
      updated[spocIndex] = { ...updated[spocIndex], skills: newSkills };
      return { ...prev, spocs: updated };
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
      
      const effectiveSpocs = (formData.spocs && formData.spocs.length > 0)
        ? formData.spocs
            .map((s, idx) => ({
              name: (idx === 0 && s.same_as_owner) ? formData.owner_name : (s.name || ''),
              mobile: s.mobile || '',
              same_as_owner: idx === 0 ? !!s.same_as_owner : false,
              skills: s.skills || [],
              skills_other: s.skills_other || ''
            }))
            .filter(s => s.name || s.mobile || (s.skills && s.skills.length > 0))
        : [];

      const effectiveSpocName = effectiveSpocs.map(s => s.name).filter(Boolean).join(', ') || '';
      const effectiveSpocMobile = effectiveSpocs.map(s => s.mobile).filter(Boolean).join(', ') || '';
      
      const effectiveProcessedVolume = formData.processed_meat_volume === 'Other'
        ? (formData.processed_meat_volume_other ? `${formData.processed_meat_volume_other} Kg` : 'Other')
        : formData.processed_meat_volume;

      const combinedProcessed = [
        effectiveProcessedVolume,
        ...formData.processed_meat_products,
        formData.processed_meat_other
      ].filter(Boolean);

      Object.keys(formData).forEach(key => {
        const jsonArrayFields = [
          'holiday_days', 'peak_customer_days', 'meat_types', 'masalas_available',
          'peak_sales_seasons', 'meat_cuts_sold_most', 'unsold_meat_handling', 'training_skills',
          'procurement_sources', 'business_challenges'
        ];
        if (jsonArrayFields.includes(key)) {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'spocs') {
          data.append('spocs', JSON.stringify(effectiveSpocs));
        } else if (key === 'spoc_name') {
          data.append('spoc_name', effectiveSpocName);
        } else if (key === 'spoc_mobile') {
          data.append('spoc_mobile', effectiveSpocMobile);
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

        {/* SECTION 2: Shop & Owner Info (Q8, Q9, Q10, Q12, Q13, Q14) */}
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

            {/* Q11: Owner's Email ID */}
            <div className="form-group">
              <label className="form-label">
                {t.q11}
              </label>
              <input
                type="email"
                name="owner_email"
                value={formData.owner_email || ''}
                onChange={handleChange}
                placeholder="e.g. owner@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.q12}
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
          </div>

          {/* Q13: Contact Person(s) / SPOC Details & Skills (Optional) */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#d97706" />
                <label className="form-label" style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>
                  {t.q13} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({lang === 'kn' ? 'ಐಚ್ಛಿಕ' : lang === 'both' ? 'Optional / ಐಚ್ಛಿಕ' : 'Optional'})</span>
                </label>
              </div>
              <button
                type="button"
                onClick={handleAddSpoc}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#d97706', color: '#d97706' }}
              >
                <Plus size={16} />
                <span>{t.addSpocBtn}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(formData.spocs || []).map((spoc, spocIdx) => (
                <div
                  key={spocIdx}
                  className="animate-fade-in"
                  style={{
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-amber" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                        {t.spocBadge} #{spocIdx + 1}
                      </span>
                      {spocIdx === 0 && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <input
                            type="checkbox"
                            checked={!!spoc.same_as_owner}
                            onChange={(e) => {
                              handleSpocChange(0, 'same_as_owner', e.target.checked);
                              if (e.target.checked) {
                                handleSpocChange(0, 'name', formData.owner_name);
                              }
                            }}
                            style={{ accentColor: '#d97706' }}
                          />
                          <span>{t.q13SameAsOwner}</span>
                        </label>
                      )}
                    </div>

                    {formData.spocs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSpoc(spocIdx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px'
                        }}
                      >
                        <Trash2 size={14} />
                        <span>{t.removeSpocBtn}</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Name */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>
                        {t.spocNameLabel}
                      </label>
                      {spocIdx === 0 && spoc.same_as_owner ? (
                        <input
                          type="text"
                          value={formData.owner_name ? `${formData.owner_name} (Owner)` : '(Will mirror Owner Name)'}
                          className="form-input"
                          disabled
                          style={{ opacity: 0.75, background: 'rgba(0,0,0,0.03)' }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={spoc.name || ''}
                          onChange={(e) => handleSpocChange(spocIdx, 'name', e.target.value)}
                          placeholder="e.g. Anand Kumar"
                          className="form-input"
                        />
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>
                        {t.spocMobileLabel}
                      </label>
                      <input
                        type="tel"
                        value={spoc.mobile || ''}
                        onChange={(e) => handleSpocChange(spocIdx, 'mobile', e.target.value)}
                        placeholder="e.g. 9845012345"
                        maxLength="12"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Multi-select Skill Checkboxes */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
                      {t.spocSkillLabel}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      {SPOC_SKILL_OPTIONS.map(skill => {
                        const isSkillSelected = (spoc.skills || []).includes(skill.id);
                        return (
                          <label
                            key={skill.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '8px',
                              background: isSkillSelected ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-main)',
                              border: isSkillSelected ? '1.5px solid #d97706' : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              fontSize: '0.84rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSkillSelected}
                              onChange={() => handleSpocSkillToggle(spocIdx, skill.id)}
                              style={{ accentColor: '#d97706' }}
                            />
                            <span>{lang === 'en' ? skill.en : lang === 'kn' ? skill.kn : `${skill.en} (${skill.kn})`}</span>
                          </label>
                        );
                      })}
                    </div>

                    {(spoc.skills || []).includes('Other') && (
                      <div className="animate-fade-in" style={{ marginTop: '0.65rem' }}>
                        <input
                          type="text"
                          value={spoc.skills_other || ''}
                          onChange={(e) => handleSpocChange(spocIdx, 'skills_other', e.target.value)}
                          placeholder={t.spocOtherSkillPlaceholder}
                          className="form-input"
                          style={{ fontSize: '0.88rem' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: Timings & Weekly Holidays (Q15, Q16, Q17) */}
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
                {t.q15} <span className="required-star">*</span>
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
                {t.q16} <span className="required-star">*</span>
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
              {t.q17}
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
                  {t.q17NoHolidayBanner}
                </span>
                <span style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {t.q17DeselectHint}
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
                    title={isDisabled ? t.q17DeselectHint : ''}
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

        {/* SECTION 4: Operations & Customer Footfall (Q18, Q19, Q20) */}
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
                {t.q18} <span className="required-star">*</span>
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
                {t.q19}
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
              {t.q20}
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

        {/* SECTION 4b: Shop Ownership */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Store size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{lang === 'kn' ? '4b. ಅಂಗಡಿ ಮಾಲೀಕತ್ವ' : lang === 'both' ? '4b. Shop Ownership (ಅಂಗಡಿ ಮಾಲೀಕತ್ವ)' : '4b. Shop Ownership'}</h2>
              <p className="kannada-text">{t.qShopOwnership}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.qShopOwnership}
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {SHOP_OWNERSHIP_OPTIONS.map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', padding: '0.5rem 0.85rem', borderRadius: '8px', background: formData.shop_ownership === opt.id ? 'rgba(217,119,6,0.13)' : 'var(--bg-card-subtle)', border: formData.shop_ownership === opt.id ? '1px solid #d97706' : '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: '500', transition: 'all 0.15s' }}>
                  <input
                    type="radio"
                    name="shop_ownership"
                    value={opt.id}
                    checked={formData.shop_ownership === opt.id}
                    onChange={handleChange}
                    style={{ accentColor: '#d97706' }}
                  />
                  <span>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : `${opt.en}`}</span>
                </label>
              ))}
            </div>
            {formData.shop_ownership === 'Other' && (
              <div className="animate-fade-in" style={{ marginTop: '0.75rem' }}>
                <input
                  type="text"
                  name="shop_ownership_other"
                  value={formData.shop_ownership_other || ''}
                  onChange={handleChange}
                  placeholder={t.ownershipOtherPlaceholder}
                  className="form-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: Meat Products & Sales */}
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
                {t.q21} <span className="required-star">*</span>
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
                {t.q22}
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

          {/* Q23: Meat Types */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.q23} <span className="required-star">*</span>
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

          {/* Q24: Processed Meat Products */}
          <div className="form-group" style={{ marginBottom: '1.5rem', background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem', fontWeight: '700' }}>
              {t.q24}
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* Dropdown 1: Weekly Volume */}
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  {t.q24Volume}
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
                  {t.q24Varieties}
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
                {t.q25}
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
                {t.q26}
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

        {/* SECTION 5c: Procurement Source, Frequency & Quantity */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <DollarSign size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.secProcurementTitle}</h2>
              <p className="kannada-text">{t.secProcurementSub}</p>
            </div>
          </div>

          {/* Procurement Source – Multi-select */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>{t.qProcurementSource}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.6rem' }}>
              {PROCUREMENT_SOURCE_OPTIONS.map(opt => {
                const isSelected = formData.procurement_sources.includes(opt.id);
                return (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: '10px', background: isSelected ? 'rgba(225,29,72,0.1)' : 'var(--bg-card-subtle)', border: isSelected ? '1px solid #d97706' : '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleMultiToggle('procurement_sources', opt.id)} style={{ accentColor: '#d97706' }} />
                    <span style={{ fontSize: '0.88rem' }}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</span>
                  </label>
                );
              })}
            </div>
            {formData.procurement_sources.includes('Other') && (
              <div className="animate-fade-in" style={{ marginTop: '0.75rem' }}>
                <input type="text" name="procurement_sources_other" value={formData.procurement_sources_other || ''} onChange={handleChange} placeholder={t.procurementSourceOtherPlaceholder} className="form-input" />
              </div>
            )}
          </div>

          {/* Procurement Frequency & Quantity in 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>{t.qProcurementFrequency}</label>
              <select name="procurement_frequency" value={formData.procurement_frequency} onChange={handleChange} className="form-select">
                <option value="">{lang === 'kn' ? 'ಆಯ್ಕೆ ಮಾಡಿ...' : 'Select frequency...'}</option>
                {PROCUREMENT_FREQUENCY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</option>
                ))}
              </select>
              {formData.procurement_frequency === 'Other' && (
                <div className="animate-fade-in" style={{ marginTop: '0.65rem' }}>
                  <input type="text" name="procurement_frequency_other" value={formData.procurement_frequency_other || ''} onChange={handleChange} placeholder={t.procurementFrequencyOtherPlaceholder} className="form-input" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>{t.qProcurementQuantity}</label>
              <select name="procurement_quantity" value={formData.procurement_quantity} onChange={handleChange} className="form-select">
                <option value="">{lang === 'kn' ? 'ಆಯ್ಕೆ ಮಾಡಿ...' : 'Select quantity...'}</option>
                {PROCUREMENT_QUANTITY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</option>
                ))}
              </select>
              {formData.procurement_quantity === 'Other' && (
                <div className="animate-fade-in" style={{ marginTop: '0.65rem' }}>
                  <input type="text" name="procurement_quantity_other" value={formData.procurement_quantity_other || ''} onChange={handleChange} placeholder={t.procurementQuantityOtherPlaceholder} className="form-input" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5b: Peak Sales Seasons, Meat Cuts, Unsold Meat, Storage */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShoppingBag size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{lang === 'kn' ? '5b. ಮಾರಾಟ ಋತು ಮತ್ತು ಮಾಂಸ ಶೇಖರಣೆ' : lang === 'both' ? '5b. Sales Seasons & Meat Storage (ಮಾರಾಟ ಋತು ಮತ್ತು ಶೇಖರಣೆ)' : '5b. Sales Seasons & Meat Storage'}</h2>
              <p className="kannada-text">{lang === 'kn' ? 'ಮಾರಾಟ ಋತು, ಮಾಂಸ ವಿಧ, ಮತ್ತು ಶೇಖರಣಾ ವ್ಯವಸ್ಥೆ' : 'Peak selling seasons, top meat cuts and unsold meat management'}</p>
            </div>
          </div>

          {/* Peak Sales Seasons */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.qPeakSeasons}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem' }}>
              {PEAK_SEASON_OPTIONS.map(opt => {
                const isSelected = formData.peak_sales_seasons.includes(opt.id);
                return (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: '10px', background: isSelected ? 'rgba(225,29,72,0.1)' : 'var(--bg-card-subtle)', border: isSelected ? '1px solid #d97706' : '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleMultiToggle('peak_sales_seasons', opt.id)} style={{ accentColor: '#d97706' }} />
                    <span style={{ fontSize: '0.88rem' }}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</span>
                  </label>
                );
              })}
            </div>
            {formData.peak_sales_seasons.includes('Other') && (
              <div className="animate-fade-in" style={{ marginTop: '0.75rem' }}>
                <input type="text" name="peak_sales_seasons_other" value={formData.peak_sales_seasons_other || ''} onChange={handleChange} placeholder={t.peakSeasonOtherPlaceholder} className="form-input" />
              </div>
            )}
          </div>

          {/* Meat Cuts Sold Most */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.qMeatCuts}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {MEAT_CUTS_OPTIONS.map(opt => {
                const isSelected = formData.meat_cuts_sold_most.includes(opt.id);
                return (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: '10px', background: isSelected ? 'rgba(225,29,72,0.1)' : 'var(--bg-card-subtle)', border: isSelected ? '1px solid #d97706' : '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleMultiToggle('meat_cuts_sold_most', opt.id)} style={{ accentColor: '#d97706' }} />
                    <span style={{ fontSize: '0.88rem' }}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</span>
                  </label>
                );
              })}
            </div>
            {formData.meat_cuts_sold_most.includes('Other') && (
              <div className="animate-fade-in" style={{ marginTop: '0.75rem' }}>
                <input type="text" name="meat_cuts_sold_most_other" value={formData.meat_cuts_sold_most_other || ''} onChange={handleChange} placeholder={t.meatCutOtherPlaceholder} className="form-input" />
              </div>
            )}
          </div>

          {/* Unsold Meat Handling */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>
              {t.qUnsoldMeat}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem' }}>
              {UNSOLD_MEAT_OPTIONS.map(opt => {
                const isSelected = formData.unsold_meat_handling.includes(opt.id);
                return (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: '10px', background: isSelected ? 'rgba(225,29,72,0.1)' : 'var(--bg-card-subtle)', border: isSelected ? '1px solid #d97706' : '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleMultiToggle('unsold_meat_handling', opt.id)} style={{ accentColor: '#d97706' }} />
                    <span style={{ fontSize: '0.88rem' }}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</span>
                  </label>
                );
              })}
            </div>
            {formData.unsold_meat_handling.includes('Other') && (
              <div className="animate-fade-in" style={{ marginTop: '0.75rem' }}>
                <input type="text" name="unsold_meat_handling_other" value={formData.unsold_meat_handling_other || ''} onChange={handleChange} placeholder={t.unsoldOtherPlaceholder} className="form-input" />
              </div>
            )}
          </div>

          {/* Storage Capacity */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              {t.qStorageCapacity}
            </label>
            <select
              name="storage_capacity"
              value={formData.storage_capacity}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">{lang === 'kn' ? 'ಶೇಖರಣಾ ಸಾಮರ್ಥ್ಯ ಆಯ್ಕೆ ಮಾಡಿ' : 'Select storage capacity...'}</option>
              {STORAGE_CAPACITY_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : `${opt.en}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 6: Masala Availability (Q27) */}
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
              {t.q27} <span className="required-star">*</span>
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
                {t.q27Brand} <span className="required-star">*</span>
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

        {/* SECTION 7: BBMP Trade Licensing (Q28, Q29, Q30) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <FileCheck size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{lang === 'kn' ? '7. ಬಿಬಿಎಂಪಿ ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಸ್ಥಿತಿ' : lang === 'both' ? '7. BBMP Trade License Status (ಬಿಬಿಎಂಪಿ ಪರವಾನಗಿ)' : '7. BBMP Trade License Status'}</h2>
              <p className="kannada-text">{lang === 'kn' ? 'BBMP ಟ್ರೇಡ್ ಲೈಸೆನ್ಸ್ ಮತ್ತು ಪರವಾನಗಿ ಸಮಸ್ಯೆಗಳು' : lang === 'both' ? 'ಬಿಬಿಎಂಪಿ ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಮತ್ತು ಸಮಸ್ಯೆಗಳ ವಿವರ' : 'BBMP trade licensing and procurement issues'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: formData.bbmp_license_issues === 'Yes' ? '1.25rem' : '0' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                {t.q28}
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
                {t.q29}
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
                {t.q30}
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

        {/* SECTION 7b: FSSAI Trade Licensing (Q31, Q32, Q33) */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShieldAlert size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{lang === 'kn' ? 'FSSAI ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಸ್ಥಿತಿ' : lang === 'both' ? 'FSSAI Trade License Status (FSSAI ಪರವಾನಗಿ)' : 'FSSAI Trade License Status'}</h2>
              <p className="kannada-text">{lang === 'kn' ? 'FSSAI ಟ್ರೇಡ್ ಲೈಸೆನ್ಸ್ ಮತ್ತು ಪರವಾನಗಿ ಸಮಸ್ಯೆಗಳು' : lang === 'both' ? 'FSSAI ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಮತ್ತು ಸಮಸ್ಯೆಗಳ ವಿವರ' : 'FSSAI licensing and procurement issues'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: formData.fssai_license_issues === 'Yes' ? '1.25rem' : '0' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                {t.q31}
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                {['Yes', 'No'].map(val => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input
                      type="radio"
                      name="fssai_license_issued"
                      value={val}
                      checked={formData.fssai_license_issued === val}
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
                {t.q32}
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                {['Yes', 'No'].map(val => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input
                      type="radio"
                      name="fssai_license_issues"
                      value={val}
                      checked={formData.fssai_license_issues === val}
                      onChange={handleChange}
                      style={{ accentColor: '#d97706' }}
                    />
                    <span>{val === 'Yes' ? (lang === 'kn' ? 'ಹೌದು' : lang === 'both' ? 'Yes (ಹೌದು)' : 'Yes') : (lang === 'kn' ? 'ಇಲ್ಲ' : lang === 'both' ? 'No (ಇಲ್ಲ)' : 'No')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {formData.fssai_license_issues === 'Yes' && (
            <div className="form-group animate-fade-in" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
              <label className="form-label">
                {t.q33}
              </label>
              <textarea
                name="fssai_issue_reasons"
                value={formData.fssai_issue_reasons || ''}
                onChange={handleChange}
                placeholder="Explain the issues faced with FSSAI trade licensing..."
                rows="2"
                className="form-textarea"
              />
            </div>
          )}
        </div>

        {/* SECTION 7d: Billing & Business Challenges */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShieldAlert size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.secChallengesTitle}</h2>
              <p className="kannada-text">{t.secChallengesSub}</p>
            </div>
          </div>

          {/* Billing */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>{t.qBilling}</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {BILLING_OPTIONS.map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', padding: '0.5rem 0.85rem', borderRadius: '8px', background: formData.provides_billing === opt.id ? 'rgba(217,119,6,0.13)' : 'var(--bg-card-subtle)', border: formData.provides_billing === opt.id ? '1px solid #d97706' : '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: '500', transition: 'all 0.15s', fontSize: '0.88rem' }}>
                  <input type="radio" name="provides_billing" value={opt.id} checked={formData.provides_billing === opt.id} onChange={handleChange} style={{ accentColor: '#d97706' }} />
                  <span>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Business Challenges */}
          <div className="form-group" style={{ marginBottom: formData.has_challenges === 'Yes' ? '1.25rem' : '0' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>{t.qHasChallenges}</label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem' }}>
              {['Yes', 'No'].map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', padding: '0.5rem 0.85rem', borderRadius: '8px', background: formData.has_challenges === val ? (val === 'Yes' ? 'rgba(225,29,72,0.1)' : 'rgba(16,185,129,0.1)') : 'var(--bg-card-subtle)', border: formData.has_challenges === val ? (val === 'Yes' ? '1px solid #d97706' : '1px solid #10b981') : '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: '500', transition: 'all 0.15s' }}>
                  <input type="radio" name="has_challenges" value={val} checked={formData.has_challenges === val} onChange={handleChange} style={{ accentColor: '#d97706' }} />
                  <span>{val === 'Yes' ? (lang === 'kn' ? 'ಹೌದು' : lang === 'both' ? 'Yes (ಹೌದು)' : 'Yes') : (lang === 'kn' ? 'ಇಲ್ಲ' : lang === 'both' ? 'No (ಇಲ್ಲ)' : 'No')}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.has_challenges === 'Yes' && (
            <div className="form-group animate-fade-in" style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.15rem', marginTop: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.6rem' }}>{t.qChallenges}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '0.6rem' }}>
                {BUSINESS_CHALLENGE_OPTIONS.map(opt => {
                  const isSelected = formData.business_challenges.includes(opt.id);
                  return (
                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: '10px', background: isSelected ? 'rgba(225,29,72,0.12)' : 'var(--bg-card)', border: isSelected ? '1px solid #d97706' : '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <input type="checkbox" checked={isSelected} onChange={() => handleMultiToggle('business_challenges', opt.id)} style={{ accentColor: '#d97706' }} />
                      <span style={{ fontSize: '0.87rem' }}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</span>
                    </label>
                  );
                })}
              </div>
              {formData.business_challenges.includes('Other') && (
                <div className="animate-fade-in" style={{ marginTop: '0.75rem' }}>
                  <input type="text" name="business_challenges_other" value={formData.business_challenges_other || ''} onChange={handleChange} placeholder={t.challengeOtherPlaceholder} className="form-input" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 7c: Pig-Related Skills Training */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Briefcase size={20} color="#d97706" />
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>{t.secTrainingTitle}</h2>
              <p className="kannada-text">{t.secTrainingSub}</p>
            </div>
          </div>

          {/* Does the shopkeeper want training? */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              {t.qWantsTraining}
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem' }}>
              {['Yes', 'No'].map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', padding: '0.5rem 0.85rem', borderRadius: '8px', background: formData.wants_training === val ? (val === 'Yes' ? 'rgba(16,185,129,0.12)' : 'rgba(225,29,72,0.1)') : 'var(--bg-card-subtle)', border: formData.wants_training === val ? (val === 'Yes' ? '1px solid #10b981' : '1px solid #d97706') : '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: '500', transition: 'all 0.15s' }}>
                  <input
                    type="radio"
                    name="wants_training"
                    value={val}
                    checked={formData.wants_training === val}
                    onChange={handleChange}
                    style={{ accentColor: '#d97706' }}
                  />
                  <span>{val === 'Yes' ? (lang === 'kn' ? 'ಹೌದು' : lang === 'both' ? 'Yes (ಹೌದು)' : 'Yes') : (lang === 'kn' ? 'ಇಲ್ಲ' : lang === 'both' ? 'No (ಇಲ್ಲ)' : 'No')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* If Yes, show skills multi-select */}
          {formData.wants_training === 'Yes' && (
            <div className="form-group animate-fade-in" style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.15rem' }}>
              <label className="form-label" style={{ marginBottom: '0.6rem' }}>
                {t.qTrainingSkills}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.6rem' }}>
                {TRAINING_SKILL_OPTIONS.map(opt => {
                  const isSelected = formData.training_skills.includes(opt.id);
                  return (
                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: '10px', background: isSelected ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)', border: isSelected ? '1px solid #10b981' : '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <input type="checkbox" checked={isSelected} onChange={() => handleMultiToggle('training_skills', opt.id)} style={{ accentColor: '#10b981' }} />
                      <span style={{ fontSize: '0.87rem' }}>{lang === 'en' ? opt.en : lang === 'kn' ? opt.kn : opt.en}</span>
                    </label>
                  );
                })}
              </div>
              {formData.training_skills.includes('Other') && (
                <div className="animate-fade-in" style={{ marginTop: '0.75rem' }}>
                  <input type="text" name="training_skills_other" value={formData.training_skills_other || ''} onChange={handleChange} placeholder={t.trainingOtherPlaceholder} className="form-input" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 8: Shop Photos & Map Link (Q35, Q36) */}
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
              {t.q35}
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
                  📁 {t.q35UploadHint}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const camInput = document.createElement('input');
                    camInput.type = 'file';
                    camInput.accept = 'image/*';
                    // setAttribute is more reliable than .capture = across all browsers/iOS
                    camInput.setAttribute('capture', 'environment');
                    camInput.style.display = 'none';
                    // Appending to body is required for iOS Safari to work
                    document.body.appendChild(camInput);
                    camInput.onchange = (e) => {
                      handleImageChange(e);
                      document.body.removeChild(camInput);
                    };
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
                  📷 {t.q35CameraBtn}
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                {t.q35UploadSub}
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
              {t.q36} <span className="required-star">*</span>
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
                <span>{isLocating ? t.q36Locating : t.q36GpsBtn}</span>
              </button>
            </div>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'block' }}>
              {t.q36Hint}
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
