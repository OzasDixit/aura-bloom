import { useEffect, useState, useRef } from "react";

/**
 * Premium AAA-Grade Interactive Background featuring:
 * 1. 6 skewed diagonal panels showing the world's most iconic travel locations (Kyoto, Swiss Alps, Paris, Taj Mahal, New York, Santorini).
 * 2. Hover expansion animations and 3D parallax responsive to user's cursor.
 * 3. A highly realistic, modern aerodynamic bullet train segmenting dynamically into connected carriages.
 * 4. Carriage-by-carriage snaking physics curving naturally along the detailed concrete viaduct and steel rails.
 * 5. Velocity-based motion blur and Xenon ice-blue headlights attached to the lead locomotive nose.
 * 6. Twinkling cosmic stars and high-speed diagonal wind streaks.
 */

const SLICES = [
  {
    name: "Kyoto",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    desc: "Bamboo forests & ancient temples"
  },
  {
    name: "Swiss Alps",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    desc: "Snow-covered peaks & valleys"
  },
  {
    name: "Paris",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    desc: "Romantic streets & Eiffel Tower"
  },
  {
    name: "Taj Mahal",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    desc: "Iconic monuments & heritage"
  },
  {
    name: "New York",
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    desc: "Times Square & night skylines"
  },
  {
    name: "Santorini",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    desc: "Blue domes overlooking the sea"
  }
];

const BASE_HEIGHT = 140; // Base height of train carriage in SVG coordinate system

interface Segment {
  src: string;
  aspect: number;
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skewContainerRef = useRef<HTMLDivElement>(null);
  const bulletTrainRef = useRef<SVGGElement>(null);
  const headlightBeamRef = useRef<SVGPolygonElement>(null);
  const headlightGlowRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  const [segments, setSegments] = useState<{
    head: Segment;
    middle: Segment;
    tail: Segment;
  } | null>(null);

  // Mouse coords for interactive parallax
  const [mousePos, setMousePos] = useState({ nx: 0, ny: 0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Dynamically crop the bullet train profile image into 3 segments and key out black pixels
    const img = new Image();
    img.src = "/realistic_bullet_train.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Auto-detect the horizontal train bounding box (ignoring solid black regions)
      let minX = canvas.width;
      let maxX = 0;
      let minY = canvas.height;
      let maxY = 0;
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          
          if (a > 30 && (r > 15 || g > 15 || b > 15)) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      
      // Pad crop area slightly to preserve fine details
      minX = Math.max(0, minX - 4);
      maxX = Math.min(canvas.width, maxX + 4);
      minY = Math.max(0, minY - 4);
      maxY = Math.min(canvas.height, maxY + 4);
      
      const trainW = maxX - minX;
      const trainH = maxY - minY;
      
      if (trainW <= 0 || trainH <= 0) return;
      
      const segW = trainW / 3;
      
      const getSeg = (index: number) => {
        const sCanvas = document.createElement("canvas");
        sCanvas.width = segW;
        sCanvas.height = trainH;
        const sCtx = sCanvas.getContext("2d");
        if (!sCtx) return { src: "", aspect: 1 };
        
        sCtx.drawImage(
          img,
          minX + index * segW,
          minY,
          segW,
          trainH,
          0,
          0,
          segW,
          trainH
        );
        
        // Remove background dark/black pixels
        const sData = sCtx.getImageData(0, 0, segW, trainH);
        const d = sData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          if (r < 18 && g < 18 && b < 18) {
            d[i + 3] = 0; // Alpha = 0
          }
        }
        sCtx.putImageData(sData, 0, 0);
        return {
          src: sCanvas.toDataURL(),
          aspect: segW / trainH
        };
      };
      
      setSegments({
        head: getSeg(0),
        middle: getSeg(1),
        tail: getSeg(2)
      });
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = mouseRef.current;
    mouse.x = width / 2;
    mouse.y = height / 2;
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;

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

    // Initialize Twinkling Stars
    interface Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      depth: number;
      twinkleSpeed: number;
      opacity: number;
    }

