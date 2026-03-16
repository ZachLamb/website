'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Heart, CheckCircle } from 'lucide-react';

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
  const [formTimestamp] = useState(() => Date.now().toString());
  const [pitchLength, setPitchLength] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const dialogTitleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const totalQuestions = radioQuestions.length;
  const answeredCount = answeredQuestions.size;

  useEffect(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      const savedScrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
      window.removeEventListener('keydown', onKey);
      returnFocusRef.current?.focus();
    };
  }, [onClose]);

  function handleRadioChange(questionName: string) {
    setAnsweredQuestions((prev) => new Set(prev).add(questionName));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/snack/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      let json: unknown = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        setStatus('error');
        const message =
          typeof json === 'object' &&
          json !== null &&
          'error' in json &&
          typeof json.error === 'string'
            ? json.error
            : 'Something went wrong. Please try again.';
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
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
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          background: '#111111',
          border: '1px solid #2a2a2a',
          borderRadius: '6px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: 'calc(100dvh - 48px)',
          display: 'flex',
          flexDirection: 'column',
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
          <h2
            id={dialogTitleId}
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}
          >
            Friend Request Application
          </h2>
          <button
            ref={closeButtonRef}
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
        <div style={{ padding: '16px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              style={{ textAlign: 'center', padding: '32px 16px' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: 'backOut' as const }}
              >
                <CheckCircle size={48} style={{ color: '#ff3399', marginBottom: '12px' }} />
              </motion.div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ff3399',
                  marginBottom: '8px',
                }}
              >
                Application Received!
              </div>
              <p
                style={{ color: '#aaaacc', fontSize: '13px', lineHeight: 1.6, margin: '0 0 20px' }}
              >
                Snack will review your file shortly. In the meantime, keep being cute.
              </p>
              <button
                onClick={onClose}
                style={{
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
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Anti-bot: honeypot field (hidden from real users) */}
              <div
                aria-hidden="true"
                tabIndex={-1}
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: '-9999px',
                  opacity: 0,
                  height: 0,
                  overflow: 'hidden',
                }}
              >
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              {/* Anti-bot: form render timestamp */}
              <input type="hidden" name="_t" value={formTimestamp} />

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
                  onChange={(e) => setPitchLength(e.target.value.length)}
                />
                <div
                  style={{
                    fontSize: '10px',
                    color: pitchLength > 1800 ? '#ff6666' : '#555555',
                    textAlign: 'right',
                    marginTop: '2px',
                  }}
                >
                  {pitchLength}/2000
                </div>
              </div>

              {/* Progress indicator */}
              {answeredCount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: '11px',
                    color: '#777777',
                  }}
                >
                  <Heart size={10} style={{ color: '#ff3399' }} />
                  <span>
                    {answeredCount}/{totalQuestions} questions answered
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '3px',
                      background: '#1a1a1a',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(answeredCount / totalQuestions) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #ff3399, #cc77ff)',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Radio questions */}
              {radioQuestions.map((q) => (
                <fieldset key={q.name} style={{ border: 'none', margin: '0 0 14px', padding: 0 }}>
                  <legend
                    style={{
                      ...labelStyle,
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {q.label} *
                    {answeredQuestions.has(q.name) && (
                      <CheckCircle size={11} style={{ color: '#44cc88' }} />
                    )}
                  </legend>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                          padding: '5px 8px',
                          borderRadius: '4px',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <input
                          type="radio"
                          name={q.name}
                          value={opt}
                          required
                          style={{ accentColor: '#ff3399' }}
                          onChange={() => handleRadioChange(q.name)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              {status === 'error' && (
                <div
                  role="alert"
                  style={{
                    color: '#ff6666',
                    fontSize: '12px',
                    marginBottom: '10px',
                    padding: '8px 12px',
                    background: 'rgba(255, 102, 102, 0.08)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 102, 102, 0.2)',
                  }}
                >
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
                  transition: 'opacity 0.15s',
                  opacity: status === 'submitting' ? 0.7 : 1,
                }}
              >
                <Send size={14} />
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
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
