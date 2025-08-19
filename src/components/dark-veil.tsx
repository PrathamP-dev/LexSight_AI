'use client';
import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
#ifdef GL_ES
precision lowp float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;
#define iTime uTime
#define iResolution uResolution

float rand(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);}

// Function to create a teal and gold color palette
vec3 theme_palette(float t) {
    vec3 col1 = vec3(0.0, 0.5, 0.5); // Deep Teal
    vec3 col2 = vec3(0.83, 0.64, 0.45); // Pale Gold (accent)
    vec3 col3 = vec3(0.95, 0.98, 1.0); // Lightest shade
    vec3 col4 = vec3(0.1, 0.2, 0.2); // Darkest shade

    t = smoothstep(0.0, 1.0, t);

    if (t < 0.25) {
        return mix(col4, col1, t / 0.25);
    } else if (t < 0.5) {
        return mix(col1, col2, (t - 0.25) / 0.25);
    } else if (t < 0.75) {
        return mix(col2, col3, (t - 0.5) / 0.25);
    } else {
        return mix(col3, col4, (t - 0.75) / 0.25);
    }
}


// Simplified noise function
float noise(vec2 p) {
    return rand(p);
}

// Fractional Brownian Motion for more complex patterns
float fbm(vec2 p) {
    float f = 0.0;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    f += 0.5000 * noise(p); p = m * p;
    f += 0.2500 * noise(p); p = m * p;
    f += 0.1250 * noise(p); p = m * p;
    f += 0.0625 * noise(p); p = m * p;
    return f;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    // Warp space
    p += uWarp * vec2(sin(p.y * 4.0 + uTime * 0.5), cos(p.x * 4.0 + uTime * 0.5)) * 0.1;

    float t = uTime * 0.2;

    // Use fbm to create organic, nebula-like shapes
    float noise_val = fbm(p + t);
    
    // Add another layer of noise for more detail
    noise_val += fbm(p * 2.0 + t) * 0.5;

    // Use the theme palette function to color the noise
    vec3 color = theme_palette(noise_val);

    fragColor = vec4(color, 1.0);
}


void main(){
    vec4 col;
    mainImage(col,gl_FragCoord.xy);
    
    // Original effects
    float scanline_val=sin(gl_FragCoord.y*uScanFreq)*0.5+0.5;
    col.rgb*=1.-(scanline_val*scanline_val)*uScan;
    col.rgb+=(rand(gl_FragCoord.xy+uTime)-0.5)*uNoise;
    gl_FragColor=vec4(clamp(col.rgb,0.0,1.0),1.0);
}
`;

type DarkVeilProps = {
  hueShift?: number,
  noiseIntensity?: number,
  scanlineIntensity?: number,
  speed?: number,
  scanlineFrequency?: number,
  warpAmount?: number,
  resolutionScale?: number,
}

export function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
  resolutionScale = 1,
}: DarkVeilProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if(!ref.current) return;
    const canvas = ref.current;
    const parent = canvas.parentElement;
    if(!parent) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uHueShift: { value: hueShift },
        uNoise: { value: noiseIntensity },
        uScan: { value: scanlineIntensity },
        uScanFreq: { value: scanlineFrequency },
        uWarp: { value: warpAmount },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = parent.clientWidth,
        h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let frame: number;

    const loop = () => {
      program.uniforms.uTime.value =
        ((performance.now() - start) / 1000) * speed;
      program.uniforms.uHueShift.value = hueShift;
      program.uniforms.uNoise.value = noiseIntensity;
      program.uniforms.uScan.value = scanlineIntensity;
      program.uniforms.uScanFreq.value = scanlineFrequency;
      program.uniforms.uWarp.value = warpAmount;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [
    hueShift,
    noiseIntensity,
    scanlineIntensity,
    speed,
    scanlineFrequency,
    warpAmount,
    resolutionScale,
  ]);
  return (
    <canvas
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        display: "block"
      }}
    />
  );
}
