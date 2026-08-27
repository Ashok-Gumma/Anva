import { useEffect, useRef } from "react";

/**
 * Interactive Constellation & Plexus Particle Background
 * Balanced: Crisp glowing nodes & connecting lines, with subtle, non-intrusive cursor interaction.
 */
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    // Mouse Tracking & State
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 140,
      isHovered: false,
      ripples: [],
    };

    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let mouseVx = 0;
    let mouseVy = 0;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
      mouseVx = e.clientX - prevMouseX;
      mouseVy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isHovered = false;
    };

    const handleClick = (e) => {
      mouse.ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 160,
        opacity: 0.5,
        speed: 4.2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);

    // Curated Vivid Brand Color Palette for Dots & Lines
    const colorPalette = [
      { r: 37, g: 99, b: 235, hex: "#2563eb" },   // Blue 600
      { r: 99, g: 102, b: 241, hex: "#6366f1" },  // Indigo 500
      { r: 139, g: 92, b: 246, hex: "#8b5cf6" },  // Violet 500
      { r: 6, g: 182, b: 212, hex: "#06b6d4" },   // Cyan 500
      { r: 236, g: 72, b: 153, hex: "#ec4899" },  // Pink 500
      { r: 16, g: 185, b: 129, hex: "#10b981" },  // Emerald 500
      { r: 245, g: 158, b: 11, hex: "#f59e0b" },  // Amber 500
    ];

    // Responsive node count
    const calculateParticleCount = () => {
      const area = width * height;
      const count = Math.floor(area / 13500);
      return Math.max(50, Math.min(count, 95));
    };

    let particles = [];

    const createParticle = () => {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        color: color,
        baseSize: Math.random() * 1.6 + 1.2,
        size: 0,
        baseAlpha: Math.random() * 0.35 + 0.45,
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        dispX: 0,
        dispY: 0,
      };
    };

    const initParticles = () => {
      const count = calculateParticleCount();
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    initParticles();

    let resizeTimeout;
    const handleDebouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initParticles();
      }, 250);
    };
    window.addEventListener("resize", handleDebouncedResize);

    const maxConnectionDist = 120;
    const maxConnectionDistSq = maxConnectionDist * maxConnectionDist;
    const cursorMaxDistSq = mouse.radius * mouse.radius;

    // Render Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.16;
      mouse.y += (mouse.targetY - mouse.y) * 0.16;

      // ── 1. Soft Subtle Cursor Spotlight (Low Opacity, Non-Intrusive) ──
      if (mouse.isHovered && mouse.x > 0 && mouse.y > 0) {
        const spotlight = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        spotlight.addColorStop(0, "rgba(59, 130, 246, 0.04)");
        spotlight.addColorStop(0.7, "rgba(99, 102, 241, 0.01)");
        spotlight.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 2. Subtle Click Ripple ──
      for (let rIdx = mouse.ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = mouse.ripples[rIdx];
        rip.radius += rip.speed;
        rip.opacity -= 0.016;

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          mouse.ripples.splice(rIdx, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${rip.opacity * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        particles.forEach((p) => {
          const dx = p.x + p.dispX - rip.x;
          const dy = p.y + p.dispY - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - rip.radius) < 22) {
            const force = (1 - Math.abs(dist - rip.radius) / 22) * 6 * rip.opacity;
            const angle = Math.atan2(dy, dx);
            p.dispX += Math.cos(angle) * force;
            p.dispY += Math.sin(angle) * force;
          }
        });
      }

      // ── 3. Update Particle Positions & Physics ──
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        p.pulseAngle += p.pulseSpeed;
        p.size = p.baseSize + Math.sin(p.pulseAngle) * 0.35;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;

        const renderX = p.x + p.dispX;
        const renderY = p.y + p.dispY;

        // Smooth Mouse Repulsion
        if (mouse.isHovered && mouse.x > 0) {
          const dx = renderX - mouse.x;
          const dy = renderY - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < cursorMaxDistSq) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius) * 24;
            const angle = Math.atan2(dy, dx);

            p.dispX += Math.cos(angle) * force * 0.28 + mouseVx * 0.03;
            p.dispY += Math.sin(angle) * force * 0.28 + mouseVy * 0.03;
          }
        }

        p.dispX *= 0.88;
        p.dispY *= 0.88;
      }

      // ── 4. Render Constellation Lines (Between proximate dots) ──
      for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        const p1X = p1.x + p1.dispX;
        const p1Y = p1.y + p1.dispY;

        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const p2X = p2.x + p2.dispX;
          const p2Y = p2.y + p2.dispY;

          const dx = p1X - p2X;
          const dy = p1Y - p2Y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectionDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxConnectionDist) * 0.32;

            ctx.beginPath();
            ctx.moveTo(p1X, p1Y);
            ctx.lineTo(p2X, p2Y);

            const grad = ctx.createLinearGradient(p1X, p1Y, p2X, p2Y);
            grad.addColorStop(
              0,
              `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`
            );
            grad.addColorStop(
              1,
              `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${alpha})`
            );

            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // ── 5. Subtle Magnetic Lines to Mouse (Soft & Delicate) ──
        if (mouse.isHovered && mouse.x > 0) {
          const mdx = p1X - mouse.x;
          const mdy = p1Y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < cursorMaxDistSq) {
            const mDist = Math.sqrt(mDistSq);
            // Soft and delicate line alpha to avoid harsh coloring
            const mAlpha = (1 - mDist / mouse.radius) * 0.25;

            ctx.beginPath();
            ctx.moveTo(p1X, p1Y);
            ctx.lineTo(mouse.x, mouse.y);

            ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${mAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // ── 6. Render Glowing Dots ──
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        const posX = p.x + p.dispX;
        const posY = p.y + p.dispY;

        // Outer soft glow halo
        ctx.beginPath();
        ctx.arc(posX, posY, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.baseAlpha * 0.22})`;
        ctx.fill();

        // Solid core dot
        ctx.beginPath();
        ctx.arc(posX, posY, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.baseAlpha + 0.2})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", handleDebouncedResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
};

export default ParticleBackground;
