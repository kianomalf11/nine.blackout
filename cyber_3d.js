/**
 * 3D Holographic Wireframe Cyber Core & Rotating Orbital Rings
 * Pure HTML5 Canvas 3D Projection Matrix (No external libraries, 60 FPS)
 * Rotates dynamically based on vertical scroll position and user interaction
 */

class CyberCore3D {
  constructor(canvasId, scrollContainerId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.scrollContainer = document.getElementById(scrollContainerId) || window;

    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;

    // 3D Angles & Scroll Momentum
    this.rotX = 0.3;
    this.rotY = 0;
    this.rotZ = 0;
    this.scrollRotation = 0;
    this.targetScrollRotation = 0;
    this.coreColor = { r: 0, g: 240, b: 255 }; // Cyan default
    this.targetColor = { r: 0, g: 240, b: 255 };

    // Vertices for 3D Icosahedron (Cyber Core)
    this.vertices = [];
    this.edges = [];
    this.particles = [];
    this.rings = [];

    this.initGeometry();
    this.initParticles();
    this.resize();

    window.addEventListener('resize', () => this.resize());
    this.bindScroll();
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent.offsetWidth || 440;
    this.height = this.canvas.height = parent.offsetHeight || 800;
    this.centerX = this.width / 2;
    this.centerY = this.height * 0.42; // slightly elevated for good composition
  }

  initGeometry() {
    // Golden ratio for icosahedron
    const phi = (1 + Math.sqrt(5)) / 2;
    const s = 70; // radius scale

    const rawVertices = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];

    this.vertices = rawVertices.map(v => ({
      x: v[0] * s,
      y: v[1] * s,
      z: v[2] * s
    }));

    // Connected edges
    this.edges = [
      [0,11],[0,5],[0,1],[0,7],[0,10],
      [1,5],[1,9],[1,8],[1,7],
      [2,11],[2,10],[2,6],[2,3],[2,4],
      [3,4],[3,9],[3,8],[3,6],
      [4,11],[4,5],[4,9],
      [5,9],
      [6,10],[6,7],[6,8],
      [7,10],[7,8],
      [8,9],
      [10,11]
    ];

