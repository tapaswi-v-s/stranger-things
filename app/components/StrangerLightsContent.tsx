'use client';

import {useRef, useMemo, useState, useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import Letter from './Letter';
import { ShareButton } from './ShareButton';
import { encodeMessage, decodeMessage } from '../utils/urlHelper';

const MessageBox = styled.div`
  flex: 1;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #ff0000;
  border-radius: 8px;
  font-size: 2.5rem;
  text-align: center;
  color: #ff3333;
  letter-spacing: 3px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  box-shadow: 
    0 0 15px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2),
    inset 0 0 15px rgba(255, 0, 0, 0.1);
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.8),
    0 0 10px rgba(255, 0, 0, 0.6),
    0 0 20px rgba(255, 0, 0, 0.4);
  animation: messageFlicker 4s infinite;

  @keyframes messageFlicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
      text-shadow:
        0 0 8px rgba(255, 0, 0, 0.8),
        0 0 15px rgba(255, 0, 0, 0.5),
        0 0 25px rgba(255, 0, 0, 0.3);
      box-shadow: 
        0 0 20px rgba(255, 0, 0, 0.6),
        0 0 40px rgba(255, 0, 0, 0.4),
        inset 0 0 20px rgba(255, 0, 0, 0.15);
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.85;
      text-shadow:
        0 0 5px rgba(255, 0, 0, 0.6),
        0 0 10px rgba(255, 0, 0, 0.3);
      box-shadow: 
        0 0 10px rgba(255, 0, 0, 0.3),
        0 0 20px rgba(255, 0, 0, 0.2),
        inset 0 0 10px rgba(255, 0, 0, 0.1);
    }
  }
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 90%;
  max-width: 900px;
  margin: 2rem auto;
`;

const IconButton = styled.button`
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background: rgba(10, 0, 0, 0.9);
  border: 2px solid #ff0000;
  color: #ff3333;
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 
    0 0 10px rgba(255, 0, 0, 0.4),
    0 0 20px rgba(255, 0, 0, 0.2),
    inset 0 0 10px rgba(255, 0, 0, 0.1);
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.8),
    0 0 10px rgba(255, 0, 0, 0.5);
  animation: buttonFlicker 4s infinite;

  @keyframes buttonFlicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
      text-shadow:
        0 0 8px rgba(255, 0, 0, 0.8),
        0 0 15px rgba(255, 0, 0, 0.5);
      box-shadow: 
        0 0 15px rgba(255, 0, 0, 0.5),
        0 0 30px rgba(255, 0, 0, 0.3),
        inset 0 0 15px rgba(255, 0, 0, 0.15);
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.8;
      text-shadow:
        0 0 5px rgba(255, 0, 0, 0.6),
        0 0 10px rgba(255, 0, 0, 0.3);
      box-shadow: 
        0 0 8px rgba(255, 0, 0, 0.3),
        0 0 15px rgba(255, 0, 0, 0.2),
        inset 0 0 8px rgba(255, 0, 0, 0.1);
    }
  }

  &:hover {
    background: rgba(20, 0, 0, 0.95);
    border-color: #ff3333;
    color: #ff5555;
    box-shadow: 
      0 0 20px rgba(255, 0, 0, 0.6),
      0 0 40px rgba(255, 0, 0, 0.3),
      inset 0 0 15px rgba(255, 0, 0, 0.2);
    text-shadow:
      0 0 8px rgba(255, 0, 0, 1),
      0 0 15px rgba(255, 0, 0, 0.7);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    animation: none;
    box-shadow: none;
  }
`;

const RevealButtonContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const RevealButton = styled.button`
  padding: 2rem 4rem;
  font-size: 3.5rem;
  font-weight: 900;
  font-family: 'Courier New', 'Courier', monospace;
  background: rgba(10, 10, 10, 0.95);
  border: 3px solid #ff0000;
  color: #ff3333;
  cursor: pointer;
  border-radius: 8px;
  letter-spacing: 8px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  animation: slideDown 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), textFlicker 4s infinite;
  box-shadow: 
    0 0 20px rgba(255, 0, 0, 0.6),
    0 0 40px rgba(255, 0, 0, 0.4),
    0 0 60px rgba(255, 0, 0, 0.2),
    inset 0 0 20px rgba(255, 0, 0, 0.1);
  text-shadow:
    0 0 8px rgba(255, 0, 0, 0.8),
    0 0 15px rgba(255, 0, 0, 0.5),
    0 0 25px rgba(255, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 0, 0, 0.1),
      transparent
    );
    animation: shimmer 3s infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 0, 0, 0.1);
    opacity: 0;
    animation: pulse 2s ease-in-out infinite;
  }

  &:hover {
    background: rgba(20, 0, 0, 0.98);
    border-color: #ff4444;
    color: #ff5555;
    box-shadow: 
      0 0 30px rgba(255, 0, 0, 0.8),
      0 0 60px rgba(255, 0, 0, 0.5),
      0 0 90px rgba(255, 0, 0, 0.3),
      inset 0 0 30px rgba(255, 0, 0, 0.2);
    text-shadow:
      0 0 10px rgba(255, 50, 50, 0.9),
      0 0 20px rgba(255, 50, 50, 0.6),
      0 0 35px rgba(255, 50, 50, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  @keyframes slideDown {
    0% {
      transform: translateY(-200vh);
      opacity: 0;
    }
    60% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  @keyframes textFlicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
      text-shadow:
        0 0 8px rgba(255, 0, 0, 0.8),
        0 0 15px rgba(255, 0, 0, 0.5),
        0 0 25px rgba(255, 0, 0, 0.3);
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.7;
      text-shadow:
        0 0 5px rgba(255, 0, 0, 0.6),
        0 0 10px rgba(255, 0, 0, 0.3);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0;
    }
    50% {
      opacity: 0.3;
    }
  }
`;

const RevealSubtext = styled.div`
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-family: 'Courier New', 'Courier', monospace;
  color: #ff8888;
  letter-spacing: 3px;
  text-align: center;
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.5),
    0 0 10px rgba(255, 0, 0, 0.3);
  animation: subtextFlicker 6s infinite;

  @keyframes subtextFlicker {
    0%, 100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    25%, 75% {
      opacity: 0.6;
    }
  }
`;

const WelcomePopupOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.97);
  z-index: 2000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 1s ease-in, visibility 1s ease-in;
