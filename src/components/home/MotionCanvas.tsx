'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  p: number;
}

/**
 * Decorative hero backdrop: drifting node network, scan line and a crane.
 * Ported from the legacy inline script, with three fixes:
 *   - the animation frame is cancelled on unmount (the original leaked one
 *     rAF loop per page view),
 *   - the canvas is sized to the device pixel ratio so it isn't blurry,
 *   - it does not run at all for `prefers-reduced-motion`.
 */
export function MotionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const nodes: Node[] = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      p: Math.random() * Math.PI * 2,
    }));

    const crane = { swing: 0, hookY: 0, hookDir: 1 };
    let scanY = 0;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = 'rgba(56,189,248,0.025)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Scan line
      scanY = (scanY + 0.8) % height;
      const gradient = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      gradient.addColorStop(0, 'rgba(56,189,248,0)');
      gradient.addColorStop(0.5, 'rgba(56,189,248,0.04)');
      gradient.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 40, width, 80);

      // Links between nearby nodes
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        if (!a) continue;
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= 170) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(56,189,248,${(1 - distance / 170) * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Nodes
      for (const node of nodes) {
        node.p += 0.03;
        const glow = Math.sin(node.p) * 0.5 + 0.5;
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r + glow * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${0.12 + glow * 0.2})`;
        ctx.fill();
      }

      // Crane
      const cx = width * 0.78;
      const cy = height * 0.12;
      crane.swing += 0.008;
      crane.hookY += crane.hookDir * 0.3;
      if (crane.hookY > 80 || crane.hookY < 0) crane.hookDir *= -1;

      ctx.save();
      ctx.strokeStyle = 'rgba(56,189,248,0.15)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy + height * 0.32);
      ctx.stroke();

      for (let i = 0; i < 4; i += 1) {
        const y1 = cy + i * height * 0.08;
        const y2 = cy + (i + 1) * height * 0.08;
        ctx.beginPath();
        ctx.moveTo(cx - 11, y1);
        ctx.lineTo(cx + 11, y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 11, y1);
        ctx.lineTo(cx - 11, y2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(cx - width * 0.09, cy);
      ctx.lineTo(cx + width * 0.11, cy);
      ctx.stroke();

      const tx = cx + width * 0.045 + Math.sin(crane.swing) * width * 0.035;
      ctx.fillStyle = 'rgba(56,189,248,0.28)';
      ctx.fillRect(tx - 4, cy - 4, 8, 8);

      ctx.beginPath();
      ctx.moveTo(tx, cy);
      ctx.lineTo(tx, cy + crane.hookY + 55);
      ctx.strokeStyle = 'rgba(56,189,248,0.12)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.fillStyle = 'rgba(56,189,248,0.1)';
      ctx.strokeStyle = 'rgba(56,189,248,0.22)';
      ctx.lineWidth = 1;
      ctx.fillRect(tx - 13, cy + crane.hookY + 50, 26, 17);
      ctx.strokeRect(tx - 13, cy + crane.hookY + 50, 26, 17);
      ctx.restore();

      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="motion-canvas" ref={canvasRef} aria-hidden="true" />;
}
