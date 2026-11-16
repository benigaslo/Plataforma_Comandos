import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  opacity?: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ opacity = 0.22 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Matrix characters (katakana, numbers, latin, symbols)
    const chars = '0123456789ABCDEF$+-*/=%\"\'#&_(),.;:?!\\|{}<>[]^~ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const render = () => {
      // Translucent black fade to create the trailing rain effect
      ctx.fillStyle = 'rgba(4, 10, 6, 0.08)';
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
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
};
