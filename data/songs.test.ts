import songs, { getRandomSong } from './songs';

describe('songs', () => {
  it('should have at least 1 song', () => {
    expect(songs.length).toBeGreaterThanOrEqual(1);
  });

  it('each song should have required fields', () => {
    songs.forEach((song) => {
      expect(song.title).toBeTruthy();
      expect(song.artist).toBeTruthy();
      expect(song.spotifyId).toBeTruthy();
    });
  });

  it('getRandomSong returns a valid song from the list', () => {
    const song = getRandomSong();
    expect(songs).toContainEqual(song);
  });
});
