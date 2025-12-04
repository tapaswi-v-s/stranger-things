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
