"use client";

import { useEffect, useRef, memo, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = memo(({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const playVideo = () => {
      video.muted = true;
      video.play().catch((err) => {
        console.warn("Autoplay was prevented. Typically requires user interaction.", err);
      });
    };

    const handlePlaying = () => setIsPlaying(true);
    video.addEventListener('playing', handlePlaying);

    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
        capLevelToPlayerSize: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        playVideo();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', playVideo);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener('loadedmetadata', playVideo);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [src]);

  return (
    <div className="absolute bottom-[10vh] left-0 w-full h-[80vh] pointer-events-none z-0 overflow-hidden">
      <video
        ref={videoRef}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        className={`w-full h-full object-cover transition-opacity duration-[2000ms] ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
