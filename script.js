const canvas = document.getElementById('geometry-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const mouse = { x: -100, y: -100, radius: 150 };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Shape {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseSize = Math.random() * 50 + 20;
        this.size = this.baseSize;
        this.opacity = Math.random() * 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
    }

    draw() {
        // Lógica de evasión del cursor
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let displayX = this.x;
        let displayY = this.y;

        if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            displayX -= Math.cos(angle) * force * 50;
            displayY -= Math.sin(angle) * force * 50;
            this.size = this.baseSize * 0.5; // Se encogen al ser evadidas
        } else {
            this.size = this.baseSize;
        }

        // Dibujar círculos concéntricos como la imagen
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(displayX, displayY, this.size + (i * 10), 0, Math.PI * 2);
            ctx.stroke();
        }

        this.y -= this.speed;
        if (this.y < -100) this.reset();
    }
}

function init() {
    resize();
    for (let i = 0; i < 15; i++) {
        particles.push(new Shape());
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Rastro sutil
    ctx.fillRect(0, 0, width, height);
    
    particles.forEach(p => p.draw());
    requestAnimationFrame(animate);
}

init();
animate();