export interface Song {
  title: string;
  artist: string;
  /** Spotify track ID (the part after /track/ in a Spotify URL) */
  spotifyId: string;
}

const songs: Song[] = [
  {
    title: 'My Heart Will Go On',
    artist: 'Celine Dion',
    spotifyId: '33LC84JgLvK2KuW43MfaNq',
  },
  {
    title: "It's All Coming Back to Me Now",
    artist: 'Celine Dion',
    spotifyId: '3wDFRlraSP43XLnuBLeVAK',
  },
  {
    title: 'I Wanna Dance with Somebody',
    artist: 'Whitney Houston',
    spotifyId: '2tUBqZG2AbRi7Q0BIrVrEj',
  },
  {
    title: 'Dancing Queen',
    artist: 'ABBA',
    spotifyId: '0GjEhVFGZW8afUYGChu3Rr',
  },
  {
    title: 'Born This Way',
    artist: 'Lady Gaga',
    spotifyId: '2KfOVNGlmRga1b2WLAO09H',
  },
  {
    title: 'Edge of Glory',
    artist: 'Lady Gaga',
    spotifyId: '5QO79kh1Ij79ZpKmrvEaA1',
  },
  {
    title: 'Vogue',
    artist: 'Madonna',
    spotifyId: '3PA0kFfRbGBOscaZLIlsaN',
  },
  {
    title: "Don't Stop Me Now",
    artist: 'Queen',
    spotifyId: '7hQJA50XrCWABAu5v6QZ4i',
  },
  {
    title: 'Take Me to Church',
    artist: 'Hozier',
    spotifyId: '1CS7Sd1u5tWkstBhpssyjP',
  },
  {
    title: 'Run Away with Me',
    artist: 'Carly Rae Jepsen',
    spotifyId: '4Ffb4IiDjokLiJTjSCKOUe',
  },
  {
    title: 'Call Me Maybe',
    artist: 'Carly Rae Jepsen',
    spotifyId: '20I6sIOMTCkB6w7qEcGSd6',
  },
  {
    title: 'I Will Always Love You',
    artist: 'Whitney Houston',
    spotifyId: '4eHbdreAnSOrDDsFfc4Fpm',
  },
  {
    title: 'Somebody to Love',
    artist: 'Queen',
    spotifyId: '4rDbp1vnvEhiPnHBwnOl1K',
  },
];

/** Pick a random song (deterministic per page load, changes on refresh). */
export function getRandomSong(): Song {
  return songs[Math.floor(Math.random() * songs.length)];
}

export default songs;
