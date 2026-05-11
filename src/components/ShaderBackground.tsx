import { useEffect, useRef } from "react";

/**
 * Animated WebGL fragment-shader background.
 * Aurora-style flowing neon plasma. CPU usage is minimal because it draws
 * a single fullscreen triangle. Falls back gracefully if WebGL is unavailable.
 */
export function ShaderBackground({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return;

    const vert = `
      attribute vec2 a;
      void main() { gl_Position = vec4(a, 0.0, 1.0); }
    `;
    const frag = `
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime;
      uniform float uIntensity;

      // 2D simplex-ish noise
      vec2 hash(vec2 p){ p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return -1.0+2.0*fract(sin(p)*43758.5453123); }
      float noise(vec2 p){
        const float K1=0.366025404; const float K2=0.211324865;
        vec2 i=floor(p+(p.x+p.y)*K1);
        vec2 a=p-i+(i.x+i.y)*K2;
        float m=step(a.y,a.x);
        vec2 o=vec2(m,1.0-m);
        vec2 b=a-o+K2; vec2 c=a-1.0+2.0*K2;
        vec3 h=max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);
        vec3 n=h*h*h*h*vec3(dot(a,hash(i)),dot(b,hash(i+o)),dot(c,hash(i+1.0)));
        return dot(n,vec3(70.0));
      }
      float fbm(vec2 p){
        float v=0.0; float a=0.5;
        for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
        return v;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / min(uRes.x, uRes.y);
        float t = uTime * 0.08;

        vec2 q = vec2(fbm(uv + t), fbm(uv - t + 5.2));
        vec2 r = vec2(fbm(uv + q + vec2(1.7,9.2) + t*1.3), fbm(uv + q + vec2(8.3,2.8) - t*1.1));
        float f = fbm(uv + r);

        vec3 cyan    = vec3(0.20, 0.95, 1.00);
        vec3 magenta = vec3(1.00, 0.30, 0.80);
        vec3 violet  = vec3(0.55, 0.30, 1.00);
        vec3 deep    = vec3(0.04, 0.03, 0.10);

        vec3 col = mix(deep, violet, smoothstep(-0.2, 0.5, f));
        col = mix(col, cyan,    smoothstep(0.2, 0.9, length(r)));
        col = mix(col, magenta, smoothstep(0.4, 1.1, length(q)));

        // vignette
        float v = smoothstep(1.2, 0.2, length(uv));
        col *= mix(0.55, 1.0, v);

        // subtle scanline
        col += 0.02 * sin(gl_FragCoord.y * 1.5);

        col *= uIntensity;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");

    let raf = 0;
    let start = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const render = () => {
      resize();
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uIntensity, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background/80" />
    </div>
  );
}
