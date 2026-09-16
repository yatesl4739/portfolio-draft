// ── Typed title animation ────────────────────────────────────
const titles = [
  'CS Student',
  'Machine Learning'
];

const subdomains = [
  'wtfissystemdata',
  'relayout',
  'caffeine'
];

let titleIdx = 0, charIdx = 0, deleting = false;
const el = document.getElementById('typed-title');

function typeTitle() {
  const current = titles[0];

  el.textContent = current.slice(0, charIdx + 1);
  charIdx++;

  if (charIdx < current.length) {
    setTimeout(typeTitle, 70);
  }
}

typeTitle();

// Disable spacebar scroll for best experience

document.addEventListener('keydown', e => {
  if (e.key !== ' ') return;
  // Still allow spaces in form fields and space-to-click on buttons
  if (e.target.closest('input, textarea, select, button, [contenteditable]')) return;
  e.preventDefault();
});

// Terminal animation 
const lines = [
  { type: 'cmd',  prompt: '~',    text: 'whoami' },
  { type: 'out',  text: 'Liam Yates — CS student @ <span style="color:var(--yellow)">Purdue</span>' },
  { type: 'cmd',  prompt: '~',    text: 'cat skills.json' },
  { type: 'json', text: '{ <span class="t-key">"languages"</span>: <span class="t-val">["C","Java","Python"]</span>,\n  <span class="t-key">"focus"</span>: <span class="t-val">"backend + machine learning"</span> }' },
 // { type: 'cmd',  prompt: '~',    text: 'git log --oneline -3' },
 // { type: 'out',  text: '<span style="color:var(--yellow)">a1b2c3d</span> feat: ship new feature' },
 // { type: 'out',  text: '<span style="color:var(--yellow)">d4e5f6a</span> fix: resolve edge case' },
 // { type: 'out',  text: '<span style="color:var(--yellow)">789b0cd</span> chore: update deps' },
];

const terminal = document.getElementById('terminal-output');
let lineIdx = 0;

function buildPrompt(path) {
  return `<span class="t-prompt">❯</span> `;
}

async function renderLine(line) {
  const span = document.createElement('span');
  span.className = 't-line';

  if (line.type === 'cmd') {
    span.innerHTML = `<span class="t-prompt">❯</span> <span class="t-cmd"></span>`;
    terminal.appendChild(span);
    const cmdEl = span.querySelector('.t-cmd');
    for (const ch of line.text) {
      cmdEl.textContent += ch;
      await delay(55);
    }
  } else {
    span.innerHTML = `<span class="t-out">${line.text}</span>`;
    terminal.appendChild(span);
  }
  terminal.scrollTop = terminal.scrollHeight;
}

async function runTerminal() {
  await delay(600);
  for (const line of lines) {
    await renderLine(line);
    await delay(line.type === 'cmd' ? 400 : 180);
  }
  startInteractivePrompt();
}

function startInteractivePrompt() {
  const inputLine = document.createElement('span');
  inputLine.className = 't-line';
  inputLine.innerHTML = `<span class="t-prompt">❯</span> <span class="t-cmd t-input-text"></span><span class="t-cursor"></span>`;
  terminal.appendChild(inputLine);
  terminal.scrollTop = terminal.scrollHeight;

  const inputText = inputLine.querySelector('.t-input-text');

  function handleKey(e) {
    if (e.key === 'Enter') {
      const cmd = inputText.textContent.trim();
      inputLine.querySelector('.t-cursor').remove();
      if (cmd) {
        if (cmd === 'ls') {
          const out = document.createElement('span');
          out.className = 't-line';
          out.innerHTML = `<span class="t-out">${subdomains.join('  ')}</span>`;
          terminal.appendChild(out);
        }
        else if (cmd.startsWith('cd ')) {
          const subdomain = cmd.slice(3).trim();
          if (subdomain.startsWith('-f ')) {
            // go to that domain anyway
            window.location.href = `https://${subdomain.slice(3).trim()}.liamyates.com`;
          }
          else if (subdomains.includes(subdomain)) {
            window.location.href = `https://${subdomain}.liamyates.com`;
          } else {
            const out = document.createElement('span');
            out.className = 't-line';
            out.innerHTML = `<span class="t-out">cd: no such file or directory: ${subdomain}</span>`;
            terminal.appendChild(out);
          }
        }
        else{
          const out = document.createElement('span');
          out.className = 't-line';
          out.innerHTML = `<span class="t-out">command not found: ${cmd}</span>`;
          terminal.appendChild(out);
        }
      }
      document.removeEventListener('keydown', handleKey);
      startInteractivePrompt();
    } else if (e.key === 'Backspace') {
      inputText.textContent = inputText.textContent.slice(0, -1);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      inputText.textContent += e.key;
    }
    terminal.scrollTop = terminal.scrollHeight;
  }

  document.addEventListener('keydown', handleKey);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

runTerminal();

// ── Terminal close button ────────────────────────────────────
document.querySelector('.dot.red').addEventListener('click', () => {
  document.querySelector('.hero-terminal').remove();
});

// ── Footer year ──────────────────────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ── Scroll-in animation for cards ───────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = `opacity .4s ease ${i * 0.1}s, transform .4s ease ${i * 0.1}s, border-color .2s, box-shadow .2s`;
  observer.observe(card);
});
