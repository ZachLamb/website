import { fireEvent, render, screen } from '@testing-library/react';
import { MyspaceImage, MyspaceProfileImage } from './MyspaceProfileImage';

describe('MyspaceProfileImage', () => {
  it('renders the canonical myspace profile image path', () => {
    render(<MyspaceProfileImage />);
    const image = screen.getByRole('img', { name: 'Zach' });
    expect(image).toHaveAttribute('src', '/myspace/profile.jpg');
  });

  it('falls back to themed placeholder when image fails', () => {
    render(<MyspaceProfileImage />);
    const image = screen.getByRole('img', { name: 'Zach' });
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/myspace/fallback-profile.svg');
  });

  it('supports fallback behavior for any myspace image usage', () => {
    render(<MyspaceImage src="/myspace/does-not-exist.jpg" alt="Fallback target" />);
    const image = screen.getByRole('img', { name: 'Fallback target' });
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/myspace/fallback-profile.svg');
  });
});
