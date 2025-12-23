const dialogue = [
    "Sayang, maafkan aku yang terlalu tenggelam dalam kesibukan...",
    "Aku sedang berjuang keras di luar sana, demi hari esok kita yang lebih baik.",
    "Bukan ingin menjauh, tapi aku sedang mengumpulkan alasan agar kita bisa terus bersama.",
    "Terima kasih untuk sabarmu yang seluas samudra.",
    "Aku pulang kepadamu, selalu. Aku sayang kamu. 🌸🦋"
];

const stage = document.getElementById('story-teller');
const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- Physics Particle Engine ---
let objects = [];

class Butterfly {
    constructor() { this.init(); }
    init() {
        this.x = -100; this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 2 + 1;
        this.vy = Math.random() * 2 - 1;
        this.size = Math.random() * 15 + 10;
        this.phase = Math.random() * Math.PI * 2;
    }
    update() {
        this.x += this.vx;
        this.y += Math.sin(this.x * 0.02 + this.phase) * 2;
        if (this.x > canvas.width + 100) this.init();
    }
    draw() {
        ctx.font = `${this.size}px serif`;
        ctx.fillText('🦋', this.x, this.y);
    }
}

function initScene() {
    for(let i=0; i<6; i++) objects.push(new Butterfly());
}

function runLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw Petals (Soft Pink Circles)
    ctx.fillStyle = "rgba(255, 182, 193, 0.4)";
    for(let i=0; i<20; i++) {
        let x = (Math.sin(Date.now()*0.001 + i)*canvas.width/2) + canvas.width/2;
        let y = (Math.cos(Date.now()*0.0005 + i)*canvas.height/2) + canvas.height/2;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
    }
    objects.forEach(obj => { obj.update(); obj.draw(); });
    requestAnimationFrame(runLoop);
}

// --- Cinematic Sequence ---
function showSentence(index) {
    if (index >= dialogue.length) return;

    const node = document.createElement('div');
    node.className = 'msg-node';
    node.innerHTML = `
        <div class="worm-3d">${'<div class="seg"></div>'.repeat(10)}</div>
        <div class="silk"></div>
        <div class="glass-card"><h1>${dialogue[index]}</h1></div>
    `;
    stage.appendChild(node);

    const h1 = node.querySelector('h1');
    const segments = node.querySelectorAll('.seg');
    const tl = gsap.timeline();

    // 1. Entry Motion (Physics Ease)
    tl.to(node, { top: '25%', duration: 3, ease: "expo.out" });

    // 2. Worm Organic Movement
    gsap.to(segments, {
        y: -10, stagger: { each: 0.08, from: "start" },
        duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut"
    });

    // 3. Text Blooming
    tl.to(h1, { opacity: 1, filter: "blur(0px)", scale: 1.05, duration: 2, ease: "power2.out" }, "-=1.5");

    // 4. Parallax Shift on Move
    document.addEventListener('mousemove', (e) => {
        let x = (e.clientX - window.innerWidth/2) * 0.01;
        gsap.to('.layer-2', { x: x, duration: 1 });
        gsap.to(node, { x: -x * 2, rotationY: x*0.5, duration: 1.5 });
    });

    // 5. Exit
    tl.to(node, { 
        opacity: 0, y: 150, filter: "blur(20px)", duration: 2, delay: 6,
        onComplete: () => { node.remove(); showSentence(index + 1); }
    });
}

window.onload = () => {
    initScene();
    runLoop();
    setTimeout(() => showSentence(0), 1000);
};
