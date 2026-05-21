import { useEffect, useRef } from "react";

/**
 * Premium Interactive Starfield and Cosmic Aurora background.
 * Draws slow-moving mesh gradient blobs and twinkling stars that shift
 * dynamically with cursor movements (3D parallax depth effect).
 * Occasionally spawns shooting stars that zip across the night sky.
 * Uses lightweight HTML5 2D Canvas for maximum cross-device stability and low CPU usage.
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for parallax interaction
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Initialize Stars
    interface Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      depth: number; // For 3D parallax depth (higher depth = closer = moves more)
      twinkleSpeed: number;
      opacity: number;
    }

    const stars: Star[] = [];
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.4,
        speedX: (Math.random() - 0.5) * 0.04,
        speedY: (Math.random() - 0.5) * 0.04,
        depth: Math.random() * 1.5 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        opacity: Math.random(),
      });
    }

    // Initialize Shooting Star
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speedX: number;
      speedY: number;
      active: boolean;
      life: number;
      maxLife: number;
    }

    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speedX: 0,
      speedY: 0,
      active: false,
      life: 0,
      maxLife: 0,
    };

    const triggerShootingStar = () => {
      shootingStar.active = true;
      shootingStar.x = Math.random() * (width * 0.6);
      shootingStar.y = Math.random() * (height * 0.4);
      shootingStar.length = Math.random() * 60 + 30;
      shootingStar.speedX = Math.random() * 10 + 8;
      shootingStar.speedY = Math.random() * 4 + 2;
      shootingStar.maxLife = Math.random() * 25 + 12;
      shootingStar.life = shootingStar.maxLife;
    };

    // Initialize Cosmic Aurora Gradient Blobs (Mesh Gradients)
    interface Blob {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    const blobs: Blob[] = [
      {
        x: width * 0.2,
        y: height * 0.3,
        vx: 0.15,
        vy: 0.1,
        radius: Math.min(width, height) * 0.5,
        color: "rgba(99, 102, 241, 0.12)", // Indigo-500
      },
      {
        x: width * 0.8,
        y: height * 0.7,
        vx: -0.12,
        vy: 0.18,
        radius: Math.min(width, height) * 0.55,
        color: "rgba(20, 184, 166, 0.08)", // Teal-500
      },
      {
        x: width * 0.5,
        y: height * 0.8,
        vx: 0.08,
        vy: -0.15,
        radius: Math.min(width, height) * 0.45,
        color: "rgba(168, 85, 247, 0.09)", // Purple-500
      },
    ];

    // Main Draw/Animation Loop
    const draw = () => {
      // Background base (warm dark charcoal)
      ctx.fillStyle = "#0c0a09"; // stone-950
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Aurora Blobs (Mesh Gradients)
      blobs.forEach((blob) => {
        // Move
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Wall collisions
        if (blob.x - blob.radius < -100 || blob.x + blob.radius > width + 100) blob.vx *= -1;
        if (blob.y - blob.radius < -100 || blob.y + blob.radius > height + 100) blob.vy *= -1;

        // Render radial gradient glow
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, "rgba(12, 10, 9, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Damped smooth mouse interpolation for parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 1b. Interactive mouse-following spotlight glow
      const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 400);
      mouseGrad.addColorStop(0, "rgba(99, 102, 241, 0.05)");
      mouseGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.02)");
      mouseGrad.addColorStop(1, "rgba(12, 10, 9, 0)");

      ctx.fillStyle = mouseGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 400, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Stars
      ctx.fillStyle = "#ffffff";
      stars.forEach((star) => {
        // Twinkle (oscillate opacity)
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.15) {
          star.twinkleSpeed *= -1;
        }

        // Apply mouse-based parallax offset (deeper depth = more motion)
        const parallaxX = (mouse.x - width / 2) * 0.012 * star.depth;
        const parallaxY = (mouse.y - height / 2) * 0.012 * star.depth;

        // Slow background drift
        star.x += star.speedX;
        star.y += star.speedY;

        // Edge wrapping
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 3. Draw Shooting Star
      if (shootingStar.active) {
        shootingStar.x += shootingStar.speedX;
        shootingStar.y += shootingStar.speedY;
        shootingStar.life--;

        if (shootingStar.life <= 0) {
          shootingStar.active = false;
        } else {
          const alpha = shootingStar.life / shootingStar.maxLife;
          const grad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.length,
            shootingStar.y - (shootingStar.length * shootingStar.speedY) / shootingStar.speedX
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - shootingStar.length,
            shootingStar.y - (shootingStar.length * shootingStar.speedY) / shootingStar.speedX
          );
          ctx.stroke();
        }
      } else {
        // Occasional random shooting star
        if (Math.random() < 0.002) {
          triggerShootingStar();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0c0a09]">
      <canvas ref={canvasRef} className="h-full w-full block" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0a09]/70 pointer-events-none" />
    </div>
  );
}
