// Cosmic Watch - Classic Arcade Background Engine

export function initBackground(options = {}) {
    const config = {
        particleCount: options.particleCount || 100, // Balanced default
        asteroidCount: options.asteroidCount || 10,
        speed: options.speed || 0.5,
        color: options.color || '#ffffff',
        ...options
    };

    // Ensure color is a valid CSS string
    if (typeof config.color === 'number') {
        config.color = '#' + config.color.toString(16).padStart(6, '0');
    }

    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let asteroids = [];

    // --- Resize Handler ---
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        // Force canvas to match viewport exactly
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // Reset transform and scale for Retina/HiDPI
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Populate entities
        initEntities();
    }

    // --- Entity Classes ---
    class Star {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -5;
            this.size = Math.random() * 1.5 + 0.5;
            this.speed = (Math.random() * 0.5 + 0.1) * config.speed;
            this.alpha = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.y += this.speed;
            if (this.y > height) this.reset();
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
        }
    }

    class Asteroid {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            if (initial) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            } else {
                // Spawn off-screen
                const side = Math.floor(Math.random() * 4);
                if (side === 0) { this.x = Math.random() * width; this.y = -100; }
                if (side === 1) { this.x = width + 100; this.y = Math.random() * height; }
                if (side === 2) { this.x = Math.random() * width; this.y = height + 100; }
                if (side === 3) { this.x = -100; this.y = Math.random() * height; }
            }

            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 0.8 + 0.4) * config.speed;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.rot = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.015;

            this.radius = Math.random() * 25 + 10;
            this.points = [];
            const numPoints = 7 + Math.floor(Math.random() * 5);
            for (let i = 0; i < numPoints; i++) {
                const a = (i / numPoints) * Math.PI * 2;
                const r = this.radius * (0.8 + Math.random() * 0.4);
                this.points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rot += this.rotSpeed;

            if (this.x < -120) this.x = width + 120;
            if (this.x > width + 120) this.x = -120;
            if (this.y < -120) this.y = height + 120;
            if (this.y > height + 120) this.y = -120;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.strokeStyle = config.color;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.closePath();
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

    function initEntities() {
        stars = [];
        asteroids = [];
        for (let i = 0; i < config.particleCount; i++) stars.push(new Star());
        for (let i = 0; i < config.asteroidCount; i++) asteroids.push(new Asteroid());
    }

    function animate() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        stars.forEach(s => { s.update(); s.draw(); });
        asteroids.forEach(a => { a.update(); a.draw(); });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}
