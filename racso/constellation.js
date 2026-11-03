export function constellation(host, canvas, reduced) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  const LINK = 160;
  const MAX_NODES = window.innerWidth < 768 ? 16 : 40;
  let pointer = { x: -1000, y: -1000 };

  function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
  }

  new ResizeObserver(() => {
      resize();
      initNodes();
  }).observe(host);
  resize();

  function initNodes() {
      nodes = [];
      for(let i=0; i<MAX_NODES; i++) {
          nodes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              radius: Math.random() * 2.4 + 1.8
          });
      }
  }
  initNodes();

  // Pointer gravity tracker
  host.addEventListener('pointermove', e => {
      const bounds = host.getBoundingClientRect();
      pointer.x = e.clientX - bounds.left;
      pointer.y = e.clientY - bounds.top;
  });

  // Clear pointer on leave
  host.addEventListener('pointerleave', () => {
      pointer.x = -1000;
      pointer.y = -1000;
  });

  function dist(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
  }

  // Render Loop
  function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';

      // Draw Links first so nodes sit crisp on top
      ctx.strokeStyle = '#E6C879';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
              const d = dist(nodes[i], nodes[j]);
              if (d < LINK) {
                  ctx.globalAlpha = 0.22 + (1 - d/LINK) * 0.55;
                  ctx.beginPath();
                  ctx.moveTo(nodes[i].x, nodes[i].y);
                  ctx.lineTo(nodes[j].x, nodes[j].y);
                  ctx.stroke();
              }
          }
      }

      nodes.forEach(node => {
          node.x += node.vx;
          node.y += node.vy;

          // Bounce off edges
          if(node.x < 0 || node.x > width) node.vx *= -1;
          if(node.y < 0 || node.y > height) node.vy *= -1;

          // Gentle Pointer gravity
          const pd = dist(node, pointer);
          if(pd < 220) {
              node.x -= (node.x - pointer.x) * 0.005;
              node.y -= (node.y - pointer.y) * 0.005;
          }

          // Draw Node (Pale Gold) — core + soft halo so particles read at retina scale
          const pulse = 0.78 + Math.sin(Date.now() * 0.001 + node.x) * 0.22;
          ctx.fillStyle = '#E6C879';
          ctx.globalAlpha = pulse * 0.28;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = pulse;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();
      });

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(animateCanvas);
  }


  let visible = false;
  let frame = 0;
  function sync() {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden && !reduced.matches) animateCanvas();
  }
  new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
  }).observe(host);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
}
