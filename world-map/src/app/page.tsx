'use client';

import AnalogClock from './components/AnalogClock';
import WorldClocks from './components/WorldClocks';

export default function Home() {
  return (
    <main>
      <h1>World Clock</h1>
      <WorldClocks />

      <h2>Analog Clock</h2>
      <AnalogClock />
      
      <button id="theme-toggle">Toggle Theme</button>
    </main>
  );
}
