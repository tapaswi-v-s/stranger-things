'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// YouTube video ID for Stranger Things theme
// Using the official Netflix Stranger Things theme
const YOUTUBE_VIDEO_ID = '-RcPZdihrp4'; // Stranger Things Main Theme

// YouTube IFrame API type definitions
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
  seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
  loadVideoById?: (videoId: string | { videoId: string; startSeconds?: number }) => void;
  destroy: () => void;
  getCurrentTime: () => number;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  height: string;
  width: string;
  videoId: string;
  playerVars: {
    autoplay?: number;
    controls: number;
    disablekb: number;
    fs: number;
    modestbranding: number;
    playsinline: number;
    mute?: number;
  };
  events: {
    onReady: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
    onError?: (event: { data: number }) => void;
  };
}

interface YouTubeIFrameAPI {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT: YouTubeIFrameAPI;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface BackgroundMusicHandle {
  play: () => void;
  toggleMute: () => boolean; // Returns new muted state
  isMuted: () => boolean;
}

const BackgroundMusic = forwardRef<BackgroundMusicHandle>((props, ref) => {
  const playerRef = useRef<YTPlayer | null>(null);
  const isInitializedRef = useRef(false);
  const isMutedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      console.log('BackgroundMusic: play() called');
      if (playerRef.current) {
        console.log('BackgroundMusic: Playing existing player');
        try {
          playerRef.current.setVolume(50);
          playerRef.current.playVideo();
        } catch (error) {
          console.error('BackgroundMusic: Error playing:', error);
        }
      } else {
        console.log('BackgroundMusic: Player not ready yet');
      }
    },
    toggleMute: () => {
      console.log('BackgroundMusic: toggleMute() called');
      if (playerRef.current) {
        isMutedRef.current = !isMutedRef.current;
        try {
          if (isMutedRef.current) {
            console.log('BackgroundMusic: Muting');
            playerRef.current.setVolume(0);
          } else {
            console.log('BackgroundMusic: Unmuting and restarting from beginning');
            // Restart from beginning using loadVideoById
            if (playerRef.current.loadVideoById) {
              playerRef.current.loadVideoById({ videoId: YOUTUBE_VIDEO_ID, startSeconds: 0 });
              playerRef.current.setVolume(50);
            } else {
              // Fallback: just unmute and continue playing
              playerRef.current.setVolume(50);
              playerRef.current.playVideo();
            }
          }
        } catch (error) {
          console.error('BackgroundMusic: Error toggling mute:', error);
        }
      }
      return isMutedRef.current;
    },
    isMuted: () => isMutedRef.current,
  }));

  useEffect(() => {
    // Check if this is the first time audio is being played
    const hasPlayedBefore = localStorage.getItem('stranger-lights-music-played');
    const shouldStartMuted = hasPlayedBefore === 'true';
    isMutedRef.current = shouldStartMuted;
    
    console.log('BackgroundMusic: First time?', !shouldStartMuted);

    // Initialize player and autoplay
    const initializePlayer = () => {
      console.log('BackgroundMusic: Initializing player');
      if (globalThis.window?.YT?.Player) {
        console.log('BackgroundMusic: YouTube API is ready');
        createPlayer();
      } else if (globalThis.window !== undefined) {
        console.log('BackgroundMusic: YouTube API not ready, setting up callback');
        // If API isn't ready yet, set up the callback
        globalThis.window.onYouTubeIframeAPIReady = createPlayer;
      }
    };

    const createPlayer = () => {
      if (isInitializedRef.current || globalThis.window === undefined) {
        console.log('BackgroundMusic: Already initialized or no window');
        return;
      }
      
      console.log('BackgroundMusic: Creating YouTube player');
      isInitializedRef.current = true;
      
      try {
        playerRef.current = new globalThis.window.YT.Player('youtube-audio-player', {
          height: '0',
          width: '0',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event: YTPlayerEvent) => {
              console.log('BackgroundMusic: Player is ready');
              // Set volume based on whether this is first time or not
              const volume = isMutedRef.current ? 0 : 50;
              console.log('BackgroundMusic: Setting volume to', volume);
              event.target.setVolume(volume);
              event.target.playVideo();
              
              // Mark as played (for future visits)
              localStorage.setItem('stranger-lights-music-played', 'true');
            },
            onStateChange: (event: YTPlayerEvent) => {
              if (globalThis.window === undefined) return;
              console.log('BackgroundMusic: State changed:', event.data);
              // When video ends, loop it
              if (event.data === globalThis.window.YT.PlayerState.ENDED) {
                console.log('BackgroundMusic: Playback ended, looping...');
                if (event.target.loadVideoById) {
                  // Restart from beginning
                  const volume = isMutedRef.current ? 0 : 50;
                  event.target.loadVideoById({ videoId: YOUTUBE_VIDEO_ID, startSeconds: 0 });
                  event.target.setVolume(volume);
                } else {
                  // Fallback
                  event.target.playVideo();
                }
              }
            },
            onError: (event: { data: number }) => {
              console.error('BackgroundMusic: YouTube player error:', event.data);
              // Error codes: 2 = invalid param, 5 = HTML5 player error, 100 = video not found, 101/150 = embed not allowed
            },
          },
        });
      } catch (error) {
        console.error('BackgroundMusic: Error creating player:', error);
      }
    };

    // Small delay to ensure page has loaded
    const timer = setTimeout(() => {
      initializePlayer();
    }, 1500);

    return () => {
      clearTimeout(timer);
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <div 
      id="youtube-audio-player" 
      style={{ 
        position: 'fixed', 
        top: '-9999px', 
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none'
      }}
    />
  );
});

BackgroundMusic.displayName = 'BackgroundMusic';

export default BackgroundMusic;

