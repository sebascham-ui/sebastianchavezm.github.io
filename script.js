const mCanvas = document.getElementById('canvas-m');
const sCanvas = document.getElementById('canvas-sketch');
const mctx = mCanvas.getContext('2d');
const sctx = sCanvas.getContext('2d');

let w, h, isLight = false;
let mouse = { x: -2000, y: -2000 };

function resize() {
    w = mCanvas.width = sCanvas.width = window.innerWidth;
    h = mCanvas.height = sCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('click', () => { 
    isLight = !isLight; 
    document.body.classList.toggle('light-mode'); 
});

// --- METABALLS ORIGINALES ---
class Dot {
    constructor(type) { this.type = type; this.init(); }
    init() {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.r = this.type === 'S' ? 30 : (this.type === 'M' ? 60 : 100);
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
    }
    update() {
        const sc = window.scrollY;
        if (sc > 10) {
            this.y += ( (innerHeight/8) - this.y) * 0.05;
            this.vx *= 0.95; this.vy *= 0.95;
        } else {
            let dx = mouse.x - this.x, dy = mouse.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 350) { this.vx += dx*0.003; this.vy += dy*0.003; }
            this.x += this.vx; this.y += this.vy;
            this.vx *= 0.99; this.vy *= 0.99;
            if(this.x<0 || this.x>w) this.vx *= -1;
            if(this.y<0 || this.y>h) this.vy *= -1;
        }
    }
    draw() {
        const colors = isLight ? ["#ff6a00", "#ffea00", "#fff"] : ["#001c44", "#0062ff", "#00f2ff"];
        const g = mctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        g.addColorStop(0, colors[2]); g.addColorStop(0.5, colors[1]); g.addColorStop(1, colors[0]);
        mctx.fillStyle = g; mctx.beginPath(); mctx.arc(this.x, this.y, this.r, 0, Math.PI*2); mctx.fill();
    }
}

// --- GLITCH LINES ---
class Line {
    constructor() { this.init(); }
    init() {
        this.x = Math.random()*w; this.y = Math.random()*h;
        this.len = Math.random()*400+100;
        this.speed = Math.random()*25+15;
    }
    draw() {
        sctx.strokeStyle = isLight ? "rgba(226,0,122,0.6)" : "rgba(0,242,255,0.6)";
        sctx.lineWidth = 2;
        sctx.beginPath(); sctx.moveTo(this.x, this.y); sctx.lineTo(this.x+this.len, this.y); sctx.stroke();
        this.x += this.speed; if(this.x > w) this.init();
    }
}

// Inicialización
let dots = ['S','S','M','M','L','L'].map(t => new Dot(t));
let lines = Array.from({length: 50}, () => new Line());

// Órbita
const nameT = "SEBASTIAN CH";
nameT.split("").forEach((c, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.innerText = c === " " ? "\u00A0" : c;
    span.style.animationDelay = `${i * -0.38}s`;
    document.getElementById('orbit').appendChild(span);
});

function loop() {
    mctx.clearRect(0,0,w,h); sctx.clearRect(0,0,w,h);
    dots.forEach(d => { d.update(); d.draw(); });
    if(window.scrollY > 100) lines.forEach(l => l.draw());
    requestAnimationFrame(loop);
}

window.addEventListener('scroll', () => {
    const sc = window.scrollY, vh = window.innerHeight;
    if(sc > vh*0.3) {
        document.getElementById('cmyk-box').classList.add('visible');
        sCanvas.style.opacity = "1";
    } else {
        document.getElementById('cmyk-box').classList.remove('visible');
        sCanvas.style.opacity = "0";
    }
});

resize(); loop();