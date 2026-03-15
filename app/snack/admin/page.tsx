'use client';

import { useState } from 'react';
import { Lock, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  age: number;
  location: string;
  instagram: string;
  pitch: string;
  loveLanguage: string;
  oreoPreference: string;
  petOpinion: string;
  idealDate: string;
  travelStyle: string;
  bigSpoon: string;
  dogOpinion?: string;
  submittedAt: string;
}

export default function SnackAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/myspace/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const json = await res.json();
        setLoginError(json.error ?? 'Login failed');
        return;
      }
      setAuthenticated(true);
      setPassword('');
      await fetchSubmissions();
    } catch {
      setLoginError('Network error');
    }
  }

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const res = await fetch('/api/myspace/admin/submissions');
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setSubmissions(json.submissions ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!authenticated) {
    return (
      <div style={pageStyle}>
        <div style={loginCardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Lock size={32} style={{ color: '#ff3399' }} />
            <h1 style={{ fontSize: '18px', marginTop: '12px', color: '#ffffff' }}>
              Snack&apos;s Admin
            </h1>
            <p style={{ fontSize: '12px', color: '#999999', marginTop: '4px' }}>
              Enter the password to view applications
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={inputStyle}
              autoFocus
            />
            {loginError && (
              <div style={{ color: '#ff6666', fontSize: '12px', marginTop: '8px' }}>
                {loginError}
              </div>
            )}
            <button type="submit" style={buttonStyle}>
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '800px', width: '100%', padding: '0 12px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingTop: '20px',
          }}
        >
          <h1 style={{ fontSize: '18px', color: '#ffffff' }}>
            Friend Requests{' '}
            <span style={{ color: '#ff3399', fontSize: '14px' }}>({submissions.length})</span>
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchSubmissions} style={smallBtnStyle}>
              Refresh
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              style={{ ...smallBtnStyle, color: '#999999' }}
            >
              <LogOut size={12} /> Log Out
            </button>
          </div>
        </div>

        {loading && <p style={{ color: '#999999', textAlign: 'center' }}>Loading...</p>}

        {!loading && submissions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#555555',
              background: '#111111',
              borderRadius: '6px',
              border: '1px solid #2a2a2a',
            }}
          >
            No applications yet. The queue is empty.
          </div>
        )}

        {submissions.map((s) => (
          <div key={s.id} style={cardStyle}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => toggleExpanded(s.id)}
            >
              <div>
                <span style={{ fontWeight: 'bold', color: '#cc77ff', fontSize: '14px' }}>
                  {s.name}
                </span>
                <span style={{ color: '#999999', fontSize: '12px', marginLeft: '8px' }}>
                  {s.age} &middot; {s.location}
                </span>
                {s.instagram && (
                  <span style={{ color: '#ff3399', fontSize: '12px', marginLeft: '8px' }}>
                    {s.instagram}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#555555', fontSize: '10px' }}>
                  {new Date(s.submittedAt).toLocaleDateString()}
                </span>
                {expanded.has(s.id) ? (
                  <ChevronUp size={14} style={{ color: '#999999' }} />
                ) : (
                  <ChevronDown size={14} style={{ color: '#999999' }} />
                )}
              </div>
            </div>

            {expanded.has(s.id) && (
              <div
                style={{ marginTop: '12px', borderTop: '1px solid #2a2a2a', paddingTop: '12px' }}
              >
                <DetailRow label="Pitch" value={s.pitch} />
                <DetailRow label="Love Language" value={s.loveLanguage} />
                <DetailRow label="Oreo Preference" value={s.oreoPreference} />
                <DetailRow label="Pet Opinion" value={s.petOpinion || s.dogOpinion || 'N/A'} />
                <DetailRow label="Ideal Date" value={s.idealDate} />
                <DetailRow label="Travel Style" value={s.travelStyle || 'N/A'} />
                <DetailRow label="Spoon" value={s.bigSpoon} />
                <DetailRow label="Submitted" value={new Date(s.submittedAt).toLocaleString()} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '8px', fontSize: '12px' }}>
      <span
        style={{
          color: '#cc77ff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: '10px',
        }}
      >
        {label}
      </span>
      <div style={{ color: '#bbbbbb', marginTop: '2px', whiteSpace: 'pre-wrap' }}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100dvh',
  background: '#0a0a0a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontFamily: "'Trebuchet MS', Verdana, Arial, sans-serif",
  color: '#ffffff',
};

const loginCardStyle: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  padding: '32px',
  maxWidth: '360px',
  width: '100%',
  marginTop: '80px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #2a2a2a',
  borderRadius: '4px',
  color: '#ffffff',
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'inherit',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginTop: '12px',
  background: 'linear-gradient(180deg, #ff3399 0%, #990044 100%)',
  border: '2px solid #ff4488',
  borderRadius: '6px',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const smallBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #2a2a2a',
  borderRadius: '4px',
  color: '#cc77ff',
  padding: '6px 12px',
  fontSize: '11px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const cardStyle: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  padding: '14px 16px',
  marginBottom: '10px',
};
