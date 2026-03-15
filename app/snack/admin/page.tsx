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
  dogOpinion: string;
  idealDate: string;
  bigSpoon: string;
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
      const res = await fetch('/api/snack/admin/login', {
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
      const res = await fetch('/api/snack/admin/submissions');
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
            <Lock size={32} style={{ color: '#ff66cc' }} />
            <h1 style={{ fontSize: '18px', marginTop: '12px', color: '#ffffff' }}>
              Snack&apos;s Admin
            </h1>
            <p style={{ fontSize: '12px', color: '#aaaacc', marginTop: '4px' }}>
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
            <span style={{ color: '#ff66cc', fontSize: '14px' }}>({submissions.length})</span>
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchSubmissions} style={smallBtnStyle}>
              Refresh
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              style={{ ...smallBtnStyle, color: '#aaaacc' }}
            >
              <LogOut size={12} /> Log Out
            </button>
          </div>
        </div>

        {loading && <p style={{ color: '#aaaacc', textAlign: 'center' }}>Loading...</p>}

        {!loading && submissions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666688',
              background: '#001a33',
              borderRadius: '6px',
              border: '1px solid #336699',
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
                <span style={{ fontWeight: 'bold', color: '#77bbff', fontSize: '14px' }}>
                  {s.name}
                </span>
                <span style={{ color: '#aaaacc', fontSize: '12px', marginLeft: '8px' }}>
                  {s.age} &middot; {s.location}
                </span>
                {s.instagram && (
                  <span style={{ color: '#ff66cc', fontSize: '12px', marginLeft: '8px' }}>
                    {s.instagram}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#666688', fontSize: '10px' }}>
                  {new Date(s.submittedAt).toLocaleDateString()}
                </span>
                {expanded.has(s.id) ? (
                  <ChevronUp size={14} style={{ color: '#aaaacc' }} />
                ) : (
                  <ChevronDown size={14} style={{ color: '#aaaacc' }} />
                )}
              </div>
            </div>

            {expanded.has(s.id) && (
              <div
                style={{ marginTop: '12px', borderTop: '1px solid #336699', paddingTop: '12px' }}
              >
                <DetailRow label="Pitch" value={s.pitch} />
                <DetailRow label="Love Language" value={s.loveLanguage} />
                <DetailRow label="Oreo Preference" value={s.oreoPreference} />
                <DetailRow label="Dog Opinion" value={s.dogOpinion} />
                <DetailRow label="Ideal Date" value={s.idealDate} />
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
          color: '#77bbff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: '10px',
        }}
      >
        {label}
      </span>
      <div style={{ color: '#ccccdd', marginTop: '2px', whiteSpace: 'pre-wrap' }}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100dvh',
  background: '#003366',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontFamily: "'Trebuchet MS', Verdana, Arial, sans-serif",
  color: '#ffffff',
};

const loginCardStyle: React.CSSProperties = {
  background: '#001a33',
  border: '1px solid #336699',
  borderRadius: '8px',
  padding: '32px',
  maxWidth: '360px',
  width: '100%',
  marginTop: '80px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #336699',
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
  background: 'linear-gradient(180deg, #ff66cc 0%, #cc3399 100%)',
  border: '2px solid #ff88dd',
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
  border: '1px solid #336699',
  borderRadius: '4px',
  color: '#77bbff',
  padding: '6px 12px',
  fontSize: '11px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const cardStyle: React.CSSProperties = {
  background: '#001a33',
  border: '1px solid #336699',
  borderRadius: '6px',
  padding: '14px 16px',
  marginBottom: '10px',
};
