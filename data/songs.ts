export interface Song {
  title: string;
  artist: string;
  /** Spotify track ID (the part after /track/ in a Spotify URL) */
  spotifyId: string;
}

const songs: Song[] = [
  {
    title: 'Still Into You',
    artist: 'Paramore',
    spotifyId: '1yjY7rpaAQvKwpdUliHx0d',
  },
  {
    title: 'Gimme More',
    artist: 'Britney Spears',
    spotifyId: '6ic8OlLUNEATToEFU3xmaH',
  },
  {
    title: 'Girlfriend',
    artist: 'Avril Lavigne',
    spotifyId: '45hOioMDJktr86iKDHC8gr',
  },
  {
    title: 'Only One',
    artist: 'Yellowcard',
    spotifyId: '0gZp88SA5OcujHLDGkxtI3',
  },
  {
    title: 'Run Away with Me',
    artist: 'Carly Rae Jepsen',
    spotifyId: '0FS7B5o3QyvOD8eWjnbLoO',
  },
  {
    title: 'All the Small Things',
    artist: 'Blink-182',
    spotifyId: '2m1hi0nfMR9vdGC8UcrnwU',
  },
];

/** Pick a random song (deterministic per page load, changes on refresh). */
export function getRandomSong(): Song {
  return songs[Math.floor(Math.random() * songs.length)];
}

export default songs;
