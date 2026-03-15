import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SnackPage from './page';

const { trackMock, getRandomSongMock } = vi.hoisted(() => ({
  trackMock: vi.fn(),
  getRandomSongMock: vi.fn(() => ({
    title: 'Track One',
    artist: 'Artist One',
    spotifyId: 'spotify-track-1',
  })),
}));

vi.mock('@vercel/analytics', () => ({
  track: trackMock,
}));

vi.mock('@/data/songs', () => ({
  getRandomSong: getRandomSongMock,
}));

describe('SnackPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps spotify song stable across unrelated rerenders', async () => {
    render(<SnackPage />);

    await waitFor(() => {
      expect(screen.getByTitle(/now playing/i)).toBeInTheDocument();
    });

    expect(getRandomSongMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /leave a comment/i }));

    expect(getRandomSongMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTitle(/track one by artist one/i)).toBeInTheDocument();
  });
});