`;

const WelcomePopup = styled.div`
  background: rgba(10, 0, 0, 0.95);
  border: 3px solid #ff0000;
  border-radius: 12px;
  padding: 3rem 4rem;
  max-width: 600px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(255, 0, 0, 0.6),
    0 0 60px rgba(255, 0, 0, 0.4),
    inset 0 0 20px rgba(255, 0, 0, 0.1);
  animation: popupFlicker 4s infinite;

  /* Spooky tree branches creeping from top-left */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    height: 250px;
    background-image: 
      linear-gradient(45deg, #1a0000 0%, #1a0000 8px, transparent 8px),
      linear-gradient(55deg, #1a0000 0%, #1a0000 6px, transparent 6px),
      linear-gradient(35deg, #1a0000 0%, #1a0000 5px, transparent 5px),
      linear-gradient(60deg, #0d0000 0%, #0d0000 4px, transparent 4px),
      linear-gradient(40deg, #0d0000 0%, #0d0000 7px, transparent 7px),
      radial-gradient(circle at 20% 20%, #1a0000 0%, #1a0000 15%, transparent 30%);
    background-size: 80px 100px, 60px 120px, 50px 80px, 40px 90px, 70px 110px, 80px 80px;
    background-position: 0 0, 20px 10px, 10px 30px, 30px 20px, 15px 40px, 0 0;
    background-repeat: no-repeat;
    opacity: 0.9;
    pointer-events: none;
    z-index: 1;
    filter: blur(1px);
  }

  /* Spooky tree branches creeping from bottom-right */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 280px;
    height: 280px;
    background-image: 
      linear-gradient(-45deg, #1a0000 0%, #1a0000 9px, transparent 9px),
      linear-gradient(-55deg, #1a0000 0%, #1a0000 7px, transparent 7px),
      linear-gradient(-35deg, #1a0000 0%, #1a0000 6px, transparent 6px),
      linear-gradient(-60deg, #0d0000 0%, #0d0000 5px, transparent 5px),
      linear-gradient(-40deg, #0d0000 0%, #0d0000 8px, transparent 8px),
      linear-gradient(-50deg, #0d0000 0%, #0d0000 4px, transparent 4px),
      radial-gradient(circle at 80% 80%, #1a0000 0%, #1a0000 18%, transparent 35%);
    background-size: 90px 110px, 70px 130px, 60px 90px, 50px 100px, 80px 120px, 45px 85px, 100px 100px;
    background-position: 0 0, 25px 15px, 15px 35px, 35px 25px, 20px 45px, 40px 10px, 0 0;
    background-repeat: no-repeat;
    opacity: 0.9;
    pointer-events: none;
    z-index: 1;
    filter: blur(1px);
  }

  /* Ensure content is above the branches */
  > * {
    position: relative;
    z-index: 2;
  }

  @keyframes popupFlicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
      box-shadow: 
        0 0 40px rgba(255, 0, 0, 0.7),
        0 0 80px rgba(255, 0, 0, 0.5),
        inset 0 0 25px rgba(255, 0, 0, 0.15);
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.9;
      box-shadow: 
        0 0 20px rgba(255, 0, 0, 0.4),
        0 0 40px rgba(255, 0, 0, 0.3),
        inset 0 0 15px rgba(255, 0, 0, 0.1);
    }
  }
`;

const WelcomeTitle = styled.h2`
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ff4444;
  text-align: center;
  margin: 0 0 2rem 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.8),
    0 0 10px rgba(255, 0, 0, 0.6),
    0 0 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
`;

const UpsideDownText = styled.span`
  display: inline-block;
  transform: scaleY(-1);
`;

const Footer = styled.footer`
  position: fixed;
  top: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 0.9rem;
  color: #ff3333;
  z-index: 100;
  text-shadow:
    0 0 3px rgba(255, 0, 0, 0.8),
    0 0 8px rgba(255, 0, 0, 0.5);
  animation: footerFlicker 4s infinite;

  @keyframes footerFlicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.85;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.8rem;
    padding: 0 1rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterLink = styled.a`
  color: #ff3333;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;

  &:hover {
    color: #ff5555;
    border-bottom: 1px solid #ff5555;
    text-shadow:
      0 0 5px rgba(255, 0, 0, 1),
      0 0 10px rgba(255, 0, 0, 0.7);
  }
`;

const VisitorCounter = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '👁️';
    font-size: 1.2rem;
    animation: blink 3s infinite;
  }

  @keyframes blink {
    0%, 49%, 51%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
`;

const WelcomeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const WelcomeListItem = styled.li`
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 1.2rem;
  color: #ff3333;
  margin: 1.5rem 0;
  padding-left: 2rem;
  position: relative;
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.8),
    0 0 10px rgba(255, 0, 0, 0.5);

  &::before {
    content: '💡';
    position: absolute;
    left: 0;
    filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.6));
  }
`;

const WelcomeCloseButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  background: rgba(10, 0, 0, 0.9);
  border: 2px solid #ff0000;
  color: #ff3333;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 15px rgba(255, 0, 0, 0.5),
    0 0 30px rgba(255, 0, 0, 0.3),
    inset 0 0 15px rgba(255, 0, 0, 0.1);
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.8),
    0 0 10px rgba(255, 0, 0, 0.5);
  animation: buttonFlickerAlt 4s infinite;

  @keyframes buttonFlickerAlt {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
      text-shadow:
        0 0 8px rgba(255, 0, 0, 0.8),
        0 0 15px rgba(255, 0, 0, 0.5);
      box-shadow: 
        0 0 20px rgba(255, 0, 0, 0.6),
        0 0 40px rgba(255, 0, 0, 0.4),
        inset 0 0 20px rgba(255, 0, 0, 0.15);
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.85;
      text-shadow:
        0 0 5px rgba(255, 0, 0, 0.6),
        0 0 10px rgba(255, 0, 0, 0.3);
      box-shadow: 
        0 0 10px rgba(255, 0, 0, 0.3),
        0 0 20px rgba(255, 0, 0, 0.2),
        inset 0 0 10px rgba(255, 0, 0, 0.1);
    }
  }

  &:hover {
    background: rgba(20, 0, 0, 0.95);
    border-color: #ff3333;
    color: #ff5555;
    box-shadow: 
      0 0 25px rgba(255, 0, 0, 0.7),
      0 0 50px rgba(255, 0, 0, 0.5),
      inset 0 0 25px rgba(255, 0, 0, 0.2);
    text-shadow:
      0 0 10px rgba(255, 0, 0, 1),
      0 0 20px rgba(255, 0, 0, 0.7);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Split letters into three rows
const letterRows = [
  'ABCDEFGH'.split(''),
  'IJKLMNOPQR'.split(''),
  'STUVWXYZ._'.split('')
];

const colors = [
  '#f4d03f',  // Warm yellow
  '#e74c3c',  // Red
  '#2ecc71',  // Green
  '#3498db',  // Blue
  '#e67e22',  // Orange
  '#9b59b6'   // Purple
];

export default function StrangerLightsContent() {
  const [activeLetters, setActiveLetters] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isObscured, setIsObscured] = useState(false);
  const [playbackCompleted, setPlaybackCompleted] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('stranger-lights-visited');
    if (!hasVisited) {
      // Delay to allow page to load first
      setTimeout(() => {
        setShowWelcomePopup(true);
      }, 500);
    }
  }, []);

  // Track visitor count - only on client side to avoid hydration mismatch
  useEffect(() => {
    // Use setTimeout to avoid cascading renders
    const timer = setTimeout(() => {
      setIsMounted(true);
      const currentCount = Number.parseInt(localStorage.getItem('stranger-lights-visitors') || '0', 10);
      const newCount = currentCount + 1;
      localStorage.setItem('stranger-lights-visitors', newCount.toString());
      setVisitorCount(newCount);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('stranger-lights-visited', 'true');
  };

  // Get message from URL
  const urlMessage = useMemo(() => {
    const encodedMessage = searchParams.get('m');
    return encodedMessage ? decodeMessage(encodedMessage) : null;
  }, [searchParams]);

  // Show reveal button if there's a URL message and it hasn't been revealed yet
  const showRevealButton = urlMessage !== null && !hasRevealed;

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const getDisplayMessage = () => {
    if (isObscured && message) {
      return '*'.repeat(message.length);
    }
    return message;
  };

  const toggleObscured = () => {
    if (!isPlaying) {
      playClickSound();
      setIsObscured(!isObscured);
    }
  };

  const playMessage = async (text: string) => {
    setIsPlaying(true);
    setMessage('');
    setIsObscured(true); // Obscure text during playback
    setPlaybackCompleted(false);
    
    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      playClickSound();
      setActiveLetters([letter]);
      setMessage(prev => prev + letter);
      await new Promise(resolve => setTimeout(resolve, 750)); // Wait between letters
      setActiveLetters([]);
      await new Promise(resolve => setTimeout(resolve, 250)); // Small pause between letters
    }
    
    setIsPlaying(false);
    setPlaybackCompleted(true); // Mark playback as completed
  };

  const handleReveal = () => {
    if (urlMessage && audioRef.current) {
      // Ensure audio is unmuted and ready to play
      audioRef.current.muted = false;
      setHasRevealed(true);
      playMessage(urlMessage);
    }
  };

  const handleLetterClick = (letter: string) => {
    if (isPlaying) return; // Prevent clicking during playback
    
    playClickSound();
    setActiveLetters([letter]);
    setMessage(prev => prev + letter);
    
    setTimeout(() => {
      setActiveLetters([]);
    }, 500);
  };

  const handleShare = async () => {
    try {
      // Generate the URL with the current message
      const encodedMessage = encodeMessage(message);
      const shareUrl = `${window.location.origin}?m=${encodedMessage}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };
  

  const handleClearLast = () => {
    if (!isPlaying && message.length > 0) {
      playClickSound();
      setMessage(prev => {
        const newMessage = prev.slice(0, -1);
        if (newMessage.length === 0) {
          setPlaybackCompleted(false);
          setIsObscured(false);
        }
        return newMessage;
      });
      router.push('/'); // Clear URL params
    }
  };

  const handleClearAll = () => {
    if (!isPlaying && message.length > 0) {
      playClickSound();
      setMessage('');
      setPlaybackCompleted(false);
      setIsObscured(false);
      router.push('/'); // Clear URL params
    }
  };

  return (
    <div className="letter-wall">
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/click.wav" preload="auto"/>
      
      {/* Reveal Button Overlay */}
      {showRevealButton && (
        <RevealButtonContainer>
          <div>
            <RevealButton onClick={handleReveal}>
              🔦 Reveal Message
            </RevealButton>
            <RevealSubtext>
              Someone has sent you a message from the Upside Down...
            </RevealSubtext>
          </div>
        </RevealButtonContainer>
      )}

      {/* Welcome Popup for First Time Visitors */}
      <WelcomePopupOverlay show={showWelcomePopup}>
        <WelcomePopup>
          <WelcomeTitle>Welcome to <UpsideDownText>Upside Down</UpsideDownText></WelcomeTitle>
          <WelcomeList>
            <WelcomeListItem>
              Click letters to spell your message
            </WelcomeListItem>
            <WelcomeListItem>
              Share the URL with friends
            </WelcomeListItem>
            <WelcomeListItem>
              Watch the lights flicker to life
            </WelcomeListItem>
          </WelcomeList>
          <WelcomeCloseButton onClick={handleCloseWelcome}>
            Got it!
          </WelcomeCloseButton>
        </WelcomePopup>
      </WelcomePopupOverlay>
      
      <div className="letter-rows-container">
        {letterRows.map((row, rowIndex) => (
          <div key={rowIndex} className="letter-row">
            
            {row.map((letter, index) => (
              <Letter
                key={letter}
                letter={letter}
                isActive={activeLetters.includes(letter)}
                color={colors[(rowIndex * row.length + index) % colors.length]}
                onClick={() => handleLetterClick(letter)}
              />
            ))}
          </div>
        ))}
      </div>

      <MessageContainer>
        <MessageBox>{getDisplayMessage()}</MessageBox>
        {playbackCompleted && message.length > 0 && (
          <IconButton 
            onClick={toggleObscured} 
            disabled={isPlaying}
            title={isObscured ? "Show message" : "Hide message"}
          >
            {isObscured ? '👁️' : '🙈'}
          </IconButton>
        )}
        <IconButton 
          onClick={handleClearLast} 
          disabled={isPlaying || message.length === 0}
          title="Delete last letter"
        >
          ⌫
        </IconButton>
        <IconButton 
          onClick={handleClearAll} 
          disabled={isPlaying ||message.length === 0}
          title="Clear all"
        >
          ✕
        </IconButton>
        <ShareButton 
            message={message}
            onShare={handleShare}
          />
      </MessageContainer>

      {isMounted && (
        <Footer>
          <FooterSection>
            <VisitorCounter>
              {visitorCount || 0} Trapped Souls
            </VisitorCounter>
          </FooterSection>
          
          <FooterSection>
            Conjured by{' '}
            <FooterLink 
              href="https://www.linkedin.com/in/tapaswi-v-s?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Tapaswi ↗
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterLink 
              href="https://github.com/tapaswi-v-s/stranger-things" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              🔦 Portal to the Code ↗
            </FooterLink>
          </FooterSection>
        </Footer>
      )}
    </div>
  );
}

