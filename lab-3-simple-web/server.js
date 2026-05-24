const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT = process.env.PORT || 3000;

// ── MIME types for static files ─────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'text/javascript; charset=utf-8',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
};

// ── Read a view file ────────────────────────────────────────────────────────
function readView(name) {
  return fs.readFileSync(path.join(__dirname, 'views', name), 'utf8');
}

// ── Minimal template renderer: <%= key %> and <% if (key) { %> ... <% } %> ─
function render(html, data = {}) {
  // <%= value %>
  html = html.replace(/<%=\s*([\w.]+)\s*%>/g, (_, key) => {
    const val = key.split('.').reduce((o, k) => (o != null ? o[k] : ''), data);
    return val != null
      ? String(val)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
      : '';
  });

  // <% if (key) { %> ... <% } %>
  html = html.replace(/<% if \(([\w.]+)\) \{ %>([\s\S]*?)<% \} %>/g, (_, key, block) => {
    const val = key.split('.').reduce((o, k) => (o != null ? o[k] : ''), data);
    return val ? block : '';
  });

  return html;
}

// ── Parse URL-encoded POST body ─────────────────────────────────────────────
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end',  () => {
      try {
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [k, v] of params.entries()) obj[k] = v;
        resolve(obj);
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// ── Serve a static file from /public ───────────────────────────────────────
function serveStatic(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

// ── Send HTML response ──────────────────────────────────────────────────────
function sendHTML(res, html, status = 200) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

// ── Redirect ────────────────────────────────────────────────────────────────
function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

// ── Email validation ────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Request handler ─────────────────────────────────────────────────────────
async function handler(req, res) {
  const { pathname } = url.parse(req.url);
  const method = req.method.toUpperCase();

  // ── Static assets (/style.css, /images/*, etc.) ─────────────────────────
  if (pathname.startsWith('/') && path.extname(pathname)) {
    const filePath = path.join(__dirname, 'public', pathname);
    return serveStatic(res, filePath);
  }

  // ── GET / ────────────────────────────────────────────────────────────────
  if (pathname === '/' && method === 'GET') {
    return sendHTML(res, readView('home.html'));
  }

  // ── GET /contact ─────────────────────────────────────────────────────────
  if (pathname === '/contact' && method === 'GET') {
    return sendHTML(res, render(readView('contact.html'), { error: null, formData: {} }));
  }

  // ── POST /contact ────────────────────────────────────────────────────────
  if (pathname === '/contact' && method === 'POST') {
    const body = await parseBody(req);
    const { name = '', email = '', message = '' } = body;

    if (!name.trim() || !email.trim() || !message.trim()) {
      return sendHTML(res,
        render(readView('contact.html'), {
          error: 'Please fill in all fields.',
          formData: { name, email, message }
        }), 400);
    }

    if (!EMAIL_RE.test(email.trim())) {
      return sendHTML(res,
        render(readView('contact.html'), {
          error: 'Please enter a valid email address.',
          formData: { name, email, message }
        }), 400);
    }

    console.log(`[CONTACT] From: ${name} <${email}>\n${message}\n`);

    // PRG – redirect so refresh won't re-submit
    return redirect(res, '/message-sent');
  }

  // ── GET /message-sent ────────────────────────────────────────────────────
  if (pathname === '/message-sent' && method === 'GET') {
    return sendHTML(res, readView('message-sent.html'));
  }

  // ── 404 ──────────────────────────────────────────────────────────────────
  return sendHTML(res, readView('404.html'), 404);
}

// ── Create & start server ───────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\n  Portfolio site running at http://localhost:${PORT}\n`);
});
