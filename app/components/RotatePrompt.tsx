'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const RotatePromptContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.95)),
    url('/wall-texture.jpg');
  background-size: cover;
  background-position: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
`;

const RotateIcon = styled(motion.div)`
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: rotateAnimation 2s ease-in-out infinite;

  @keyframes rotateAnimation {
    0%, 100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(90deg);
    }
  }
`;

const RotateTitle = styled.h1`
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: #ff3333;
  text-align: center;
  margin: 0 0 1rem 0;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.8),
    0 0 10px rgba(255, 0, 0, 0.6),
    0 0 20px rgba(255, 0, 0, 0.4);
  animation: textFlicker 3s infinite;

  @keyframes textFlicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
      text-shadow:
        0 0 8px rgba(255, 0, 0, 0.8),
        0 0 15px rgba(255, 0, 0, 0.6),
        0 0 25px rgba(255, 0, 0, 0.4);
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.8;
      text-shadow:
        0 0 5px rgba(255, 0, 0, 0.6),
        0 0 10px rgba(255, 0, 0, 0.4);
    }
  }
`;

const RotateSubtext = styled.p`
  font-family: 'Covered By Your Grace', cursive;
  font-size: 1.5rem;
  color: #ff8888;
  text-align: center;
  margin: 0;
  letter-spacing: 2px;
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.5),
    0 0 10px rgba(255, 0, 0, 0.3);
`;

const PhoneIcon = styled.div`
  font-size: 4rem;
  color: #ff3333;
  margin-top: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.6));
`;

export default function RotatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const checkOrientation = () => {
      // Only show on mobile devices in portrait mode
      const isMobile = window.innerWidth <= 1024;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowPrompt(isMobile && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Don't render anything during SSR or if not showing prompt
  if (!isMounted || !showPrompt) {
    return null;
  }

  return (
    <RotatePromptContainer>
      <RotateIcon
        animate={{
          rotate: [0, 90, 90, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        📱
      </RotateIcon>
      <PhoneIcon>🔄</PhoneIcon>
      <RotateTitle>Rotate Your Device</RotateTitle>
      <RotateSubtext>
        Please rotate your device to landscape mode
      </RotateSubtext>
      <RotateSubtext style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        for the best experience from the Upside Down
      </RotateSubtext>
    </RotatePromptContainer>
  );
}

