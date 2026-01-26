const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let mouse = { x: undefined, y: undefined };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

resize();

function animate() {
    // Esto crea el rastro de la luz
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    if (mouse.x !== undefined) {
        // Creamos un degradado circular en la posición del mouse
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)'); // Luz blanca sutil
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 200, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(animate);
}

animate();