    // Orbital Rings
    this.rings = [
      { radius: 125, tiltX: 0.6, tiltZ: 0.4, speed: 0.015, points: 36 },
      { radius: 155, tiltX: -0.4, tiltZ: -0.5, speed: -0.01, points: 42 }
    ];
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 320,
        y: (Math.random() - 0.5) * 500,
        z: (Math.random() - 0.5) * 320,
        size: Math.random() * 2 + 1,
        speedY: (Math.random() - 0.5) * 0.4
      });
    }
  }

  bindScroll() {
    let lastScrollTop = 0;
    const target = this.scrollContainer;

    const onScroll = () => {
      const st = target.scrollTop || window.scrollY || 0;
      const delta = st - lastScrollTop;
      lastScrollTop = st;

      // Add angular velocity based on scroll
      this.targetScrollRotation += delta * 0.008;

      // Calculate overall scroll progress (0 to 1)
      const maxScroll = (target.scrollHeight || document.documentElement.scrollHeight) - (target.clientHeight || window.innerHeight);
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, st / maxScroll)) : 0;

      // Dynamically morph color palette based on chapter scroll depth:
      // Ch 1-3: Cyber Cyan (#00f0ff)
      // Ch 4: Cyber Danger Crimson (#ff3366)
      // Ch 5: Cyber Emerald (#10b981)
      // Ch 6-7: Electric Violet / Cyan (#9d4edd -> #00f0ff)
      if (progress < 0.4) {
        this.targetColor = { r: 0, g: 240, b: 255 }; // Cyan
      } else if (progress >= 0.4 && progress < 0.6) {
        this.targetColor = { r: 255, g: 51, b: 102 }; // Crimson Warning
      } else if (progress >= 0.6 && progress < 0.8) {
        this.targetColor = { r: 16, g: 185, b: 129 }; // Emerald Ethics
      } else {
        this.targetColor = { r: 157, g: 78, b: 221 }; // Purple Future & Memories
      }
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  project(p, rotX, rotY, rotZ) {
    // 3D Rotation matrices
    // Rot Y
    let x1 = p.x * Math.cos(rotY) + p.z * Math.sin(rotY);
    let y1 = p.y;
    let z1 = -p.x * Math.sin(rotY) + p.z * Math.cos(rotY);

    // Rot X
    let x2 = x1;
    let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
    let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);

    // Rot Z
    let x3 = x2 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
    let y3 = x2 * Math.sin(rotZ) + y2 * Math.cos(rotZ);
    let z3 = z2;

    // Perspective projection
    const fov = 340;
    const distance = 420;
    const scale = fov / (distance + z3);

    return {
      x: this.centerX + x3 * scale,
      y: this.centerY + y3 * scale,
      z: z3,
      scale: scale
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth scroll interpolation
    this.scrollRotation += (this.targetScrollRotation - this.scrollRotation) * 0.08;
    this.rotY += 0.006 + (this.targetScrollRotation - this.scrollRotation) * 0.05;
    this.rotX = 0.25 + Math.sin(this.rotY * 0.5) * 0.15;

    // Smooth color interpolation
    this.coreColor.r += (this.targetColor.r - this.coreColor.r) * 0.06;
    this.coreColor.g += (this.targetColor.g - this.coreColor.g) * 0.06;
    this.coreColor.b += (this.targetColor.b - this.coreColor.b) * 0.06;

    const r = Math.round(this.coreColor.r);
    const g = Math.round(this.coreColor.g);
    const b = Math.round(this.coreColor.b);

    // 1. Draw floating 3D dust particles
    this.particles.forEach(p => {
      p.y += p.speedY;
      if (p.y > 250) p.y = -250;
      if (p.y < -250) p.y = 250;

      const proj = this.project(p, this.rotX * 0.5, this.rotY * 0.8, 0);
      if (proj.scale > 0) {
        this.ctx.beginPath();
        this.ctx.arc(proj.x, proj.y, Math.max(0.5, p.size * proj.scale), 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.35 * proj.scale})`;
        this.ctx.fill();
      }
    });

    // 2. Draw 3D Orbital Rings
    this.rings.forEach((ring, idx) => {
      const ringAngle = this.rotY * (idx === 0 ? 1.4 : -1.1);
      this.ctx.beginPath();
      let first = true;

      for (let i = 0; i <= ring.points; i++) {
        const theta = (i / ring.points) * Math.PI * 2;
        const rx = Math.cos(theta) * ring.radius;
        const rz = Math.sin(theta) * ring.radius;
        const ry = 0;

        const proj = this.project(
          { x: rx, y: ry, z: rz },
          this.rotX + ring.tiltX,
          ringAngle,
          ring.tiltZ
        );

        if (first) {
          this.ctx.moveTo(proj.x, proj.y);
          first = false;
        } else {
          this.ctx.lineTo(proj.x, proj.y);
        }
      }

      this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.18)`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });

    // 3. Project & Draw Core Vertices and Wireframe Edges
    const projected = this.vertices.map(v => this.project(v, this.rotX, this.rotY, 0));

    // Draw Edges
    this.edges.forEach(edge => {
      const p1 = projected[edge[0]];
      const p2 = projected[edge[1]];

      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0.08, Math.min(0.7, (avgZ + 120) / 240));

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();
    });

    // Draw Vertices (Glowing Nodes)
    projected.forEach(p => {
      const alpha = Math.max(0.15, Math.min(0.9, (p.z + 120) / 240));
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(1.5, 3 * p.scale), 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    requestAnimationFrame(() => this.animate());
  }
}

window.CyberCore3D = CyberCore3D;
