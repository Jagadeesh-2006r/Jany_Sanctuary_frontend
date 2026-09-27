import React, { useEffect, useRef } from 'react';

export default function ParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool: mix of soft glowing stars and floating hearts
    const particleCount = 42;
    const particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 2.8 + 1.2;
        this.speedY = Math.random() * 0.45 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.55 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.008;
        this.pulse = Math.random() * Math.PI;
        this.type = Math.random() > 0.65 ? 'heart' : 'star';
        // Warm palette: rose, golden starlight, soft lavender
        const colors = [
          'rgba(244, 114, 182,',  // rose-400
          'rgba(251, 191, 36,',   // amber-400
          'rgba(249, 168, 212,',  // pink-300
          'rgba(216, 180, 254,',  // purple-300
          'rgba(255, 255, 255,',  // pure starlight
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.pulse) * 0.25;
        this.pulse += this.pulseSpeed;

        if (this.y < -30 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }

      draw() {
        const currentOpacity = Math.max(0.1, this.opacity + Math.sin(this.pulse) * 0.18);
        ctx.fillStyle = `${this.colorBase}${currentOpacity})`;

        if (this.type === 'heart') {
          const s = this.size * 1.5;
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s, -s * 1.2, -s * 2, s * 0.4, 0, s * 2);
          ctx.bezierCurveTo(s * 2, s * 0.4, s, -s * 1.2, 0, 0);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
