'use client';

import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { ReactNode, useRef, useState } from 'react';
import { Button } from 'src/components/button/button';

export default function AudioCVButton(): ReactNode {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio
        className="hidden"
        onEnded={() => setIsPlaying(false)}
        ref={audioRef}
        src="/audio-cv.m4a"
      />
      <Button onClick={togglePlay} size="lg">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
        {isPlaying ? 'Pausar Audio CV' : 'Escuchar Audio CV'}
      </Button>
    </>
  );
}

