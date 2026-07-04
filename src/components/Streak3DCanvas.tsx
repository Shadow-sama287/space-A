'use client';

import { useEffect, useRef, useState } from 'react';

interface Streak3DCanvasProps {
  streak: number;
  lastActiveDate?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number;
  b: number;
}

export default function Streak3DCanvas({ streak, lastActiveDate }: Streak3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check if user has completed a review session today
  const todayStr = new Date().toISOString().split('T')[0];
  const isActiveToday = lastActiveDate ? lastActiveDate.startsWith(todayStr) : false;
  const isShattered = streak === 0;

  // Determine geometry tier based on streak level
  let geometryName = 'CUBE';
  if (streak >= 30) geometryName = 'QUANTUM GEODESIC';
  else if (streak >= 15) geometryName = 'STAR POLYHEDRON';
  else if (streak >= 7) geometryName = '4D TESSERACT';
  else if (streak >= 4) geometryName = 'ICOSAHEDRON';
  else if (streak >= 1) geometryName = 'OCTAHEDRON';

  // Status badge label and border style
  let statusText = 'ACTIVE';
  if (isShattered) statusText = 'SHATTERED';
  else if (!isActiveToday) statusText = 'DORMANT';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0;
    let angleY = 0;
    let isHovered = false;
    let mouseX = 0;
    let mouseY = 0;

    // Fracture decay animation for Shattered state (1.5 seconds)
    let fractureProgress = isShattered ? 1.0 : 0.0;

    // Random displacement vectors for fracture animation
    const fractureVectors = Array.from({ length: 40 }).map(() => ({
      dx: (Math.random() - 0.5) * 50,
      dy: (Math.random() - 0.5) * 50,
      dz: (Math.random() - 0.5) * 50,
    }));

    // Build vertices and edges depending on streak tier
    const buildGeometry = (): { vertices: Point3D[]; edges: Edge[] } => {
      if (streak >= 30) {
        const vertices: Point3D[] = [];
        const edges: Edge[] = [];
        const latCount = 6;
        const lonCount = 10;
        const radius = 45;

        for (let i = 0; i <= latCount; i++) {
          const theta = (i * Math.PI) / latCount;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);

          for (let j = 0; j < lonCount; j++) {
            const phi = (j * 2 * Math.PI) / lonCount;
            vertices.push({
              x: radius * sinTheta * Math.cos(phi),
              y: radius * cosTheta,
              z: radius * sinTheta * Math.sin(phi),
            });
          }
        }

        for (let i = 0; i < latCount; i++) {
          for (let j = 0; j < lonCount; j++) {
            const current = i * lonCount + j;
            const nextLon = i * lonCount + ((j + 1) % lonCount);
            const nextLat = (i + 1) * lonCount + j;
            edges.push({ a: current, b: nextLon });
            if (i < latCount - 1) edges.push({ a: current, b: nextLat });
          }
        }
        return { vertices, edges };
      }

      if (streak >= 15) {
        const r1 = 50;
        const r2 = 22;
        const vertices: Point3D[] = [
          { x: 0, y: r1, z: 0 }, { x: 0, y: -r1, z: 0 },
          { x: r1, y: 0, z: 0 }, { x: -r1, y: 0, z: 0 },
          { x: 0, y: 0, z: r1 }, { x: 0, y: 0, z: -r1 },
          { x: r2, y: r2, z: r2 }, { x: -r2, y: r2, z: r2 },
          { x: r2, y: -r2, z: r2 }, { x: -r2, y: -r2, z: r2 },
          { x: r2, y: r2, z: -r2 }, { x: -r2, y: r2, z: -r2 },
          { x: r2, y: -r2, z: -r2 }, { x: -r2, y: -r2, z: -r2 },
        ];
        const edges: Edge[] = [];
        for (let i = 0; i < 6; i++) {
          for (let j = 6; j < 14; j++) {
            edges.push({ a: i, b: j });
          }
        }
        return { vertices, edges };
      }

      if (streak >= 7) {
        const s1 = 45;
        const s2 = 25;
        const vertices: Point3D[] = [
          { x: -s1, y: -s1, z: -s1 }, { x: s1, y: -s1, z: -s1 },
          { x: s1, y: s1, z: -s1 }, { x: -s1, y: s1, z: -s1 },
          { x: -s1, y: -s1, z: s1 }, { x: s1, y: -s1, z: s1 },
          { x: s1, y: s1, z: s1 }, { x: -s1, y: s1, z: s1 },
          { x: -s2, y: -s2, z: -s2 }, { x: s2, y: -s2, z: -s2 },
          { x: s2, y: s2, z: -s2 }, { x: -s2, y: s2, z: -s2 },
          { x: -s2, y: -s2, z: s2 }, { x: s2, y: -s2, z: s2 },
          { x: s2, y: s2, z: s2 }, { x: -s2, y: s2, z: s2 },
        ];
        const edges: Edge[] = [
          { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 },
          { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 4 },
          { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 },
          { a: 8, b: 9 }, { a: 9, b: 10 }, { a: 10, b: 11 }, { a: 11, b: 8 },
          { a: 12, b: 13 }, { a: 13, b: 14 }, { a: 14, b: 15 }, { a: 15, b: 12 },
          { a: 8, b: 12 }, { a: 9, b: 13 }, { a: 10, b: 14 }, { a: 11, b: 15 },
          { a: 0, b: 8 }, { a: 1, b: 9 }, { a: 2, b: 10 }, { a: 3, b: 11 },
          { a: 4, b: 12 }, { a: 5, b: 13 }, { a: 6, b: 14 }, { a: 7, b: 15 },
        ];
        return { vertices, edges };
      }

      if (streak >= 4) {
        const phi = (1 + Math.sqrt(5)) / 2;
        const s = 25;
        const vertices: Point3D[] = [
          { x: -s, y: phi * s, z: 0 }, { x: s, y: phi * s, z: 0 },
          { x: -s, y: -phi * s, z: 0 }, { x: s, y: -phi * s, z: 0 },
          { x: 0, y: -s, z: phi * s }, { x: 0, y: s, z: phi * s },
          { x: 0, y: -s, z: -phi * s }, { x: 0, y: s, z: -phi * s },
          { x: phi * s, y: 0, z: -s }, { x: phi * s, y: 0, z: s },
          { x: -phi * s, y: 0, z: -s }, { x: -phi * s, y: 0, z: s },
        ];
        const edges: Edge[] = [
          { a: 0, b: 11 }, { a: 0, b: 5 }, { a: 0, b: 1 }, { a: 0, b: 7 }, { a: 0, b: 10 },
          { a: 1, b: 5 }, { a: 1, b: 9 }, { a: 1, b: 8 }, { a: 1, b: 7 }, { a: 2, b: 10 },
          { a: 2, b: 11 }, { a: 2, b: 4 }, { a: 2, b: 3 }, { a: 2, b: 6 }, { a: 3, b: 9 },
          { a: 3, b: 4 }, { a: 3, b: 8 }, { a: 3, b: 6 }, { a: 4, b: 5 }, { a: 4, b: 9 },
          { a: 5, b: 11 }, { a: 6, b: 7 }, { a: 6, b: 8 }, { a: 7, b: 10 }, { a: 8, b: 9 },
          { a: 10, b: 11 },
        ];
        return { vertices, edges };
      }

      if (streak >= 1) {
        const s = 45;
        const vertices: Point3D[] = [
          { x: 0, y: s, z: 0 }, { x: 0, y: -s, z: 0 },
          { x: s, y: 0, z: 0 }, { x: -s, y: 0, z: 0 },
          { x: 0, y: 0, z: s }, { x: 0, y: 0, z: -s },
        ];
        const edges: Edge[] = [
          { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 },
          { a: 1, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 1, b: 5 },
          { a: 2, b: 4 }, { a: 4, b: 3 }, { a: 3, b: 5 }, { a: 5, b: 2 },
        ];
        return { vertices, edges };
      }

      // Streak 0: Cube
      const s = 35;
      const vertices: Point3D[] = [
        { x: -s, y: -s, z: -s }, { x: s, y: -s, z: -s },
        { x: s, y: s, z: -s }, { x: -s, y: s, z: -s },
        { x: -s, y: -s, z: s }, { x: s, y: -s, z: s },
        { x: s, y: s, z: s }, { x: -s, y: s, z: s },
      ];
      const edges: Edge[] = [
        { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 },
        { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 4 },
        { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 },
      ];
      return { vertices, edges };
    };

    const { vertices, edges } = buildGeometry();

    // Mouse Controls
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.0005;
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.0005;
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const computedColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--border-color')
        .trim() || '#000000';

      // Speed depends on active vs dormant state
      let speed = 0.003; // Dormant slow drift
      if (isActiveToday) {
        speed = isHovered ? 0.03 : 0.015 + Math.min(streak * 0.002, 0.025);
      }

      angleX += isHovered ? mouseY : speed;
      angleY += isHovered ? mouseX : speed * 0.7;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = 160;

      // Fracture decay calculation for Shattered state
      if (fractureProgress > 0) {
        fractureProgress -= 0.015;
        if (fractureProgress < 0) fractureProgress = 0;
      }

      // Project vertices to 2D with fracture offset if active
      const projected = vertices.map((v, idx) => {
        let vx = v.x;
        let vy = v.y;
        let vz = v.z;

        if (fractureProgress > 0) {
          const fVec = fractureVectors[idx % fractureVectors.length];
          vx += fVec.dx * fractureProgress;
          vy += fVec.dy * fractureProgress;
          vz += fVec.dz * fractureProgress;
        }

        // Rotate Y
        let x1 = vx * cosY - vz * sinY;
        let z1 = vx * sinY + vz * cosY;

        // Rotate X
        let y2 = vy * cosX - z1 * sinX;
        let z2 = vy * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + 80);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
        };
      });

      // Line style: Solid for Active Today, Dashed for Dormant or Shattered
      if (isActiveToday) {
        ctx.setLineDash([]);
      } else {
        ctx.setLineDash([4, 4]);
      }

      ctx.lineWidth = 1.8;
      ctx.strokeStyle = computedColor;

      // Draw Edges
      edges.forEach((edge) => {
        const p1 = projected[edge.a];
        const p2 = projected[edge.b];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Reset line dash for vertices
      ctx.setLineDash([]);

      // Draw Vertices
      projected.forEach((p) => {
        ctx.fillStyle = computedColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [streak, isActiveToday, isShattered]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={130}
        height={130}
        style={{
          cursor: 'grab',
          touchAction: 'none',
          opacity: isActiveToday ? 1 : 0.85,
        }}
      />
      
      {/* STATUS BADGE */}
      <div
        style={{
          fontSize: '0.65rem',
          fontFamily: 'monospace',
          fontWeight: 900,
          textTransform: 'uppercase',
          border: isShattered
            ? '2px solid #ff3333'
            : isActiveToday
            ? '2px solid var(--border-color)'
            : '2px dashed var(--border-color)',
          padding: '0.2rem 0.5rem',
          backgroundColor: isShattered
            ? '#fff0f0'
            : isActiveToday
            ? 'var(--text-primary)'
            : 'var(--bg-primary)',
          color: isShattered
            ? '#ff3333'
            : isActiveToday
            ? 'var(--bg-primary)'
            : 'var(--text-primary)',
          marginTop: '-4px',
          boxShadow: isActiveToday ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
        }}
      >
        CORE: {geometryName} [{statusText}]
      </div>
    </div>
  );
}
