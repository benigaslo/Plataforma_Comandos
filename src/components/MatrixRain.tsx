import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  opacity?: number;
  speedMs?: number; // Milliseconds between steps (higher = slower and calmer)
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ opacity = 0.18, speedMs = 75 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Matrix characters (katakana, numbers, symbols)
    const chars = '0123456789ABCDEF$+-*/=%\"\'#&_(),.;:?!\\|{}<>[]^~ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Throttle render speed to prevent dizziness and make it smooth and ambient
      const elapsed = timestamp - lastTime;
      if (elapsed < speedMs) return;
      lastTime = timestamp - (elapsed % speedMs);

      // Translucent black fade to create the trailing rain effect
      ctx.fillStyle = 'rgba(4, 10, 6, 0.09)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Random highlight for leading character
        const isLeader = Math.random() > 0.88;
        if (isLeader) {
          ctx.fillStyle = '#ffffff'; // White spark at the tip of the drop
        } else {
          ctx.fillStyle = '#00ff66'; // Classic Phosphor Matrix green
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top with randomized delay
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speedMs]);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
};
