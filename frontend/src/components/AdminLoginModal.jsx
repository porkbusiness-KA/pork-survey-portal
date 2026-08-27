import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, AlertCircle, Loader2 } from 'lucide-react';
import { verifyAdminPin } from '../services/api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, lang = 'en' }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಅಡ್ಮಿನ್ ಪಿನ್ ನಮೂದಿಸಿ' : 'Please enter the Admin PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyAdminPin(pin.trim());
      setPin('');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message || (lang === 'kn' ? 'ತಪ್ಪಾದ ಪಿನ್. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.' : 'Invalid Admin PIN. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
              border: '1px solid rgba(217, 119, 6, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: '#d97706'
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: 'var(--text-main)' }}>
            {lang === 'kn' ? 'ನಿರ್ವಾಹಕರ ದೃಢೀಕರಣ' : 'Admin Authorization'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {lang === 'kn'
              ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ವರದಿಗಳನ್ನು ಪ್ರವೇಶಿಸಲು ಅಡ್ಮಿನ್ ಪಿನ್ ನಮೂದಿಸಿ'
              : 'Enter your Admin PIN to unlock analytics and export controls'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem'
              }}
            >
              {lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪಿನ್ / ಪಾಸ್‌ಕೋಡ್' : 'Admin PIN / Passcode'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder={lang === 'kn' ? 'ಪಿನ್ ನಮೂದಿಸಿ...' : 'Enter PIN...'}
                autoFocus
                className="form-input"
                style={{
                  width: '100%',
                  paddingLeft: '38px',
                  paddingRight: '42px',
                  fontSize: '1rem',
                  letterSpacing: showPin ? 'normal' : '3px',
                  height: '46px',
                  borderRadius: '10px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                tabIndex={-1}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, height: '44px', borderRadius: '10px', fontSize: '0.9rem' }}
              disabled={loading}
            >
              {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{lang === 'kn' ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Verifying...'}</span>
                </>
              ) : (
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Unlock Admin'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
