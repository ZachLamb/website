'use client';

import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const radioQuestions = [
  {
    name: 'loveLanguage',
    label: 'Love Language',
    options: [
      'Words of Affirmation',
      'Quality Time',
      'Physical Touch',
      'Acts of Service',
      'Gifts (especially Oreos)',
    ],
  },
  {
    name: 'oreoPreference',
    label: 'Oreo Preference',
    options: [
      'Double Stuf',
      'Regular',
      'Mega Stuf',
      'Thins (red flag)',
      "I don't like Oreos (dealbreaker)",
    ],
  },
  {
    name: 'petOpinion',
    label: 'How do you feel about pets?',
    options: [
      'Pets are everything (dogs AND cats)',
      'Dog person',
      'Cat person',
      'Both are great',
      'Allergic but willing to suffer',
    ],
  },
  {
    name: 'idealDate',
    label: 'Ideal Date',
    options: [
      'Hiking then tacos',
      'Couch, blankets, horror movie',
      "Fancy dinner, we're dressing up",
      'Surprise me',
    ],
  },
  {
    name: 'travelStyle',
    label: 'Favorite way to travel?',
    options: [
      'Half adventure, half relaxing (like Snack)',
      'All adventure, no downtime',
      'All relaxing, no plans',
      'Wherever the food is best',
      "I don't travel much",
    ],
  },
  {
    name: 'bigSpoon',
    label: 'Big spoon or little spoon?',
    options: ['Big spoon', 'Little spoon', 'Switch hitter', "Separate blankets, don't touch me"],
  },
];

interface Props {
  onClose: () => void;
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: string) => void;
}

export default function ApplicationModal({ onClose, onSubmitSuccess, onSubmitError }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/myspace/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus('error');
        const message = json.error ?? 'Something went wrong';
        setErrorMsg(message);
        onSubmitError?.(message);
        return;
      }
      setStatus('success');
      onSubmitSuccess?.();
    } catch {
      setStatus('error');
      const message = 'Network error. Please try again.';
      setErrorMsg(message);
      onSubmitError?.(message);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 12px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#111111',
          border: '1px solid #2a2a2a',
          borderRadius: '6px',
          width: '100%',
          maxWidth: '520px',
          position: 'relative',
          fontFamily: "'Trebuchet MS', Verdana, Arial, sans-serif",
          color: '#ffffff',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, #1a1a1a 0%, #222222 100%)',
            padding: '12px 16px',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '6px 6px 0 0',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Friend Request Application
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#999999',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ff3399',
                  marginBottom: '12px',
                }}
              >
                Application Received!
              </div>
              <p style={{ color: '#aaaacc', fontSize: '13px', lineHeight: 1.6 }}>
                Snack will review your file shortly. In the meantime, keep being cute.
              </p>
              <button
                onClick={onClose}
                style={{
                  marginTop: '20px',
                  padding: '10px 24px',
                  background: 'linear-gradient(180deg, #ff3399 0%, #990044 100%)',
                  border: '2px solid #ff4488',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p
                style={{
                  fontSize: '12px',
                  color: '#999999',
                  marginBottom: '16px',
                  lineHeight: 1.5,
                }}
              >
                Think you have what it takes? Fill out this application and Snack will get back to
                you. Probably. Find Snack on IG:{' '}
                <span style={{ color: '#ff3399', fontWeight: 'bold' }}>@gayhiker</span>
              </p>

              {/* Text fields */}
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Name *</label>
                <input
                  name="name"
                  required
                  maxLength={100}
                  style={inputStyle}
                  placeholder="What should Snack call you?"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Age *</label>
                  <input name="age" type="number" required min={18} max={120} style={inputStyle} />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={labelStyle}>Location *</label>
                  <input
                    name="location"
                    required
                    maxLength={200}
                    style={inputStyle}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Instagram</label>
                <input
                  name="instagram"
                  maxLength={100}
                  style={inputStyle}
                  placeholder="@handle (optional)"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Why should Snack pick you? *</label>
                <textarea
                  name="pitch"
                  required
                  maxLength={2000}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Make your case..."
                />
              </div>

              {/* Radio questions */}
              {radioQuestions.map((q) => (
                <fieldset key={q.name} style={{ border: 'none', margin: '0 0 14px', padding: 0 }}>
                  <legend style={{ ...labelStyle, marginBottom: '6px' }}>{q.label} *</legend>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: '#bbbbbb',
                          cursor: 'pointer',
                          padding: '4px 0',
                        }}
                      >
                        <input
                          type="radio"
                          name={q.name}
                          value={opt}
                          required
                          style={{ accentColor: '#ff3399' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              {status === 'error' && (
                <div style={{ color: '#ff6666', fontSize: '12px', marginBottom: '10px' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  background:
                    status === 'submitting'
                      ? '#555'
                      : 'linear-gradient(180deg, #ff3399 0%, #990044 100%)',
                  border: '2px solid #ff88dd',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: status === 'submitting' ? 'wait' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <Send size={14} />
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#cc77ff',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #2a2a2a',
  borderRadius: '4px',
  color: '#ffffff',
  padding: '8px 10px',
  fontSize: '13px',
  fontFamily: 'inherit',
};
