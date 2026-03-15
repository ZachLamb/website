'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { track } from '@vercel/analytics';
import { Permanent_Marker } from 'next/font/google';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
} from 'lucide-react';
import { getRandomSong } from '@/data/songs';
import ApplicationModal from './ApplicationModal';
import './page.css';
/* MyspaceProfileImage no longer needed — using next/image directly */

const markerFont = Permanent_Marker({ weight: '400', subsets: ['latin'], display: 'swap' });

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
    desc: 'Delivered daily cuteness with zero downtime. Recognized by peers for laugh deployment and smile ROI. Successfully charmed baristas into free extra shots on 2 separate occasions. Created a new process to build and maintain secure attachment.',
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
  {
    label: 'Television',
    value:
      "Severance, Great British Bake Off, Yellowjackets, Heated Rivalry (duh), and Bob's Burgers",
  },
  {
    label: 'Heroes',
    value:
      'Lesbians with rescue cats, my therapist, dogs named "Frank", whoever invented tater tots, my gym coaches, Caleb Hearon, and those freaks who invent new Taco Bell items',
  },
  {
    label: 'Travel',
    value:
      'Half adventure (museums, exploring the city, hiking) and half relaxing (beach, pool, doing absolutely nothing)',
  },
];

/* ─── animation variants ─────────────────────────────────── */

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const, delay },
});

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const friendVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

/* ─── client-only Spotify player (avoids hydration mismatch from Math.random) ── */

