'use client';

import { useState } from 'react';

const PRIMARY_PROFILE_IMAGE = '/myspace/profile.jpg';
export const MYSPACE_FALLBACK_IMAGE = '/myspace/fallback-profile.svg';

type MyspaceImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallbackSrc?: string;
};

export function MyspaceImage({
  src,
  fallbackSrc = MYSPACE_FALLBACK_IMAGE,
  ...props
}: MyspaceImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
}

export function MyspaceProfileImage() {
  return (
    <MyspaceImage
      src={PRIMARY_PROFILE_IMAGE}
      alt="Zach"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
      }}
    />
  );
}
