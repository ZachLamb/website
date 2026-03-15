'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { track } from '@vercel/analytics';
import {
  Mail,
  Eye,
  Target,
  Briefcase,
  Heart,
  Users,
  GraduationCap,
  MessageCircle,
  ClipboardList,
  MapPin,
  Lock,
  UserPlus,
  Share2,
  Gift,
  Ban,
  Send,
  Music,
  SkipBack,
  SkipForward,
  Play,
  Volume2,
} from 'lucide-react';
import { getRandomSong } from '@/data/songs';
import ApplicationModal from './ApplicationModal';
import { MyspaceProfileImage } from './MyspaceProfileImage';

/* ─── data ──────────────────────────────────────────────── */

const skills = [
  { name: 'Big spoon, little spoon, emergency spoon', hearts: 6 },
  { name: 'Active listening with sustained eye contact', hearts: 5 },
  { name: 'Professional-grade playlist curation', hearts: 5 },
  { name: 'Remembering your coffee order after hearing it once', hearts: 4 },
  { name: 'Looking good in your hoodie', hearts: 5 },
  { name: 'Incredibly muscular & hairy ass that feels so good to be inside', hearts: 5 },
  { name: 'Singing Celine Dion out of key on demand', hearts: 5 },
];

const experience = [
  {
    title: 'Chief Sweetie Pie',
    place: 'Self-Employed (Lifetime)',
    desc: 'Consistently exceeded expectations in thoughtfulness, snack-sharing, and unsolicited forehead kisses. Maintained a 100% approval rating among all pets (cats and dogs), friends, parents, nieces, and nephews.',
  },
  {
    title: 'Senior Cutie Pie',
    place: 'The Mirror Every Morning',
    desc: 'Delivered daily cuteness with zero downtime. Recognized by peers for laugh deployment and smile ROI. Successfully charmed baristas into free extra shots on 2 separate occasions. Created new process on how to handle and maintain attachment style.',
  },
  {
    title: 'Cutie Pie',
    place: 'Various Locations (Denver, PNW, and SLC)',
    desc: 'Expanded emotional capacity by living in multiple cities and collecting strangers who became family.',
  },
  {
    title: 'Jr. Cutie Pie',
    place: "The Therapist's Couch",
    desc: 'Created more capacity to grow and love through consistent therapy. Decommissioned legacy defense mechanisms. Shipped vulnerability 2.0 with improved uptime and fewer walls.',
  },
  {
    title: "Intern, Being Somebody's Person",
    place: 'Early Career',
    desc: 'Learned the fundamentals: how to apologize like you mean it, when to shut up and listen, and that love is a verb not a vibe. Graduated with bruises and better boundaries.',
  },
];

const comments = [
  {
    name: 'CuddleBear2024',
    initial: 'C',
    color: '#e06090',
    text: 'omg snack ur profile is SO cute!! we should totally hang out sometime',
    time: '2 hours ago',
  },
  {
    name: 'HikingHottie',
    initial: 'H',
    color: '#60a0e0',
    text: "love the resume format lol. also ur music taste? *chef's kiss*",
    time: '5 hours ago',
  },
  {
    name: 'OreoEnthusiast',
    initial: 'O',
    color: '#a070d0',
    text: 'double stuf or regular? this is a dealbreaker question.',
    time: '1 day ago',
  },
  {
    name: 'DenverDaddy',
    initial: 'D',
    color: '#50b080',
    text: 'just here to say the hoodie thing is real. i want it back btw.',
    time: '2 days ago',
  },
];

const sendMessageTemplates = [
  "Zach, I think you're a total cutie pie. I'd love a chance to steal a little of your time.",
  'Dear Zach, your profile is dangerously charming. Can I apply for one flirty conversation?',
  'Hi Zach, this is me bravely shooting my shot. You seem sweet, funny, and very kissable.',
  "Zach, your vibe is immaculate. If you're free, I'd love to be your next cute distraction.",
  "Hey Zach, I brought confidence and Oreos. I think we'd make a very solid team.",
];

const friendColors = [
  '#e06090',
  '#60a0e0',
  '#a070d0',
  '#50b080',
  '#e0a040',
  '#d06060',
  '#6080d0',
  '#c060c0',
];
const topFriends = [
  { name: 'Tom', initial: 'T' },
  { name: 'Paris Hilton', initial: 'P' },
  { name: 'Britney Spears', initial: 'B' },
  { name: 'Lindsay Lohan', initial: 'L' },
  { name: 'Nicole Richie', initial: 'N' },
  { name: 'Jenna Marbles', initial: 'J' },
  { name: 'Lady Gaga', initial: 'L' },
  { name: 'Hayley Williams', initial: 'H' },
];

