import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Bulb from './Bulb';

interface LetterProps {
  letter: string;
  isActive: boolean;
  color: string;
  onClick: () => void;
}

const LetterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin: 0 1.5rem;
`;

const LetterText = styled.span<{ isActive: boolean; rotation: number }>`
  font-size: 4.5rem;
  color: ${props => props.isActive ? 'var(--spooky-red)' : '#ffffff'};
  text-shadow: ${props => props.isActive ? '0 0 15px var(--spooky-red)' : 'none'};
  transform: rotate(${props => props.rotation}deg);
  transition: color 0.3s ease, text-shadow 0.3s ease;
  font-weight: 300;
  letter-spacing: 2px;
`;


const Letter: React.FC<LetterProps> = ({ letter, isActive, color, onClick }) => {
  // Generate deterministic rotation based on letter's character code
  const rotation = (((letter.codePointAt(0) ?? 0) * 7) % 10) - 5;
  
  return (
    <LetterContainer onClick={onClick}>
      <Bulb isOn={isActive} color={color} />
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <LetterText isActive={isActive} rotation={rotation}>{letter}</LetterText>
      </motion.div>
    </LetterContainer>
  );
};

export default Letter;
