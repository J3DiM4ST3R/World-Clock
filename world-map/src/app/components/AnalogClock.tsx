'use client';

import { useEffect, useRef } from 'react';

export default function AnalogClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = canvas.width / 2;

    const drawClock = () => {
      const now = new Date();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(-Math.PI / 2);

      // Clock face
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text');
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card-bg');
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, radius - 4, 0, Math.PI * 2, true);
      ctx.stroke();

      // Tick marks
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.rotate(Math.PI / 6);
        ctx.moveTo(radius * 0.85, 0);
        ctx.lineTo(radius * 0.95, 0);
        ctx.stroke();
      }

      // Get time
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hour = now.getHours();

      // Hour hand
      ctx.save();
      ctx.rotate(((hour % 12) + min / 60) * Math.PI / 6);
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(radius * 0.5, 0);
      ctx.stroke();
      ctx.restore();

      // Minute hand
      ctx.save();
      ctx.rotate((min + sec / 60) * Math.PI / 30);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(radius * 0.7, 0);
      ctx.stroke();
      ctx.restore();

      // Second hand
      ctx.save();
      ctx.strokeStyle = 'red';
      ctx.rotate(sec * Math.PI / 30);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(radius * 0.8, 0);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    drawClock();
    const interval = setInterval(drawClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} width={250} height={250} />;
}