const interests = [
  { label: 'General', value: 'Hiking, Pets, Oreos, Being the big spoon, Therapy, Gay stuff' },
  {
    label: 'Music',
    value: 'Paramore, Blink-182, Carly Rae Jepsen, Avril Lavigne, whatever you put on',
  },
  { label: 'Movies', value: 'Anything where the pet lives, 90s romcoms, horror (I will hold you)' },
  { label: 'Television', value: 'Drag Race, Great British Bake Off, whatever true crime you pick' },
  { label: 'Heroes', value: 'My therapist, every pet I have ever met, Dolly Parton' },
  {
    label: 'Travel',
    value:
      'Half adventure (museums, exploring the city, hiking) and half relaxing (beach, pool, doing absolutely nothing)',
  },
];

/* ─── client-only Spotify player (avoids hydration mismatch from Math.random) ── */

function SpotifyPlayerInner() {
  const song = getRandomSong();
  return (
    <div className="ms-myspace-player">
      {/* Player chrome header */}
      <div className="ms-player-header">
        <div className="ms-player-title">
          <Music size={12} />
          <span>Snack&apos;s Music</span>
        </div>
        <div className="ms-player-eq">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="ms-eq-bar" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>

      {/* Song info + decorative transport */}
      <div className="ms-player-info">
        <div className="ms-player-song">
          <span className="ms-player-song-title">{song.title}</span>
          <span className="ms-player-song-artist">{song.artist}</span>
        </div>
        <div className="ms-player-controls">
          <button className="ms-player-btn" aria-hidden="true" tabIndex={-1}>
            <SkipBack size={12} />
          </button>
          <button className="ms-player-btn ms-player-btn-play" aria-hidden="true" tabIndex={-1}>
            <Play size={14} fill="currentColor" />
          </button>
          <button className="ms-player-btn" aria-hidden="true" tabIndex={-1}>
            <SkipForward size={12} />
          </button>
          <button className="ms-player-btn" aria-hidden="true" tabIndex={-1}>
            <Volume2 size={12} />
          </button>
        </div>
      </div>

      {/* Compact Spotify embed */}
      <iframe
        src={`https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator&theme=0`}
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={`Now playing: ${song.title} by ${song.artist}`}
        style={{ width: '100%', border: 'none', borderRadius: '0 0 4px 4px', display: 'block' }}
      />
    </div>
  );
}

const SpotifyPlayer = dynamic(() => Promise.resolve({ default: SpotifyPlayerInner }), {
  ssr: false,
});

/* ─── component ─────────────────────────────────────────── */

