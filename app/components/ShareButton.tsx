import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const ShareButtonContainer = styled.button`
  background: rgba(10, 0, 0, 0.9);
  border: 2px solid #ff0000;
  color: #ff3333;
  padding: 0.5rem 1.5rem;
  font-family: 'Covered By Your Grace', cursive;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  transition: transform 0.3s ease;
  box-shadow: 
    0 0 10px rgba(255, 0, 0, 0.4),
    0 0 20px rgba(255, 0, 0, 0.2),
    inset 0 0 10px rgba(255, 0, 0, 0.1);
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.8),
    0 0 10px rgba(255, 0, 0, 0.5);
  animation: shareFlicker 4s infinite;

  @media screen and (max-width: 1024px) and (orientation: landscape) {
    padding: 0.4rem 1rem;
    font-size: 1.2rem;
    gap: 0.3rem;
  }

  @media screen and (max-width: 768px) and (orientation: landscape) {
    padding: 0.3rem 0.8rem;
    font-size: 1rem;
    gap: 0.2rem;
  }

  @media screen and (max-width: 480px) and (orientation: landscape) {
    padding: 0.25rem 0.6rem;
    font-size: 0.9rem;
  }

  @keyframes shareFlicker {
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

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    animation: none;
    box-shadow: none;
  }

  svg {
    width: 20px;
    height: 20px;
    filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.6));

    @media screen and (max-width: 1024px) and (orientation: landscape) {
      width: 16px;
      height: 16px;
    }

    @media screen and (max-width: 768px) and (orientation: landscape) {
      width: 14px;
      height: 14px;
    }

    @media screen and (max-width: 480px) and (orientation: landscape) {
      width: 12px;
      height: 12px;
    }
  }
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 0, 0, 0.95);
  border: 2px solid #ff0000;
  color: #ff3333;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-family: 'Covered By Your Grace', cursive;
  box-shadow: 
    0 0 20px rgba(255, 0, 0, 0.5),
    0 0 40px rgba(255, 0, 0, 0.3),
    inset 0 0 15px rgba(255, 0, 0, 0.1);
  text-shadow:
    0 0 5px rgba(255, 0, 0, 0.9),
    0 0 10px rgba(255, 0, 0, 0.6),
    0 0 20px rgba(255, 0, 0, 0.4);
  animation: toastFlicker 4s infinite;

  @media screen and (max-width: 1024px) and (orientation: landscape) {
    bottom: 10px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  @media screen and (max-width: 768px) and (orientation: landscape) {
    bottom: 8px;
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  @media screen and (max-width: 480px) and (orientation: landscape) {
    bottom: 5px;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }

  @keyframes toastFlicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
      text-shadow:
        0 0 8px rgba(255, 0, 0, 0.9),
        0 0 15px rgba(255, 0, 0, 0.7),
        0 0 25px rgba(255, 0, 0, 0.5);
      box-shadow: 
        0 0 30px rgba(255, 0, 0, 0.6),
        0 0 60px rgba(255, 0, 0, 0.4),
        inset 0 0 20px rgba(255, 0, 0, 0.2);
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.85;
      text-shadow:
        0 0 5px rgba(255, 0, 0, 0.7),
        0 0 10px rgba(255, 0, 0, 0.5),
        0 0 15px rgba(255, 0, 0, 0.3);
      box-shadow: 
        0 0 15px rgba(255, 0, 0, 0.4),
        0 0 30px rgba(255, 0, 0, 0.2),
        inset 0 0 10px rgba(255, 0, 0, 0.15);
    }
  }
`;

interface ShareButtonProps {
  message: string;
  onShare: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ message, onShare }) => {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setShowToast(true);
    onShare();
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <ShareButtonContainer onClick={handleShare} disabled={!message}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </ShareButtonContainer>
      
      {showToast && (
        <Toast
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          URL copied to clipboard!
        </Toast>
      )}
    </>
  );
};
