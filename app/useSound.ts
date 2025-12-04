import { useRef, useCallback } from 'react';

export const useSound = (soundUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
    }
    
    audioRef.current.currentTime = 0;
    
    // Handle mobile devices
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio playback failed:", error);
      });
    }
  }, [soundUrl]);

  return play;
};
