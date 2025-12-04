import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface BulbProps {
  isOn: boolean;
  color: string;
}

const BulbContainer = styled.div<{ color: string }>`
  position: relative;
  width: 30px;
  height: 45px;
  margin-bottom: 15px;
  z-index: 2;
  animation: bulbSway 8s infinite ease-in-out;
  transform-origin: top center;

  @keyframes bulbSway {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(3deg);
    }
    75% {
      transform: rotate(-3deg);
    }
  }

  @media screen and (max-width: 1024px) and (orientation: landscape) {
    width: 20px;
    height: 30px;
    margin-bottom: 10px;
  }

  @media screen and (max-width: 768px) and (orientation: landscape) {
    width: 16px;
    height: 24px;
    margin-bottom: 8px;
  }

  @media screen and (max-width: 480px) and (orientation: landscape) {
    width: 14px;
    height: 20px;
    margin-bottom: 6px;
  }
`;


const BulbBase = styled.div<{ isOn: boolean, color: string }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: ${props => props.isOn ? props.color : '#463E3F'};
  border-radius: 50%;
  box-shadow: ${props => props.isOn ? `0 0 20px ${props.color}` : 'none'};
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 10px;
    background-color: #463E3F;
  }

  @media screen and (max-width: 1024px) and (orientation: landscape) {
    width: 14px;
    height: 14px;

    &::before {
      top: -3px;
      width: 3px;
      height: 7px;
    }
  }

  @media screen and (max-width: 768px) and (orientation: landscape) {
    width: 12px;
    height: 12px;

    &::before {
      top: -3px;
      width: 2px;
      height: 6px;
    }
  }

  @media screen and (max-width: 480px) and (orientation: landscape) {
    width: 10px;
    height: 10px;

    &::before {
      top: -2px;
      width: 2px;
      height: 5px;
    }
  }
`;

const BulbGlass = styled.div<{ isOn: boolean, color: string }>`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 25px;
  background-color: ${props => props.isOn ? `rgba(255, 255, 255, 0.2)` : 'rgba(70, 62, 63, 0.2)'};
  border-radius: 45% 45% 45% 45% / 65% 65% 35% 35%;

  @media screen and (max-width: 1024px) and (orientation: landscape) {
    width: 14px;
    height: 18px;
  }

  @media screen and (max-width: 768px) and (orientation: landscape) {
    width: 12px;
    height: 15px;
  }

  @media screen and (max-width: 480px) and (orientation: landscape) {
    width: 10px;
    height: 12px;
  }
`;

const Bulb: React.FC<BulbProps> = ({ isOn, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0.7 }}
      animate={{ opacity: isOn ? 1 : 0.7 }}
    >
      <BulbContainer color={color}>
        <BulbBase isOn={isOn} color={color} />
        <BulbGlass isOn={isOn} color={color} />
      </BulbContainer>
    </motion.div>
  );
};

export default Bulb;
