import { Suspense } from 'react';
import StrangerLightsContent from './components/StrangerLightsContent';

export default function Home() {
  return (
    <Suspense fallback={<div className="letter-wall" />}>
      <StrangerLightsContent />
    </Suspense>
  );
}