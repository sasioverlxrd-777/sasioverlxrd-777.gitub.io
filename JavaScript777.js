// ========== 全局变量 ==========
let customName = null; // 用户自定义名字

// ========== 1. 个性化祝福（支持自定义名）==========
function generateUserId() {
  const ua = navigator.userAgent;
  let hash = 0;
  for (let i = 0; i < ua.length; i++) {
    const char = ua.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const blessings = [
  "愿你在2026年事业腾飞，财源滚滚！",
  "新年快乐！愿你健康平安，笑口常开！",
  "2026，心想事成，万事如意！",
  "福星高照，好运连连，新年大吉！",
  "愿你爱情甜蜜，家庭幸福，马年行大运！",
  "2026，升职加薪，股票翻倍！",
  "愿你每天都有小确幸，生活充满阳光！"
];
const defaultNames = ["小福星", "锦鲤", "逐梦者", "星辰", "鸿运当头", "开心果", "幸运儿"];
const emojis = ["🎉", "🧧", "✨", "🎇", "🏮", "🎁", "🐎"];

function showBlessing() {
  const userId = generateUserId();
  const nameToShow = customName || defaultNames[userId % defaultNames.length];
  const blessing = blessings[(userId * 31) % blessings.length];
  const emoji = emojis[(userId * 7) % emojis.length];
  document.getElementById('blessing').innerText = `${emoji} 亲爱的【${nameToShow}】，${blessing} ${emoji}`;
}

// ========== 2. 春节倒计时（不变）==========
function updateCountdown() {
  const springFestival = new Date('2026-02-17T00:00:00+08:00');
  const now = new Date();
  const diff = springFestival - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerText = "🎉 春节快乐！";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  document.getElementById('countdown').innerText = `距离2026春节还有：${days} 天 ${hours} 小时`;
}

// ========== 3. 飘雪 + 烟花（不变）==========
function createSnowflakes() {
  const container = document.getElementById('snowflakes');
  const snowflakes = ['❄', '❅', '❆'];
  for (let i = 0; i < 50; i++) {
    const snow = document.createElement('div');
    snow.classList.add('snowflake');
    snow.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    snow.style.left = Math.random() * 100 + 'vw';
    snow.style.opacity = Math.random() * 0.5 + 0.3;
    snow.style.fontSize = (Math.random() * 10 + 10) + 'px';
    snow.style.animationDuration = (Math.random() * 5 + 5) + 's';
    container.appendChild(snow);
  }
}

let canvas, ctx;
let fireworks = [];

class Firework {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = 2 + Math.random() * 3;
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.radius = 2;
    this.done = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.radius *= 0.97;
    if (this.radius < 0.1) this.done = true;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function launchFirework() {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  const targetX = Math.random() * canvas.width;
  const targetY = Math.random() * canvas.height / 2;
  fireworks.push(new Firework(x, y, targetX, targetY));
}

function animateFireworks() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    if (fireworks[i].done) {
      fireworks.splice(i, 1);
    }
  }

  if (Math.random() < 0.03) launchFirework();
  requestAnimationFrame(animateFireworks);
}

function initFireworks() {
  canvas = document.getElementById('fireworks');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  animateFireworks();
}

// ========== 4. 音乐控制（不变）==========
document.getElementById('playBtn').addEventListener('click', () => {
  const audio = document.getElementById('bgMusic');
  audio.play().then(() => {
    document.getElementById('playBtn').innerText = "🎵 音乐播放中...";
    document.getElementById('playBtn').disabled = true;
  }).catch(e => {
    alert("播放失败，请在安全环境下（如 GitHub Pages）打开");
  });
});

// ========== 5. 【新增】名字输入逻辑 ==========
document.getElementById('applyNameBtn').addEventListener('click', () => {
  const input = document.getElementById('userName').value.trim();
  if (input) {
    customName = input;
    showBlessing(); // 立即更新祝福
  } else {
    customName = null;
    showBlessing();
  }
});

// 回车键支持
document.getElementById('userName').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('applyNameBtn').click();
  }
});

// ========== 6. 【新增】截图下载功能 ==========
document.getElementById('downloadBtn').addEventListener('click', () => {
  const element = document.getElementById('capture');
  
  // 临时隐藏按钮（避免截图包含“保存”按钮）
  const buttons = element.querySelectorAll('button');
  buttons.forEach(btn => btn.style.display = 'none');
  
  html2canvas(element, {
    backgroundColor: null,
    scale: 2, // 提高清晰度
    useCORS: true
  }).then(canvas => {
    // 恢复按钮显示
    buttons.forEach(btn => btn.style.display = '');
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = '2026新年祝福.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    alert('截图失败，请刷新重试');
    buttons.forEach(btn => btn.style.display = '');
  });
});

// ========== 7. 初始化 ==========
window.addEventListener('load', () => {
  showBlessing();
  updateCountdown();
  setInterval(updateCountdown, 60000);
  createSnowflakes();
  initFireworks();
});
