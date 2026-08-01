import { useEffect, useRef } from "react";

/**
 * Full-Page Interactive Particle Background
 * Uniformly distributed across 100% of the screen width and height with
 * real-time cursor repulsion physics, screen wrap-around, and organic floating motion.
 */
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Mouse tracking & physics state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      radius: 180
    };

    let prevMouseX = -1000;
    let prevMouseY = -1000;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.vx = e.clientX - prevMouseX;
      mouse.vy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Vivid Antigravity Brand Color Palette
    const colors = [
      "#2563eb", "#3b82f6", "#6366f1", "#8b5cf6", 
      "#ec4899", "#f59e0b", "#06b6d4", "#10b981", "#ed8936"
    ];
    
    // Spread 1100 particles uniformly across full screen width & height
    const numParticles = 1100;
    const particles = [];

    const createParticle = () => {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 1.2 + 1.0,
        alpha: Math.random() * 0.55 + 0.3,
        offsetAngle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        dispX: 0,
        dispY: 0
      };
    };

    for (let i = 0; i < numParticles; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      particles.forEach((p) => {
        // Continuous organic floating drift
        p.offsetAngle += p.speed;
        const driftX = Math.sin(p.offsetAngle) * 0.8;
        const driftY = Math.cos(p.offsetAngle) * 0.8;

        p.x += p.vx + driftX * 0.1;
        p.y += p.vy + driftY * 0.1;

        // Wrap around screen edges so particles continuously cover entire screen
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Compute current screen position with mouse displacement
        let renderX = p.x + p.dispX;
        let renderY = p.y + p.dispY;

        // Mouse Repulsion & Velocity Wave Physics
        const dx = renderX - mouse.x;
        const dy = renderY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && mouse.x > 0) {
          const force = (1 - dist / mouse.radius) * 45;
          const angle = Math.atan2(dy, dx);
          
          p.dispX += Math.cos(angle) * force * 0.4 + mouse.vx * 0.09;
          p.dispY += Math.sin(angle) * force * 0.4 + mouse.vy * 0.09;
        }

        // Spring damping back to original path
        p.dispX *= 0.88;
        p.dispY *= 0.88;

        // Draw particle
        ctx.beginPath();
        const currentSize = p.size + Math.sin(p.offsetAngle) * 0.3;
        ctx.ellipse(renderX, renderY, Math.max(0.7, currentSize), Math.max(0.7, currentSize * 1.2), p.offsetAngle, 0, Math.PI * 2);
        
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-75 w-full h-full"
    />
  );
};

export default ParticleBackground;
