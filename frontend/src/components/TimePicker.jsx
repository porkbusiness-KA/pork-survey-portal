import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * TimePicker - Premium custom time picker component
 * Props:
 *   name       - form field name
 *   value      - current value in "HH:mm" 24h format
 *   onChange   - callback receives synthetic-like event {target: {name, value}}
 *   label      - optional label text override
 *   required   - boolean
 */
export default function TimePicker({ name, value, onChange, required = false }) {
  // Parse current value (24h) into hours, minutes, ampm
  const parse = (val) => {
    if (!val) return { h: 8, m: 0, ampm: 'AM' };
    const [hRaw, mRaw] = val.split(':').map(Number);
    const ampm = hRaw >= 12 ? 'PM' : 'AM';
    const h = hRaw % 12 === 0 ? 12 : hRaw % 12;
    return { h, m: mRaw, ampm };
  };

  const { h: initH, m: initM, ampm: initAmpm } = parse(value);
  const [hour, setHour] = useState(initH);
  const [minute, setMinute] = useState(initM);
  const [ampm, setAmpm] = useState(initAmpm);
  const [open, setOpen] = useState(false);

  const pickerRef = useRef(null);

  // Sync inward prop changes
  useEffect(() => {
    const { h, m, ampm: ap } = parse(value);
    setHour(h); setMinute(m); setAmpm(ap);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Convert to 24h and emit change
  const emit = (h, m, ap) => {
    let h24 = h % 12;
    if (ap === 'PM') h24 += 12;
    const val24 = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange({ target: { name, value: val24 } });
  };

  const changeHour = (delta) => {
    const next = ((hour - 1 + delta + 12) % 12) + 1;
    setHour(next); emit(next, minute, ampm);
  };
  const changeMinute = (delta) => {
    const next = (minute + delta * 5 + 60) % 60;
    setMinute(next); emit(hour, next, ampm);
  };
  const toggleAmpm = () => {
    const next = ampm === 'AM' ? 'PM' : 'AM';
    setAmpm(next); emit(hour, minute, next);
  };

  // Display string
  const displayTime = value
    ? new Date(`1970-01-01T${value}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : 'Select time';

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div ref={pickerRef} style={{ position: 'relative', userSelect: 'none' }}>
      {/* Trigger Input */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.65rem 1rem',
          borderRadius: '10px',
          border: open ? '1.5px solid #e11d48' : '1.5px solid var(--border-color)',
          background: 'var(--bg-card-subtle)',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
          boxShadow: open ? '0 0 0 3px rgba(225,29,72,0.12)' : 'none',
          minHeight: '46px'
        }}
      >
        <Clock size={18} color="#e11d48" style={{ flexShrink: 0 }} />
        <span style={{
          fontSize: '1.05rem',
          fontWeight: '700',
          color: value ? 'var(--text-main)' : 'var(--text-muted)',
          letterSpacing: '0.04em',
          flex: 1
        }}>
          {displayTime}
        </span>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: '600',
          padding: '0.2rem 0.55rem',
          borderRadius: '20px',
          background: open ? 'rgba(225,29,72,0.12)' : 'var(--bg-card)',
          color: open ? '#e11d48' : 'var(--text-muted)',
          border: '1px solid var(--border-color)',
          transition: 'all 0.15s ease'
        }}>
          {open ? 'Close ✕' : 'Change ▾'}
        </span>
      </div>

      {/* Dropdown Picker */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          zIndex: 200,
          background: 'var(--bg-card)',
          border: '1.5px solid rgba(225,29,72,0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          padding: '1.25rem',
          minWidth: '280px',
          backdropFilter: 'blur(12px)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem', paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={15} color="#e11d48" />
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Select Time
              </span>
            </div>
            <div style={{
              background: 'rgba(225,29,72,0.1)',
              border: '1px solid rgba(225,29,72,0.25)',
              borderRadius: '8px',
              padding: '0.25rem 0.7rem',
              fontSize: '1rem',
              fontWeight: '800',
              color: '#e11d48',
              letterSpacing: '0.05em'
            }}>
              {String(hour).padStart(2,'0')} : {String(minute).padStart(2,'0')} {ampm}
            </div>
          </div>

          {/* Columns */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>

            {/* HOUR Column */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Hour</div>
              <button type="button" onClick={() => changeHour(1)} style={arrowBtn}>
                <ChevronUp size={18} />
              </button>
              <div style={{
                margin: '0.4rem 0',
                fontSize: '1.9rem',
                fontWeight: '800',
                color: 'var(--text-main)',
                background: 'rgba(225,29,72,0.08)',
                borderRadius: '10px',
                padding: '0.4rem 0',
                border: '1px solid rgba(225,29,72,0.2)'
              }}>
                {String(hour).padStart(2, '0')}
              </div>
              <button type="button" onClick={() => changeHour(-1)} style={arrowBtn}>
                <ChevronDown size={18} />
              </button>

              {/* Quick hour grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px', marginTop: '0.6rem' }}>
                {hours.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => { setHour(h); emit(h, minute, ampm); }}
                    style={{
                      ...quickBtn,
                      background: hour === h ? '#e11d48' : 'var(--bg-card-subtle)',
                      color: hour === h ? '#fff' : 'var(--text-main)',
                      fontWeight: hour === h ? '700' : '500',
                      border: hour === h ? '1px solid #e11d48' : '1px solid var(--border-color)'
                    }}
                  >
                    {String(h).padStart(2,'0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', background: 'var(--border-color)', alignSelf: 'stretch', margin: '0 0.1rem' }} />

            {/* MINUTE Column */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Min</div>
              <button type="button" onClick={() => changeMinute(1)} style={arrowBtn}>
                <ChevronUp size={18} />
              </button>
              <div style={{
                margin: '0.4rem 0',
                fontSize: '1.9rem',
                fontWeight: '800',
                color: 'var(--text-main)',
                background: 'rgba(225,29,72,0.08)',
                borderRadius: '10px',
                padding: '0.4rem 0',
                border: '1px solid rgba(225,29,72,0.2)'
              }}>
                {String(minute).padStart(2, '0')}
              </div>
              <button type="button" onClick={() => changeMinute(-1)} style={arrowBtn}>
                <ChevronDown size={18} />
              </button>

              {/* Quick minute grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', marginTop: '0.6rem' }}>
                {minutes.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMinute(m); emit(hour, m, ampm); }}
                    style={{
                      ...quickBtn,
                      background: minute === m ? '#e11d48' : 'var(--bg-card-subtle)',
                      color: minute === m ? '#fff' : 'var(--text-main)',
                      fontWeight: minute === m ? '700' : '500',
                      border: minute === m ? '1px solid #e11d48' : '1px solid var(--border-color)'
                    }}
                  >
                    {String(m).padStart(2,'0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', background: 'var(--border-color)', alignSelf: 'stretch', margin: '0 0.1rem' }} />

            {/* AM/PM Column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem', minWidth: '50px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>AM/PM</div>
              {['AM', 'PM'].map(ap => (
                <button
                  key={ap}
                  type="button"
                  onClick={() => { setAmpm(ap); emit(hour, minute, ap); }}
                  style={{
                    padding: '0.65rem 0',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    border: ampm === ap ? '1.5px solid #e11d48' : '1.5px solid var(--border-color)',
                    background: ampm === ap ? '#e11d48' : 'var(--bg-card-subtle)',
                    color: ampm === ap ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                    letterSpacing: '0.04em'
                  }}
                >
                  {ap}
                </button>
              ))}
            </div>
          </div>

          {/* Done button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.6rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              border: 'none',
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#fff',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 14px rgba(225,29,72,0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            ✓ Done — {String(hour).padStart(2,'0')}:{String(minute).padStart(2,'0')} {ampm}
          </button>
        </div>
      )}
    </div>
  );
}

const arrowBtn = {
  width: '100%',
  padding: '0.3rem 0',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card-subtle)',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.12s ease'
};

const quickBtn = {
  padding: '0.3rem 0.1rem',
  borderRadius: '6px',
  fontSize: '0.72rem',
  cursor: 'pointer',
  transition: 'all 0.12s ease'
};
