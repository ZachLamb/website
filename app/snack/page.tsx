'use client';

import { useState } from 'react';

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
    desc: 'Consistently exceeded expectations in thoughtfulness, snack-sharing, and unsolicited forehead kisses. Maintained a 100% approval rating among pets, friends, parents, nieces, and nephews.',
  },
  {
    title: 'Senior Cutie Pie',
    place: 'The Mirror Every Morning',
    desc: 'Delivered daily cuteness with zero downtime. Recognized by peers for laugh deployment and smile ROI. Successfully charmed baristas into free extra shots on 2 separate occasions.',
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
    avatar: '🧸',
    text: 'omg snack ur profile is SO cute!! we should totally hang out sometime 💕',
    time: '2 hours ago',
  },
  {
    name: 'HikingHottie',
    avatar: '🏔️',
    text: "love the resume format lol. also ur music taste? *chef's kiss*",
    time: '5 hours ago',
  },
  {
    name: 'OreoEnthusiast',
    avatar: '🍪',
    text: 'double stuf or regular? this is a dealbreaker question.',
    time: '1 day ago',
  },
  {
    name: 'DenverDaddy',
    avatar: '⛰️',
    text: 'just here to say the hoodie thing is real. i want it back btw.',
    time: '2 days ago',
  },
];

const topFriends = [
  { name: 'Tom', emoji: '👤' },
  { name: 'Celine Dion', emoji: '🎤' },
  { name: 'My Therapist', emoji: '🧠' },
  { name: 'Every Dog', emoji: '🐕' },
  { name: 'Trader Joe', emoji: '🛒' },
  { name: 'Oreo', emoji: '🍪' },
  { name: 'The Trail', emoji: '🥾' },
  { name: 'Your Mom', emoji: '💐' },
];

/* ─── component ─────────────────────────────────────────── */