export default function SnackPage() {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [messageState, setMessageState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [sentMessage, setSentMessage] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sendTimerRef = useRef<number | null>(null);

  function trackMyspace(action: string, details: Record<string, string> = {}) {
    track('myspace_interaction', { slug: 'myspace', action, ...details });
  }

  useEffect(() => {
    track('myspace_page_view', { slug: 'myspace', path: '/myspace' });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    return () => {
      if (sendTimerRef.current !== null) {
        window.clearTimeout(sendTimerRef.current);
      }
    };
  }, []);

  function handleSendMessage() {
    if (messageState === 'sending') return;
    trackMyspace('send_message_click', { state: messageState });

    if (sendTimerRef.current !== null) {
      window.clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }

    const randomMessage =
      sendMessageTemplates[Math.floor(Math.random() * sendMessageTemplates.length)];
    setMessageState('sending');

    sendTimerRef.current = window.setTimeout(
      () => {
        setSentMessage(randomMessage);
        setMessageState('sent');
        sendTimerRef.current = null;
      },
      prefersReducedMotion ? 220 : 1100,
    );
  }

  function handleOpenApplication() {
    trackMyspace('open_application_modal');
    setShowApplication(true);
  }

  function handleCloseApplication() {
    trackMyspace('close_application_modal');
    setShowApplication(false);
  }

  return (
    <div className="myspace-page">
      <style>{`
        /* Override main site body background */
        body:has(.myspace-page) {
          background-color: #0a0a0a !important;
          background-image: none !important;
        }

        .myspace-page {
          --ms-bg: #0a0a0a;
          --ms-profile-bg: #0d0d0d;
          --ms-section-bg: #111111;
          --ms-border: #2a2a2a;
          --ms-text: #e0e0e0;
          --ms-link: #cc77ff;
          --ms-accent: #ff3399;
          --ms-online: #00ff66;

          min-height: 100dvh;
          min-height: 100vh;
          background-color: var(--ms-bg);
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(128, 0, 128, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(255, 0, 100, 0.05) 0%, transparent 50%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.008) 2px,
              rgba(255, 255, 255, 0.008) 4px
            );
          color: var(--ms-text);
          font-family: 'Trebuchet MS', Verdana, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          overflow-x: hidden;
        }

        .myspace-page * {
          box-sizing: border-box;
        }

        /* ── keyframes ── */
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes blink-online {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes rainbow {
          0% { color: #ff0000; }
          16% { color: #ff8800; }
          33% { color: #ffff00; }
          50% { color: #00ff00; }
          66% { color: #0088ff; }
          83% { color: #8800ff; }
          100% { color: #ff0000; }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #ffcc00;
          border-radius: 50%;
          animation: sparkle 1.5s ease-in-out infinite;
          pointer-events: none;
        }

        /* ── header bar ── */
        .ms-header {
          background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
          border-bottom: 2px solid #333333;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .ms-header-logo {
          font-size: 20px;
          font-weight: bold;
          color: #ffffff;
          letter-spacing: -0.5px;
        }
        .ms-header-logo span {
          color: var(--ms-accent);
        }
        .ms-header-nav {
          display: none;
          gap: 16px;
          font-size: 12px;
        }
        .ms-header-nav a {
          color: #999999;
          text-decoration: none;
        }
        .ms-header-nav a:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        /* ── url bar (desktop) ── */
        .ms-url-bar {
          display: none;
          background: #1a1a1a;
          border: 1px solid #333333;
          border-radius: 3px;
          padding: 4px 8px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #999999;
          margin: 8px 16px 0;
        }
        .ms-url-bar span {
          color: var(--ms-link);
        }

        /* ── two-column layout ── */
        .ms-layout {
          max-width: 960px;
          margin: 0 auto;
          padding: 12px;
        }
        .ms-columns {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ms-col-left {
          width: 100%;
        }
        .ms-col-right {
          width: 100%;
        }

        /* ── profile card ── */
        .ms-profile-header {
          background: var(--ms-profile-bg);
          border: 2px solid var(--ms-border);
          border-radius: 4px;
          padding: 16px;
          text-align: center;
        }
        .ms-profile-photo {
          width: 140px;
          height: 140px;
          border-radius: 4px;
          border: 3px solid var(--ms-accent);
          margin: 0 auto 12px;
          background: linear-gradient(135deg, #1a0a1a 0%, #0d0d1a 50%, #1a0a2e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 56px;
          position: relative;
          overflow: hidden;
        }
        .ms-profile-name {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 2px;
          animation: rainbow 4s linear infinite;
        }
        .ms-profile-tagline {
          color: var(--ms-accent);
          font-style: italic;
          font-size: 13px;
          margin: 0 0 8px;
        }
        .ms-online-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid rgba(0, 255, 0, 0.3);
          border-radius: 12px;
          padding: 3px 12px;
          font-size: 11px;
          color: var(--ms-online);
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ms-online-dot {
          width: 8px;
          height: 8px;
          background: var(--ms-online);
          border-radius: 50%;
          animation: blink-online 1.5s ease-in-out infinite;
        }

        .ms-mood {
          margin-top: 10px;
          font-size: 12px;
          color: #999999;
        }
        .ms-mood strong {
          color: var(--ms-link);
        }

        .ms-details {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px 16px;
          font-size: 12px;
          color: #999999;
        }
        .ms-detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ms-detail-label {
          color: #666666;
        }

        /* ── contacting box ── */
        .ms-contacting {
          background: var(--ms-section-bg);
          border: 1px solid var(--ms-border);
          border-radius: 4px;
          margin: 12px 0;
          overflow: hidden;
        }
        .ms-contacting-header {
          background: linear-gradient(90deg, #1a1a1a 0%, #222222 100%);
          padding: 6px 10px;
          font-weight: bold;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid var(--ms-border);
          color: var(--ms-accent);
        }
        .ms-contacting-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          padding: 10px;
        }
        .ms-action-btn {
          background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid var(--ms-border);
          border-radius: 3px;
          color: var(--ms-link);
          font-size: 10px;
          font-family: inherit;
          padding: 6px 4px;
          cursor: pointer;
          text-align: center;
          transition: background 0.15s, border-color 0.15s;
        }
        .ms-action-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--ms-accent);
          color: var(--ms-accent);
        }
        .ms-action-btn:disabled {
          opacity: 0.6;
          cursor: wait;
        }
        .ms-action-btn.is-sending {
          border-color: var(--ms-accent);
          color: var(--ms-accent);
        }
        .ms-send-message-feedback {
          margin: 0 10px 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 8px 10px;
          background: rgba(255,255,255,0.03);
          font-size: 11px;
          color: #bfbfd8;
          min-height: 34px;
        }
        .ms-send-message-row {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          line-height: 1.4;
        }
        .ms-send-message-row.is-sent {
          color: #d6b3ff;
        }
        .ms-send-spinner {
          flex-shrink: 0;
          margin-top: 1px;
          animation: send-spin 0.9s linear infinite;
        }
        .ms-send-label {
          font-weight: bold;
          color: var(--ms-accent);
        }

        /* ── details table ── */
        .ms-details-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin-top: 8px;
        }
        .ms-details-table td {
          padding: 4px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          vertical-align: top;
        }
        .ms-details-table td:first-child {
          color: var(--ms-link);
          font-weight: bold;
          white-space: nowrap;
          width: 80px;
        }
        .ms-details-table td:last-child {
          color: #999999;
        }

        /* ── sections ── */
        .ms-section {
          background: var(--ms-section-bg);
          border: 1px solid var(--ms-border);
          border-radius: 4px;
          margin: 12px 0;
          overflow: hidden;
        }
        .ms-section-header {
          background: linear-gradient(90deg, #1a1a1a 0%, #222222 100%);
          padding: 8px 12px;
          font-weight: bold;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid var(--ms-border);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ms-section-body {
          padding: 12px;
          font-size: 13px;
          line-height: 1.6;
          color: #bbbbbb;
        }

        /* ── spotify / myspace player ── */
        .ms-spotify {
          margin: 12px 0;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
        }
        .ms-myspace-player {
          background: linear-gradient(180deg, #141414 0%, #0a0a0a 100%);
        }
        .ms-player-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%);
          border-bottom: 1px solid #2a2a2a;
        }
        .ms-player-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #999999;
        }
        .ms-player-eq {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }
        .ms-eq-bar {
          width: 3px;
          background: var(--ms-accent);
          border-radius: 1px;
          animation: eq-bounce 0.8s ease-in-out infinite alternate;
        }
        .ms-eq-bar:nth-child(1) { height: 4px; }
        .ms-eq-bar:nth-child(2) { height: 10px; }
        .ms-eq-bar:nth-child(3) { height: 6px; }
        .ms-eq-bar:nth-child(4) { height: 12px; }
        .ms-eq-bar:nth-child(5) { height: 8px; }
        @keyframes eq-bounce {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        @keyframes send-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .ms-player-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-bottom: 1px solid #1a1a1a;
        }
        .ms-player-song {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .ms-player-song-title {
          font-size: 12px;
          font-weight: bold;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ms-player-song-artist {
          font-size: 10px;
          color: #777777;
        }
        .ms-player-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .ms-player-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid #2a2a2a;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999999;
          cursor: default;
          font-size: 0;
          padding: 0;
        }
        .ms-player-btn-play {
          width: 32px;
          height: 32px;
          background: rgba(255,102,204,0.15);
          border-color: var(--ms-accent);
          color: var(--ms-accent);
        }

        /* ── interests table ── */
        .ms-interests-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .ms-interests-table tr {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ms-interests-table tr:last-child {
          border-bottom: none;
        }
        .ms-interests-table td {
          padding: 8px 10px;
          vertical-align: top;
        }
        .ms-interests-table td:first-child {
          color: var(--ms-link);
          font-weight: bold;
          white-space: nowrap;
          width: 90px;
          background: rgba(255,255,255,0.03);
        }
        .ms-interests-table td:last-child {
          color: #bbbbbb;
        }

        /* ── experience ── */
        .ms-exp-item {
          border-left: 2px solid var(--ms-accent);
          padding-left: 12px;
          margin-bottom: 14px;
          position: relative;
        }
        .ms-exp-item::before {
          content: '';
          position: absolute;
          left: -7px;
          top: 6px;
          width: 10px;
          height: 10px;
          background: var(--ms-accent);
          border-radius: 50%;
          border: 2px solid var(--ms-section-bg);
        }
        .ms-exp-title {
          font-weight: bold;
          color: var(--ms-link);
          font-size: 13px;
        }
        .ms-exp-place {
          color: var(--ms-accent);
          font-size: 11px;
          font-style: italic;
        }
        .ms-exp-desc {
          color: #999999;
          font-size: 12px;
          margin-top: 3px;
        }

        /* ── skills ── */
        .ms-skill-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 12px;
        }
        .ms-skill-name {
          flex: 1;
          min-width: 0;
          color: #bbbbbb;
        }
        .ms-skill-hearts {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }
        .ms-heart {
          animation: pulse-heart 2s ease-in-out infinite;
          color: var(--ms-accent);
        }
        .ms-heart-empty {
          opacity: 0.2;
        }

        /* ── top 8 ── */
        .ms-top8-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .ms-friend {
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 8px 4px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .ms-friend:hover {
          border-color: var(--ms-accent);
          transform: scale(1.05);
        }
        .ms-friend:active {
          transform: scale(0.95);
        }
        .ms-friend-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 4px;
          font-size: 16px;
          font-weight: bold;
          color: #ffffff;
          animation: float 3s ease-in-out infinite;
        }
        .ms-friend-name {
          font-size: 10px;
          color: var(--ms-link);
          word-break: break-word;
        }

        /* ── comments ── */
        .ms-comment {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ms-comment:last-child {
          border-bottom: none;
        }
        .ms-comment-avatar {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--ms-border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .ms-comment-body {
          flex: 1;
          min-width: 0;
        }
        .ms-comment-name {
          color: var(--ms-link);
          font-weight: bold;
          font-size: 12px;
        }
        .ms-comment-time {
          color: #555555;
          font-size: 10px;
          margin-left: 8px;
        }
        .ms-comment-text {
          color: #999999;
          font-size: 12px;
          margin-top: 2px;
        }

        /* ── marquee banner ── */
        .ms-marquee {
          background: linear-gradient(90deg, #1a0033, #330019, #0d0d0d, #1a0033);
          padding: 6px 0;
          overflow: hidden;
          white-space: nowrap;
          font-size: 12px;
          color: #ffcc00;
          font-weight: bold;
        }
        .ms-marquee span {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }

        /* ── cta button ── */
        .ms-cta {
          display: block;
          width: 100%;
          padding: 14px;
          background: linear-gradient(180deg, var(--ms-accent) 0%, #990044 100%);
          color: white;
          border: 2px solid #ff4488;
          border-radius: 6px;
          font-weight: bold;
          font-size: 15px;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          margin: 12px 0;
          transition: transform 0.15s;
          font-family: inherit;
        }
        .ms-cta:hover {
          filter: brightness(1.1);
        }
        .ms-cta:active {
          transform: scale(0.97);
        }

        /* ── education / certs ── */
        .ms-edu-item {
          margin-bottom: 10px;
          padding-left: 20px;
          position: relative;
          font-size: 12px;
          color: #bbbbbb;
        }
        .ms-edu-item::before {
          content: '';
          position: absolute;
          left: 2px;
          top: 4px;
          width: 8px;
          height: 8px;
          background: var(--ms-link);
          border-radius: 2px;
        }
        .ms-edu-item strong {
          color: var(--ms-link);
        }

        .ms-cert-item {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
          font-size: 12px;
          color: #bbbbbb;
        }
        .ms-cert-item::before {
          content: '\\2713';
          position: absolute;
          left: 2px;
          top: 0;
          color: var(--ms-online);
          font-weight: bold;
          font-size: 13px;
        }

        /* ── footer ── */
        .ms-footer {
          text-align: center;
          padding: 20px 12px;
          font-size: 11px;
          color: #444444;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ms-footer a {
          color: var(--ms-link);
          text-decoration: none;
        }
        .ms-footer a:hover {
          text-decoration: underline;
        }

        /* ── visitor counter ── */
        .ms-visitor-counter {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #000000;
          border: 1px solid #333333;
          border-radius: 3px;
          padding: 3px 10px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #00ff00;
          margin-top: 8px;
        }

        /* ── blinking stars (bg decoration) ── */
        .ms-stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .ms-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #ffffff;
          border-radius: 50%;
          animation: star-twinkle 3s ease-in-out infinite;
        }

        /* ── desktop layout (768px+) ── */
        @media (min-width: 768px) {
          .ms-header-nav {
            display: flex;
          }
          .ms-url-bar {
            display: block;
          }
          .ms-columns {
            flex-direction: row;
            align-items: flex-start;
          }
          .ms-col-left {
            width: 340px;
            flex-shrink: 0;
          }
          .ms-col-right {
            flex: 1;
            min-width: 0;
          }
          .ms-profile-photo {
            width: 180px;
            height: 180px;
            font-size: 72px;
          }
          .ms-top8-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
          .ms-friend-avatar {
            width: 48px;
            height: 48px;
            font-size: 18px;
          }
          .ms-friend-name {
            font-size: 11px;
          }
        }

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .sparkle,
          .ms-online-dot,
          .ms-heart,
          .ms-friend-avatar,
          .ms-marquee span,
          .ms-profile-name,
          .ms-star,
          .ms-eq-bar,
          .ms-send-spinner {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Background stars ── */}
      <div className="ms-stars" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="ms-star"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i * 0.4) % 3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* ── Header ── */}
      <header className="ms-header">
        <div className="ms-header-logo">
          My<span>Space</span>
        </div>
        <nav className="ms-header-nav">
          <a href="#about" onClick={() => trackMyspace('nav_click', { target: 'about' })}>
            Home
          </a>
          <a href="#experience" onClick={() => trackMyspace('nav_click', { target: 'experience' })}>
            Browse
          </a>
          <a href="#comments" onClick={() => trackMyspace('nav_click', { target: 'comments' })}>
            Mail
          </a>
          <a href="#top8" onClick={() => trackMyspace('nav_click', { target: 'top8' })}>
            Friends
          </a>
          <a href="#skills" onClick={() => trackMyspace('nav_click', { target: 'skills' })}>
            Forum
          </a>
        </nav>
        <div style={{ fontSize: '12px', color: '#666666' }}>a place for friends</div>
      </header>

      {/* ── Marquee Banner ── */}
      <div className="ms-marquee" aria-hidden="true">
        <span>
          ★彡 welcome to my profile ★彡 looking for my player 2 ★彡 swipe right on my heart ★彡
          applications open ★彡 must love oreos ★彡 no terfs on my page ★彡 be gay do crime ★彡
        </span>
      </div>

      {/* ── URL Bar (desktop) ── */}
      <div className="ms-url-bar" aria-hidden="true">
        <Lock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{' '}
        <span>https://zachlamb.io/myspace</span>
      </div>

      {/* ── Main Layout ── */}
      <div className="ms-layout" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ms-columns">
          {/* ════ LEFT COLUMN ════ */}
          <div className="ms-col-left">
            {/* Profile Header Card */}
            <div className="ms-profile-header">
              <div className="ms-profile-photo">
                <MyspaceProfileImage />
                <span
                  className="sparkle"
                  style={{ top: '8px', right: '12px', animationDelay: '0s' }}
                />
                <span
                  className="sparkle"
                  style={{ top: '20px', left: '10px', animationDelay: '0.5s' }}
                />
                <span
                  className="sparkle"
                  style={{ bottom: '15px', right: '20px', animationDelay: '1s' }}
                />
              </div>

              <h1 className="ms-profile-name">Snack (Zach)</h1>
              <p className="ms-profile-tagline">&quot;Sweetie Pie &amp; Cutie Pie&quot;</p>

              <div className="ms-online-badge">
                <span className="ms-online-dot" />
                Online Now!
              </div>

              <div className="ms-mood">
                <strong>Mood:</strong> 🏳️‍🌈 Gay
              </div>

              <div className="ms-details">
                <span className="ms-detail-item">
                  <MapPin size={12} /> Denver, CO
                </span>
                <span className="ms-detail-item">
                  <span className="ms-detail-label">Age</span> 32
                </span>
                <span className="ms-detail-item">
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      background:
                        'linear-gradient(180deg, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787)',
                      borderRadius: 2,
                      display: 'inline-block',
                    }}
                  />{' '}
                  Gay
                </span>
              </div>

              {/* Details table */}
              <table className="ms-details-table">
                <tbody>
                  <tr>
                    <td>Status</td>
                    <td>Single (accepting applications)</td>
                  </tr>
                  <tr>
                    <td>Here for</td>
                    <td>Dating, Cuddles, Oreo Reviews</td>
                  </tr>
                  <tr>
                    <td>Zodiac</td>
                    <td>Doesn&apos;t matter, I&apos;ll still be cute</td>
                  </tr>
                  <tr>
                    <td>Bakes</td>
                    <td>Rosemary Brown Butter Rice Crispy Treats</td>
                  </tr>
                  <tr>
                    <td>Drink</td>
                    <td>Right now, cinnamon latte from Convivio</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Contacting Snack ── */}
            <div className="ms-contacting">
              <div className="ms-contacting-header">Contacting Snack</div>
              <div className="ms-contacting-actions">
                <button
                  className={`ms-action-btn ${messageState === 'sending' ? 'is-sending' : ''}`}
                  onClick={handleSendMessage}
                  disabled={messageState === 'sending'}
                  type="button"
                >
                  {messageState === 'sending' ? (
                    <Send size={10} className="ms-send-spinner" />
                  ) : (
                    <Mail size={10} />
                  )}{' '}
                  {messageState === 'sending'
                    ? 'Sending...'
                    : messageState === 'sent'
                      ? 'Send Again'
                      : 'Send Message'}
                </button>
                <button className="ms-action-btn" onClick={handleOpenApplication}>
                  <UserPlus size={10} /> Add to Friends
                </button>
                <button
                  className="ms-action-btn"
                  onClick={() => trackMyspace('add_to_favorites_click')}
                  type="button"
                >
                  <Heart size={10} /> Add to Favorites
                </button>
                <button
                  className="ms-action-btn"
                  onClick={() => trackMyspace('forward_to_friend_click')}
                  type="button"
                >
                  <Share2 size={10} /> Forward to Friend
                </button>
                <button
                  className="ms-action-btn"
                  onClick={() => trackMyspace('send_oreos_click')}
                  type="button"
                >
                  <Gift size={10} /> Send Oreos
                </button>
                <button
                  className="ms-action-btn"
                  onClick={() => trackMyspace('block_user_click')}
                  type="button"
                >
                  <Ban size={10} /> Block User (lol jk)
                </button>
              </div>
              <div className="ms-send-message-feedback" aria-live="polite">
                {messageState === 'sending' ? (
                  <div className="ms-send-message-row">
                    <span>Transmitting your message to Zach...</span>
                  </div>
                ) : messageState === 'sent' ? (
                  <div className="ms-send-message-row is-sent">
                    <span className="ms-send-label">Delivered:</span>
                    <span>{sentMessage}</span>
                  </div>
                ) : (
                  <div className="ms-send-message-row">
                    <span>Click Send Message to deliver a random note.</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Spotify Player ── */}
            <div className="ms-spotify" id="music">
              <SpotifyPlayer />
            </div>

            {/* ── Visitor Counter ── */}
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <div className="ms-visitor-counter">
                <Eye size={12} />
                <span>Profile Views: 004,208</span>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="ms-col-right">
            {/* ── About Me ── */}
            <div className="ms-section" id="about">
              <div className="ms-section-header">
                <Mail size={14} /> About Me
              </div>
              <div className="ms-section-body">
                <p>
                  32 year-old gay man seeking a full-time position. Open to relocation into your
                  heart and hole.
                </p>
              </div>
            </div>

            {/* ── Who I'd Like to Meet ── */}
            <div className="ms-section">
              <div className="ms-section-header">
                <Eye size={14} /> Who I&apos;d Like to Meet
              </div>
              <div className="ms-section-body">
                <p>
                  Someone who laughs at my jokes (even the bad ones), steals my hoodies (I&apos;ll
                  steal yours back), and isn&apos;t afraid to be a complete dork in public. Bonus
                  points if you can keep up on a trail and share your Oreos. Must love pets —
                  non-negotiable.
                </p>
              </div>
            </div>

            {/* ── Interests ── */}
            <div className="ms-section">
              <div className="ms-section-header">
                <Target size={14} /> Interests
              </div>
              <div className="ms-section-body" style={{ padding: 0 }}>
                <table className="ms-interests-table">
                  <tbody>
                    {interests.map((item) => (
                      <tr key={item.label}>
                        <td>{item.label}</td>
                        <td>{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Experience ── */}
            <div className="ms-section" id="experience">
              <div className="ms-section-header">
                <Briefcase size={14} /> Experience
              </div>
              <div className="ms-section-body">
                {experience.map((exp) => (
                  <div key={exp.title} className="ms-exp-item">
                    <div className="ms-exp-title">{exp.title}</div>
                    <div className="ms-exp-place">{exp.place}</div>
                    <div className="ms-exp-desc">{exp.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Skills ── */}
            <div className="ms-section" id="skills">
              <div className="ms-section-header">
                <Heart size={14} /> Skills
              </div>
              <div className="ms-section-body">
                <div
                  style={{
                    fontSize: '11px',
                    color: '#888899',
                    marginBottom: '10px',
                    fontStyle: 'italic',
                  }}
                >
                  Each heart = ~5 years of experience (32 years and counting)
                </div>
                {skills.map((skill) => (
                  <div key={skill.name} className="ms-skill-row">
                    <span className="ms-skill-name">{skill.name}</span>
                    <span className="ms-skill-hearts">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <span
                          key={i}
                          className={`ms-heart ${i >= skill.hearts ? 'ms-heart-empty' : ''}`}
                          style={{ animationDelay: `${i * 0.15}s` }}
                        >
                          <Heart size={14} fill="currentColor" />
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Top 8 ── */}
            <div className="ms-section" id="top8">
              <div className="ms-section-header">
                <Users size={14} /> Snack&apos;s Top 8
              </div>
              <div className="ms-section-body">
                <div className="ms-top8-grid">
                  {topFriends.map((friend, i) => (
                    <div key={friend.name} className="ms-friend">
                      <span
                        className="ms-friend-avatar"
                        style={{ background: friendColors[i % friendColors.length] }}
                      >
                        {friend.initial}
                      </span>
                      <span className="ms-friend-name">{friend.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Education & Certs ── */}
            <div className="ms-section">
              <div className="ms-section-header">
                <GraduationCap size={14} /> Education &amp; Certifications
              </div>
              <div className="ms-section-body">
                <div className="ms-edu-item">
                  <strong>B.A. in Being Adorable</strong> — University of Life, graduated with
                  honors.
                  <br />
                  Minor in Sending Perfect Goodnight Texts and Being Vers
                </div>
                <div style={{ height: '10px' }} />
                <div className="ms-cert-item">
                  Certified Good Hugger (renewed annually). Licensed to make you laugh at
                  inappropriate times.
                </div>
                <div className="ms-cert-item">
                  Certified Oral Specialist: Professional Society of Intimate Arts (passed with
                  distinction). Advanced Rimming Techniques: scored &quot;outstanding&quot; on
                  practical exam; 100% client vocalization/moaning rate.
                </div>
              </div>
            </div>

            {/* ── Comments ── */}
            <div className="ms-section" id="comments">
              <div className="ms-section-header">
                <MessageCircle size={14} /> Comments ({comments.length})
              </div>
              <div className="ms-section-body">
                {comments.map((c) => (
                  <div key={c.name} className="ms-comment">
                    <div
                      className="ms-comment-avatar"
                      style={{
                        background: c.color,
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      {c.initial}
                    </div>
                    <div className="ms-comment-body">
                      <span className="ms-comment-name">{c.name}</span>
                      <span className="ms-comment-time">{c.time}</span>
                      <div className="ms-comment-text">{c.text}</div>
                    </div>
                  </div>
                ))}
                {!showCommentForm ? (
                  <button
                    className="ms-cta"
                    onClick={() => {
                      trackMyspace('leave_comment_click');
                      setShowCommentForm(true);
                    }}
                    style={{ marginTop: '10px' }}
                  >
                    <Mail
                      size={14}
                      style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}
                    />{' '}
                    Leave a Comment
                  </button>
                ) : (
                  <div style={{ marginTop: '10px' }}>
                    <textarea
                      placeholder="say something nice (or spicy)..."
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--ms-border)',
                        borderRadius: '4px',
                        color: '#ffffff',
                        padding: '10px',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                      }}
                    />
                    <button
                      className="ms-cta"
                      onClick={() => {
                        trackMyspace('submit_comment_click');
                        setShowCommentForm(false);
                      }}
                    >
                      <Send
                        size={14}
                        style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}
                      />{' '}
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── References ── */}
            <div className="ms-section">
              <div className="ms-section-header">
                <ClipboardList size={14} /> References
              </div>
              <div className="ms-section-body" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Available upon request.
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="ms-footer">
          <p>&copy; 2026 Snack&apos;s MySpace — A place for cuties</p>
        </footer>
      </div>

      {showApplication && (
        <ApplicationModal
          onClose={handleCloseApplication}
          onSubmitSuccess={() => trackMyspace('application_submit_success')}
          onSubmitError={(error) => trackMyspace('application_submit_error', { error })}
        />
      )}
    </div>
  );
}
