"use client";

import { useState, memo } from 'react';

interface YouTubePlayerProps {
  videoId: string;
}

const YouTubePlayer = memo(({ videoId }: YouTubePlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Parameters to optimize for a background video
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    loop: '1',
    playlist: videoId, // Required for looping
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    showinfo: '0',
    iv_load_policy: '3',
    fs: '0',
    disablekb: '1',
  }).toString();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black">
      <div 
        className={`relative w-full h-full transition-opacity duration-[3000ms] ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?${params}`}
          className="absolute top-1/2 left-1/2 w-[110vw] h-[110vh] -translate-x-1/2 -translate-y-1/2 object-cover scale-[1.05]"
          allow="autoplay; encrypted-media"
          onLoad={() => setIsLoaded(true)}
          title="Background Video"
        />
        {/* Subtle Overlay to enhance text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </div>
  );
});

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