export default function SnackPage() {
  const [currentSong] = useState({ title: 'My Heart Will Go On', artist: 'Celine Dion' });
  const [playing, setPlaying] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);

  return (
    <div className="myspace-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Trebuchet+MS&display=swap');

        .myspace-page {
          --ms-bg: #003366;
          --ms-profile-bg: #000000;
          --ms-section-bg: #001a33;
          --ms-border: #336699;
          --ms-text: #ffffff;
          --ms-link: #77bbff;
          --ms-link-hover: #ffcc00;
          --ms-accent: #ff66cc;
          --ms-header-bg: #003366;
          --ms-online: #00ff00;

          min-height: 100dvh;
          min-height: 100vh;
          background: var(--ms-bg);
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(102, 0, 153, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 51, 102, 0.3) 0%, transparent 50%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.01) 2px,
              rgba(255, 255, 255, 0.01) 4px
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

        /* ── sparkle keyframes ── */
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

        .sparkle-container {
          position: relative;
          display: inline-block;
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
          background: linear-gradient(180deg, #004488 0%, #002244 100%);
          border-bottom: 2px solid #336699;
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

        /* ── profile card ── */
        .ms-profile {
          max-width: 600px;
          margin: 0 auto;
          padding: 12px;
        }

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
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
          color: #aaaacc;
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
          color: #aaaacc;
        }
        .ms-detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ms-detail-label {
          color: #888899;
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
          background: linear-gradient(90deg, #003366 0%, #004488 100%);
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
          color: #ccccdd;
        }

        /* ── music player ── */
        .ms-player {
          background: linear-gradient(180deg, #111122 0%, #0a0a1a 100%);
          border: 1px solid #333366;
          border-radius: 6px;
          padding: 10px 14px;
          margin: 12px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ms-player-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--ms-accent);
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.15s;
        }
        .ms-player-btn:active {
          transform: scale(0.92);
        }
        .ms-player-info {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        .ms-player-title {
          font-weight: bold;
          font-size: 12px;
          color: #ffffff;
          white-space: nowrap;
        }
        .ms-player-title span {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
        .ms-player-artist {
          font-size: 11px;
          color: #999999;
        }
        .ms-player-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 20px;
          flex-shrink: 0;
        }
        .ms-player-bar {
          width: 3px;
          background: var(--ms-accent);
          border-radius: 1px;
          transition: height 0.3s ease;
        }

        /* ── experience ── */
        .ms-exp-item {
          border-left: 2px solid var(--ms-accent);
          padding-left: 12px;
          margin-bottom: 14px;
          position: relative;
        }
        .ms-exp-item::before {
          content: '💜';
          position: absolute;
          left: -9px;
          top: 0;
          font-size: 14px;
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
          color: #aaaacc;
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
          color: #ccccdd;
        }
        .ms-skill-hearts {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }
        .ms-heart {
          font-size: 14px;
          animation: pulse-heart 2s ease-in-out infinite;
        }
        .ms-heart-empty {
          opacity: 0.25;
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
        .ms-friend:active {
          transform: scale(0.95);
          border-color: var(--ms-accent);
        }
        .ms-friend-avatar {
          font-size: 28px;
          display: block;
          margin-bottom: 4px;
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
          color: #666688;
          font-size: 10px;
          margin-left: 8px;
        }
        .ms-comment-text {
          color: #aaaacc;
          font-size: 12px;
          margin-top: 2px;
        }

        /* ── marquee banner ── */
        .ms-marquee {
          background: linear-gradient(90deg, #330066, #660033, #003366, #330066);
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
          background: linear-gradient(180deg, var(--ms-accent) 0%, #cc3399 100%);
          color: white;
          border: 2px solid #ff88dd;
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
        .ms-cta:active {
          transform: scale(0.97);
        }

        /* ── education / certs ── */
        .ms-edu-item {
          margin-bottom: 10px;
          padding-left: 20px;
          position: relative;
          font-size: 12px;
          color: #ccccdd;
        }
        .ms-edu-item::before {
          content: '🎓';
          position: absolute;
          left: 0;
          top: 0;
        }
        .ms-edu-item strong {
          color: var(--ms-link);
        }

        .ms-cert-item {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
          font-size: 12px;
          color: #ccccdd;
        }
        .ms-cert-item::before {
          content: '✅';
          position: absolute;
          left: 0;
          top: 0;
        }

        /* ── footer ── */
        .ms-footer {
          text-align: center;
          padding: 20px 12px;
          font-size: 11px;
          color: #555577;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ms-footer a {
          color: var(--ms-link);
          text-decoration: none;
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

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .sparkle,
          .ms-online-dot,
          .ms-player-title span,
          .ms-heart,
          .ms-friend-avatar,
          .ms-marquee span,
          .ms-profile-name {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Header ── */}
      <header className="ms-header">
        <div className="ms-header-logo">
          My<span>Space</span>
        </div>
        <div style={{ fontSize: '12px', color: '#aaaacc' }}>
          <span role="img" aria-label="sparkle">
            ✨
          </span>{' '}
          a place for friends
        </div>
      </header>

      {/* ── Marquee Banner ── */}
      <div className="ms-marquee" aria-hidden="true">
        <span>
          ★彡 welcome to my profile ★彡 looking for my player 2 ★彡 swipe right on my heart ★彡
          applications open ★彡 must love oreos ★彡 no terfs on my page ★彡 be gay do crime ★彡
        </span>
      </div>

      {/* ── Profile ── */}
      <div className="ms-profile">
        {/* Profile Header Card */}
        <div className="ms-profile-header">
          <div className="ms-profile-photo">
            <span role="img" aria-label="snack">
              🥾
            </span>
            {/* sparkles */}
            <span className="sparkle" style={{ top: '8px', right: '12px', animationDelay: '0s' }} />
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
            <strong>Mood:</strong> Available for cuddles &amp; compliments 💜
          </div>

          <div className="ms-details">
            <span className="ms-detail-item">
              <span className="ms-detail-label">📍</span> Denver, CO
            </span>
            <span className="ms-detail-item">
              <span className="ms-detail-label">🎂</span> 32
            </span>
            <span className="ms-detail-item">
              <span className="ms-detail-label">🏳️‍🌈</span> Gay
            </span>
            <span className="ms-detail-item">
              <span className="ms-detail-label">📷</span> @gayhiker
            </span>
          </div>
        </div>

        {/* ── Music Player ── */}
        <div className="ms-player" role="region" aria-label="Music player">
          <button
            className="ms-player-btn"
            onClick={() => setPlaying(!playing)}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <div className="ms-player-info">
            <div className="ms-player-title">
              <span>{currentSong.title}</span>
            </div>
            <div className="ms-player-artist">{currentSong.artist}</div>
          </div>
          <div className="ms-player-bars" aria-hidden="true">
            {[12, 18, 8, 16, 10].map((h, i) => (
              <span
                key={i}
                className="ms-player-bar"
                style={{
                  height: playing ? `${h}px` : '3px',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Objective / About Me ── */}
        <div className="ms-section">
          <div className="ms-section-header">
            <span>💌</span> About Me
          </div>
          <div className="ms-section-body">
            <p>
              32 year-old gay man seeking a full-time position. Open to relocation into your heart
              and hole. 💜
            </p>
          </div>
        </div>

        {/* ── Who I'd Like to Meet ── */}
        <div className="ms-section">
          <div className="ms-section-header">
            <span>👀</span> Who I&apos;d Like to Meet
          </div>
          <div className="ms-section-body">
            <p>
              Someone who laughs at my jokes (even the bad ones), steals my hoodies (I&apos;ll steal
              yours back), and isn&apos;t afraid to be a complete dork in public. Bonus points if
              you can keep up on a trail and share your Oreos. Must love dogs — non-negotiable.
            </p>
          </div>
        </div>

        {/* ── Experience ── */}
        <div className="ms-section">
          <div className="ms-section-header">
            <span>💼</span> Experience
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
        <div className="ms-section">
          <div className="ms-section-header">
            <span>💜</span> Skills
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
              Each 💜 = ~5 years of experience (32 years and counting)
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
                      💜
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top 8 ── */}
        <div className="ms-section">
          <div className="ms-section-header">
            <span>👯</span> Snack&apos;s Top 8
          </div>
          <div className="ms-section-body">
            <div className="ms-top8-grid">
              {topFriends.map((friend) => (
                <div key={friend.name} className="ms-friend">
                  <span className="ms-friend-avatar">{friend.emoji}</span>
                  <span className="ms-friend-name">{friend.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Education & Certs ── */}
        <div className="ms-section">
          <div className="ms-section-header">
            <span>🎓</span> Education &amp; Certifications
          </div>
          <div className="ms-section-body">
            <div className="ms-edu-item">
              <strong>B.A. in Being Adorable</strong> — University of Life, graduated with honors.
              <br />
              Minor in Sending Perfect Goodnight Texts and Being Vers
            </div>
            <div style={{ height: '10px' }} />
            <div className="ms-cert-item">
              Certified Good Hugger (renewed annually). Licensed to make you laugh at inappropriate
              times.
            </div>
            <div className="ms-cert-item">
              Certified Oral Specialist: Professional Society of Intimate Arts (passed with
              distinction). Advanced Rimming Techniques: scored &quot;outstanding&quot; on practical
              exam; 100% client vocalization/moaning rate.
            </div>
          </div>
        </div>

        {/* ── Comments ── */}
        <div className="ms-section">
          <div className="ms-section-header">
            <span>💬</span> Comments ({comments.length})
          </div>
          <div className="ms-section-body">
            {comments.map((c) => (
              <div key={c.name} className="ms-comment">
                <div className="ms-comment-avatar">{c.avatar}</div>
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
                onClick={() => setShowCommentForm(true)}
                style={{ marginTop: '10px' }}
              >
                💌 Leave a Comment
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
                <button className="ms-cta" onClick={() => setShowCommentForm(false)}>
                  📨 Submit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── References ── */}
        <div className="ms-section">
          <div className="ms-section-header">
            <span>📋</span> References
          </div>
          <div className="ms-section-body" style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Available upon request. 😏
          </div>
        </div>

        {/* ── Visitor Counter ── */}
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <div className="ms-visitor-counter">
            <span>👁️</span>
            <span>Profile Views: 004,208</span>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="ms-footer">
          <p>&copy; 2026 Snack&apos;s MySpace — A place for cuties</p>
          <p style={{ marginTop: '4px' }}>
            <a href="/">← back to the real website</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