    const stars: Star[] = [];
    const numStars = 35;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01,
        depth: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.006 + 0.002,
        opacity: Math.random(),
      });
    }

    // Initialize Wind Streaks (diagonal speed particles)
    interface Streak {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
    }

    const streaks: Streak[] = [];
    const numStreaks = 12;

    for (let i = 0; i < numStreaks; i++) {
      streaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 100 + 40,
        speed: Math.random() * 8 + 5,
        opacity: Math.random() * 0.15 + 0.05,
        width: Math.random() * 0.8 + 0.3,
      });
    }

    const train = {
      progress: 0,
      velocity: 0,
      state: "waiting", // "waiting", "zooming"
      cooldown: 90, // Wait 1.5 seconds initially before starting
      shakeIntensity: 0,
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinate damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const nx = (mouse.x / width) - 0.5;
      const ny = (mouse.y / height) - 0.5;

      setMousePos({ nx, ny });

      const path = pathRef.current;
      const pathLength = path ? path.getTotalLength() : 0;

      // Train physics & connected carriage placement
      if (path && pathLength > 0 && segments) {
        if (train.state === "waiting") {
          train.cooldown--;
          if (train.cooldown <= 0) {
            train.state = "zooming";
            train.progress = 0;
            train.velocity = 0.5;
          }
        } else if (train.state === "zooming") {
          train.velocity += 0.055;
          if (train.velocity > 5.5) train.velocity = 5.5; // cruising velocity in SVG path coordinates

          train.progress += train.velocity;

          const pct = train.progress / pathLength;

          // Estimate spacing dynamically based on middle carriage aspect ratio to keep them connected
          const spacing = BASE_HEIGHT * segments.middle.aspect * 0.85;

          // 4 carriages total: 1 Head, 2 Middle, 1 Tail
          const lastCarProgress = train.progress - 3 * spacing;

          if (lastCarProgress >= pathLength) {
            train.state = "waiting";
            train.cooldown = Math.random() * 180 + 360; // wait 6 to 9 seconds
            train.shakeIntensity = 0;
            
            // Hide train offscreen
            if (bulletTrainRef.current) {
              const cars = bulletTrainRef.current.children;
              for (let i = 0; i < cars.length; i++) {
                (cars[i] as HTMLElement).style.opacity = "0";
              }
            }
          } else {
            const trainGroup = bulletTrainRef.current;
            if (trainGroup) {
              const cars = trainGroup.children;

              for (let i = 0; i < cars.length; i++) {
                const car = cars[i] as SVGGElement;
                const carDist = train.progress - i * spacing;

                if (carDist < 0 || carDist > pathLength) {
                  car.style.opacity = "0";
                  continue;
                }

                car.style.opacity = "1";

                const p1 = path.getPointAtLength(carDist);
                // Get next point to calculate heading angle tangent
                const p2 = path.getPointAtLength(Math.min(carDist + 2, pathLength));
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

                // perspective scaling - carriages grow larger as they move closer to the camera foreground
                const carPct = carDist / pathLength;
                const scale = 0.06 + (carPct * 0.44); // Scale ranges from 0.06 (far background) to 0.50 (foreground)

                // Set car group transforms
                car.setAttribute("transform", `translate(${p1.x}, ${p1.y}) rotate(${angle}) scale(${scale})`);

                // Apply velocity-based motion blur
                const blurAmt = train.velocity * 0.12;
                car.style.filter = `blur(${blurAmt}px)`;
              }
            }

            // Trigger concrete viaduct camera vibration shake when the lead carriage is crossing the center
            if (pct > 0.3 && pct < 0.65) {
              const factor = 1 - (Math.abs(pct - 0.475) / 0.175);
              train.shakeIntensity = factor * 4.5;
            } else {
              train.shakeIntensity = 0;
            }

            // Headlight intensity & glow updates based on speed
            if (headlightBeamRef.current && headlightGlowRef.current) {
              const flareScale = 1 + (train.velocity * 0.02);
              headlightBeamRef.current.setAttribute("transform", `scale(${flareScale}, 1)`);
              headlightBeamRef.current.style.opacity = `${Math.min(0.75 + (train.velocity * 0.02), 1.0)}`;
              headlightGlowRef.current.setAttribute("transform", `scale(${1 + (train.velocity * 0.03)})`);
            }
          }
        }
      }

      // Parallax container shift combined with train screen vibration shake
      const shakeX = (Math.random() - 0.5) * train.shakeIntensity;
      const shakeY = (Math.random() - 0.5) * train.shakeIntensity;

      if (skewContainerRef.current) {
        const rotY = nx * 6 + shakeX * 0.1;
        const rotX = ny * -6 + shakeY * 0.1;
        skewContainerRef.current.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${nx * -25 + shakeX}px, ${ny * -25 + shakeY}px, 0)`;
      }

      // Draw Twinkling Stars
      ctx.fillStyle = "#ffffff";
      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 0.75 || star.opacity < 0.15) {
          star.twinkleSpeed *= -1;
        }

        const parallaxX = (mouse.x - width / 2) * 0.004 * star.depth;
        const parallaxY = (mouse.y - height / 2) * 0.004 * star.depth;

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Wind Streaks
      const speedMultiplier = train.state === "zooming" ? 1.4 : 1.0;
      streaks.forEach((streak) => {
        const dx = -0.9 * streak.speed * speedMultiplier;
        const dy = 0.4 * streak.speed * speedMultiplier;

        streak.x += dx;
        streak.y += dy;

        if (streak.x < -150) {
          streak.x = width + 150;
          streak.y = Math.random() * height - 100;
        }
        if (streak.y > height + 150) {
          streak.y = -150;
          streak.x = Math.random() * width + 100;
        }

        ctx.globalAlpha = streak.opacity * (train.state === "zooming" ? 1.3 : 1.0);
        ctx.lineWidth = streak.width * (train.state === "zooming" ? 1.25 : 1.0);

        const startX = streak.x;
        const startY = streak.y;
        const endX = streak.x + 0.9 * (streak.length * (train.state === "zooming" ? 1.35 : 1.0));
        const endY = streak.y - 0.4 * (streak.length * (train.state === "zooming" ? 1.35 : 1.0));

        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
        grad.addColorStop(0, "rgba(99, 102, 241, 0.4)");  // Indigo
        grad.addColorStop(0.5, "rgba(168, 85, 247, 0.15)"); // Purple
        grad.addColorStop(1, "rgba(20, 184, 166, 0)");      // Fade out

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [segments]);

  const nx = mousePos.nx;
  const ny = mousePos.ny;

  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden bg-[#0a0807] select-none pointer-events-none"
      style={{ perspective: "1200px" }}
    >
      {/* 3D Parallax Scenic Container */}
      <div 
        ref={skewContainerRef} 
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Diagonal Slices showing top travel destinations */}
        <div className="absolute inset-0 flex w-[120%] -left-[10%] h-full transform -skew-x-12 origin-center overflow-hidden pointer-events-auto">
          {SLICES.map((slice, i) => (
            <div
              key={i}
              className="relative h-full flex-1 transition-all duration-700 ease-out hover:flex-[1.5] border-r border-white/10 group overflow-hidden"
            >
              {/* Image with inverse skew to keep horizontal rendering straight, plus parallax translation */}
              <img
                src={slice.url}
                alt={slice.name}
                className="absolute inset-0 w-[140%] h-full object-cover scale-110 origin-center transition-transform duration-1000 ease-out group-hover:scale-125"
                style={{
                  filter: "contrast(1.1) brightness(0.52) saturate(0.8)",
                  transform: `skewX(12deg) scale(1.15) translate3d(${(nx * -35) / (1 + i * 0.05)}px, ${ny * -35}px, 0)`
                }}
              />
              
              {/* High-Contrast Vignette for Overlay readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 opacity-90 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none" />

              {/* Destination card text (straightened by skewX(12deg)) */}
              <div className="absolute bottom-12 left-10 z-20 transform skew-x-12 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                <span className="text-[10px] font-mono font-semibold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 uppercase">
                  Featured Destination
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 font-display">{slice.name}</h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-[200px] leading-relaxed">{slice.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dark Overlay vignette on top of the slices */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(10,8,7,0.85)_85%)] pointer-events-none z-5" />

        {/* SVG viaduct tracks & curving train */}
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        >
          <defs>
            {/* Xenon Ice-Blue Headlight cone gradients */}
            <linearGradient id="headlight-grad" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="glow-grad">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="6" result="blur" />
            </filter>
          </defs>

          {/* Master curved track path spanning from top-right down-left */}
          <path
            ref={pathRef}
            d="M 920 230 C 700 340, 480 620, -100 1000"
            fill="none"
            stroke="none"
          />

          {/* SVG Concrete Viaduct & Tracks Rendering */}
          <g opacity="0.95">
            {/* Viaduct Base Shadow */}
            <path
              d="M 920 230 C 700 340, 480 620, -100 1000"
              fill="none"
              stroke="rgba(0, 0, 0, 0.45)"
              strokeWidth="48"
              strokeLinecap="round"
              filter="url(#glow-filter)"
              transform="translate(10, 15)"
            />

            {/* Concrete Viaduct Base */}
            <path
              d="M 920 230 C 700 340, 480 620, -100 1000"
              fill="none"
              stroke="#2e2a28"
              strokeWidth="36"
              strokeLinecap="round"
            />

            {/* Concrete Deck Top Border */}
            <path
              d="M 920 230 C 700 340, 480 620, -100 1000"
              fill="none"
              stroke="#4a423f"
              strokeWidth="30"
              strokeLinecap="round"
            />

            {/* Ballast Gravel Bed */}
            <path
              d="M 920 230 C 700 340, 480 620, -100 1000"
              fill="none"
              stroke="#1c1917"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Sleepers / Ties */}
            <path
              d="M 920 230 C 700 340, 480 620, -100 1000"
              fill="none"
              stroke="#57534e"
              strokeWidth="18"
              strokeDasharray="2, 6"
            />

            {/* Steel Rails Base */}
            <path
              d="M 920 230 C 700 340, 480 620, -100 1000"
              fill="none"
              stroke="#a8a29e"
              strokeWidth="8"
            />

            {/* Steel Rails Center Mask (leaving two thin parallel lines) */}
            <path
              d="M 920 230 C 700 340, 480 620, -100 1000"
              fill="none"
              stroke="#1c1917"
              strokeWidth="6"
            />
          </g>

          {/* Curved Train Carriage Render Group */}
          {segments && (
            <g ref={bulletTrainRef}>
              {/* Carriage 0: Head */}
              <g className="train-car" data-type="head" style={{ opacity: 0 }}>
                {/* Xenon Ice-Blue Headlight mounted on locomotive nose */}
                <g transform={`translate(${- (BASE_HEIGHT * segments.head.aspect) / 2 + 5}, 12)`}>
                  <polygon
                    ref={headlightBeamRef}
                    points="0,0 -400,-100 -400,100"
                    fill="url(#headlight-grad)"
                    filter="url(#glow-filter)"
                    style={{ transformOrigin: "0px 0px" }}
                  />
                  <circle
                    ref={headlightGlowRef}
                    cx="0"
                    cy="0"
                    r="16"
                    fill="url(#glow-grad)"
                  />
                </g>
                <image 
                  href={segments.head.src} 
                  width={BASE_HEIGHT * segments.head.aspect} 
                  height={BASE_HEIGHT} 
                  x={-(BASE_HEIGHT * segments.head.aspect) / 2} 
                  y={-BASE_HEIGHT / 2}
                />
              </g>

              {/* Carriage 1: Middle */}
              <g className="train-car" data-type="middle" style={{ opacity: 0 }}>
                <image 
                  href={segments.middle.src} 
                  width={BASE_HEIGHT * segments.middle.aspect} 
                  height={BASE_HEIGHT} 
                  x={-(BASE_HEIGHT * segments.middle.aspect) / 2} 
                  y={-BASE_HEIGHT / 2}
                />
              </g>

              {/* Carriage 2: Middle */}
              <g className="train-car" data-type="middle" style={{ opacity: 0 }}>
                <image 
                  href={segments.middle.src} 
                  width={BASE_HEIGHT * segments.middle.aspect} 
                  height={BASE_HEIGHT} 
                  x={-(BASE_HEIGHT * segments.middle.aspect) / 2} 
                  y={-BASE_HEIGHT / 2}
                />
              </g>

              {/* Carriage 3: Tail */}
              <g className="train-car" data-type="tail" style={{ opacity: 0 }}>
                <image 
                  href={segments.tail.src} 
                  width={BASE_HEIGHT * segments.tail.aspect} 
                  height={BASE_HEIGHT} 
                  x={-(BASE_HEIGHT * segments.tail.aspect) / 2} 
                  y={-BASE_HEIGHT / 2}
                />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* 2D overlay Canvas for Stars and Wind Streaks */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block z-20 opacity-75 mix-blend-screen pointer-events-none" />
    </div>
  );
}
