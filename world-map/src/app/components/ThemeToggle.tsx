'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Apply class on load
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleToggle = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button onClick={handleToggle}>
      Toggle Theme
    </button>
  );
}