function SpotifyPlayerInner() {
  const [song] = useState(() => getRandomSong());
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

      {/* Song info */}
      <div className="ms-player-info">
        <div className="ms-player-song">
          <span className="ms-player-song-title">{song.title}</span>
          <span className="ms-player-song-artist">{song.artist}</span>
        </div>
      </div>

      {/* Spotify embed */}
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
  const prefersReducedMotion = useReducedMotion();
  const [favorited, setFavorited] = useState(false);
  const [oreoCount, setOreoCount] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const sendTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  function trackMyspace(action: string, details: Record<string, string> = {}) {
    track('myspace_interaction', { slug: 'myspace', action, ...details });
  }

  useEffect(() => {
    track('myspace_page_view', { slug: 'myspace', path: '/myspace' });
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
      prefersReducedMotion === true ? 220 : 1100,
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

  function showFeedback(text: string) {
    setFeedbackText(text);
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackText('');
      feedbackTimerRef.current = null;
    }, 4000);
  }

  function handleAddToFavorites() {
    trackMyspace('add_to_favorites_click');
    setFavorited(true);
    showFeedback('Snack has been added to your favorites. You have great taste.');
  }

  async function handleForwardToFriend() {
    trackMyspace('forward_to_friend_click');
    const shareData = {
      title: "Snack's Dating Resume",
      text: "Check out this absolute catch. You're welcome.",
      url: 'https://zachlamb.io/snack',
    };
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        showFeedback("Shared successfully. Snack's reach grows.");
      } catch {
        /* user cancelled share — that's fine */
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        showFeedback('Link copied! Now go paste it to someone cute.');
      } catch {
        showFeedback("Couldn't copy — try sharing zachlamb.io/snack manually.");
      }
    }
  }

  const oreoMessages = [
    'Snack has received 1 Oreo. He is pleased.',
    'Another Oreo! Snack is now hoarding.',
    'Oreo stockpile growing. Snack may never share.',
    'At this rate, Snack will need a bigger pantry.',
    'Oreo overflow detected. Snack is in heaven.',
    "You're spoiling him. He loves it.",
    'Snack just dipped one in milk. This is your doing.',
    "That's a lot of Oreos. Are you proposing?",
  ];

  function handleSendOreos() {
    trackMyspace('send_oreos_click');
    const newCount = oreoCount + 1;
    setOreoCount(newCount);
    const msg = oreoMessages[Math.min(newCount - 1, oreoMessages.length - 1)];
    showFeedback(msg);
  }

  const blockMessages = [
    "Lol no. You can't block Snack. He's too cute.",
    "Denied. Snack is unblockable. It's in the terms of service.",
    'Nice try. Snack has plot armor.',
    'Error 403: Too adorable to block.',
    "You don't have the emotional bandwidth to block this face.",
    "Block request rejected. Snack's cuteness overrides your firewall.",
  ];

  function handleBlockUser() {
    trackMyspace('block_user_click');
    const msg = blockMessages[Math.floor(Math.random() * blockMessages.length)];
    showFeedback(msg);
  }

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="myspace-page"
      style={{ fontFamily: "'Trebuchet MS', Verdana, Arial, sans-serif" }}
    >
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
        <div className={`ms-header-logo ${markerFont.className}`}>
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
      <div className="ms-marquee" aria-label="Profile banner highlights">
        <span>
          ★彡 welcome to my profile ★彡 looking for my player 2 ★彡 swipe right on my heart ★彡
          applications open ★彡 must love oreos ★彡 no terfs on my page ★彡 be gay, do kind things
          ★彡
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
            <motion.div
              className="ms-profile-header"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="ms-profile-photo">
                <Image
                  src="/snack/profile.jpg"
                  alt="Zach"
                  width={360}
                  height={360}
                  priority
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                  }}
                />
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

              <h1 className={`ms-profile-name ${markerFont.className}`}>Snack (Zach)</h1>
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
                    <td>Water Sign</td>
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
            </motion.div>

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
                  className={`ms-action-btn ${favorited ? 'is-sending' : ''}`}
                  onClick={handleAddToFavorites}
                  type="button"
                >
                  <Heart size={10} /> {favorited ? 'Favorited' : 'Add to Favorites'}
                </button>
                <button className="ms-action-btn" onClick={handleForwardToFriend} type="button">
                  <Share2 size={10} /> Forward to Friend
                </button>
                <button className="ms-action-btn" onClick={handleSendOreos} type="button">
                  <Gift size={10} /> Send Oreos{oreoCount > 0 ? ` (${oreoCount})` : ''}
                </button>
                <button className="ms-action-btn" onClick={handleBlockUser} type="button">
                  <Ban size={10} /> Block User (lol jk)
                </button>
              </div>
              <div className="ms-send-message-feedback" aria-live="polite">
                {messageState === 'sending' ? (
                  <div className="ms-send-message-row">
                    <span>Transmitting your message to Zach...</span>
                  </div>
                ) : feedbackText ? (
                  <div className="ms-send-message-row is-sent">
                    <span>{feedbackText}</span>
                  </div>
                ) : messageState === 'sent' ? (
                  <div className="ms-send-message-row is-sent">
                    <span className="ms-send-label">Delivered:</span>
                    <span>{sentMessage}</span>
                  </div>
                ) : (
                  <div className="ms-send-message-row">
                    <span>Click a button to interact with Snack.</span>
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
            <motion.div className="ms-section" id="about" {...fadeInUp(0.1)}>
              <div className="ms-section-header">
                <Mail size={14} /> About Me
              </div>
              <div className="ms-section-body">
                <p>
                  32-year-old gay man seeking a full-time position. Open to relocation into your
                  heart and hole.
                </p>
              </div>
            </motion.div>

            {/* ── Who I'd Like to Meet ── */}
            <motion.div className="ms-section" {...fadeInUp(0.2)}>
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
            </motion.div>

            {/* ── Interests ── */}
            <motion.div className="ms-section" {...fadeInUp(0.3)}>
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
            </motion.div>

            {/* ── Experience ── */}
            <motion.div className="ms-section" id="experience" {...fadeInUp(0.4)}>
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
            </motion.div>

            {/* ── Skills ── */}
            <motion.div className="ms-section" id="skills" {...fadeInUp(0.5)}>
              <div className="ms-section-header">
                <Heart size={14} /> Skills
              </div>
              <div className="ms-section-body">
                <div
                  style={{
                    fontSize: '11px',
                    color: '#777777',
                    marginBottom: '10px',
                    fontStyle: 'italic',
                  }}
                >
                  Each heart = ~5 years of experience (32 years and counting)
                </div>
                {skills.map((skill, skillIdx) => (
                  <motion.div
                    key={skill.name}
                    className="ms-skill-row"
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6 + skillIdx * 0.08,
                      ease: 'easeOut' as const,
                    }}
                  >
                    <span className="ms-skill-name">{skill.name}</span>
                    <span className="ms-skill-hearts">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.span
                          key={i}
                          className={`ms-heart ${i >= skill.hearts ? 'ms-heart-empty' : ''}`}
                          style={{ animationDelay: `${i * 0.15}s` }}
                          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
                          animate={{ opacity: i >= skill.hearts ? 0.2 : 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.8 + skillIdx * 0.08 + i * 0.05,
                            ease: 'backOut' as const,
                          }}
                        >
                          <Heart size={14} fill="currentColor" />
                        </motion.span>
                      ))}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Top 8 ── */}
            <motion.div className="ms-section" id="top8" {...fadeInUp(0.6)}>
              <div className="ms-section-header">
                <Users size={14} /> Snack&apos;s Top 8
              </div>
              <div className="ms-section-body">
                <motion.div
                  className="ms-top8-grid"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  {topFriends.map((friend, i) => (
                    <motion.div
                      key={friend.name}
                      className="ms-friend"
                      variants={friendVariants}
                      whileHover={{ scale: 1.05, borderColor: 'var(--ms-accent)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        className="ms-friend-avatar"
                        style={{ background: friendColors[i % friendColors.length] }}
                      >
                        {friend.initial}
                      </span>
                      <span className="ms-friend-name">{friend.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* ── Education & Certs ── */}
            <motion.div className="ms-section" {...fadeInUp(0.7)}>
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
            </motion.div>

            {/* ── Comments ── */}
            <motion.div className="ms-section" id="comments" {...fadeInUp(0.8)}>
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
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '10px', overflow: 'hidden' }}
                  >
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
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ── References ── */}
            <motion.div className="ms-section" {...fadeInUp(0.9)}>
              <div className="ms-section-header">
                <ClipboardList size={14} /> References
              </div>
              <div className="ms-section-body" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                &quot;He&apos;s so hot.&quot; — Paris Hilton when asked to be my reference
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="ms-footer">
          <p>&copy; 2026 Snack&apos;s MySpace — A place for cuties</p>
        </footer>
      </div>

      <AnimatePresence>
        {showApplication && (
          <ApplicationModal
            onClose={handleCloseApplication}
            onSubmitSuccess={() => trackMyspace('application_submit_success')}
            onSubmitError={(error) => trackMyspace('application_submit_error', { error })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
