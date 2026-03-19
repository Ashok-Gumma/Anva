import { useEffect, useRef } from "react";

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

    let targetOffsetX = 0;
    let targetOffsetY = 0;

    const handleMouseMove = (e) => {
        targetOffsetX = (e.clientY / window.innerHeight - 0.5) * 1.5; 
        targetOffsetY = (e.clientX / window.innerWidth - 0.5) * 1.5; 
    };
    window.addEventListener("mousemove", handleMouseMove);

    // The Antigravity colors: vivid blue, purple, pink, orange, yellow
    const colors = ["#2b6cb0", "#6b46c1", "#ed64a6", "#ed8936", "#ecc94b", "#4299e1"];
    const particles = [];
    const numParticles = 800;

    // Distribute points on a sphere
    for (let i = 0; i < numParticles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = Math.random() * 150 + 200; // Thick shell

        particles.push({
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: radius * Math.sin(phi) * Math.sin(theta),
            z: radius * Math.cos(phi),
            color: colors[Math.floor(Math.random() * colors.length)],
            baseSize: Math.random() * 1.5 + 1.5,
            offsetAngle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.01
        });
    }

    let baseAngleX = 0;
    let baseAngleY = 0;
    let mouseOffsetX = 0;
    let mouseOffsetY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Slow continuous global rotation
      baseAngleX += 0.0005;
      baseAngleY += 0.001;

      // Smooth interpolation towards mouse offset
      mouseOffsetX += (targetOffsetX - mouseOffsetX) * 0.05;
      mouseOffsetY += (targetOffsetY - mouseOffsetY) * 0.05;

      const currentAngleX = baseAngleX + mouseOffsetX;
      const currentAngleY = baseAngleY + mouseOffsetY;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      particles.forEach(p => {
          // Extra local wobble
          p.offsetAngle += p.speed;
          const wobble = Math.sin(p.offsetAngle) * 5;

          // Rotate around X
          let y1 = (p.y + wobble) * cosX - p.z * sinX;
          let z1 = (p.y + wobble) * sinX + p.z * cosX;

          // Rotate around Y
          let x2 = p.x * cosY + z1 * sinY;
          let z2 = -p.x * sinY + z1 * cosY;
          let y2 = y1;

          // Perspective projection
          const fov = 1000;
          const scale = fov / (fov + z2 + 300);
          
          const x2d = centerX + x2 * scale * 1.8;
          const y2d = centerY + y2 * scale * 1.8;

          // Draw the dotted particle
          ctx.beginPath();
          // Adding a slight squeeze to make them look like tiny angled dashes
          ctx.ellipse(x2d, y2d, p.baseSize * scale, p.baseSize * scale * 1.5, currentAngleX + currentAngleY, 0, Math.PI * 2);
          
          // Fading the dots based on Z depth to enhance 3D feel
          const depthAlpha = Math.max(0.1, Math.min(0.9, (z2 + 400) / 800));
          ctx.globalAlpha = depthAlpha;
          ctx.fillStyle = p.color;
          ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-multiply"
    />
  );
};

export default ParticleBackground;
