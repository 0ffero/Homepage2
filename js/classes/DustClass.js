class Particle {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = 0;
        this.fadeIn = true;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.fadeIn) {
            this.opacity += 0.005;
            if (this.opacity >= 1) {
                this.opacity = 1;
                this.fadeIn = false;
            }
        } else {
            this.opacity -= 0.005;
            if (this.opacity < 0) {
                this.opacity = 0;
            }
        };
    }

    draw() {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class DustClass {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.initParticles();
    }

    initParticles() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.particles.push(new Particle(Math.random() * this.canvas.width, Math.random() * this.canvas.height, this.ctx));
            }, i * 200);
        }
    }

    updateParticles() {
        if (!this.lastUpdateTime) {
            this.lastUpdateTime = Date.now();
        };
        const now = Date.now();
        const elapsed = now - this.lastUpdateTime;

        if (elapsed > 1000 / 30) { // 30 times per second
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => 
                particle.opacity > 0 && 
                particle.x >= 0 && particle.x <= this.canvas.width && 
                particle.y >= 0 && particle.y <= this.canvas.height
            );
            while (this.particles.length < 50) {
                this.particles.push(new Particle(Math.random() * this.canvas.width, Math.random() * this.canvas.height, this.ctx));
            }
            this.lastUpdateTime = now;
        };
    }

    drawParticles() {
        this.particles.forEach(particle => particle.draw());
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(this.animate.bind(this));
    }
};