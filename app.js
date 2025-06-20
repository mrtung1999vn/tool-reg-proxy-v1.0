require('dotenv').config();  // Phải đứng đầu tiên

const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const BIND_IP = process.env.BIND_IP || '127.0.0.1';
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;
const CONFIG_PATH = path.isAbsolute(process.env.CONFIG_PATH)
  ? process.env.CONFIG_PATH
  : path.join(__dirname, process.env.CONFIG_PATH || '3proxy.cfg');
const RELOAD_CMD = process.env.RELOAD_CMD || 'systemctl restart 3proxy';

const DB_PATH = path.join(__dirname, 'proxies.json');

function readProxies() {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing proxies.json:', error);
    return [];
  }
}

function writeProxies(proxies) {
  fs.writeFileSync(DB_PATH, JSON.stringify(proxies, null, 2));
}

function isValidDate(d) {
  return !isNaN(new Date(d).getTime());
}

function generateConfig(proxies) {
  const now = new Date();
  const validProxies = proxies.filter(p => !p.expire || new Date(p.expire) > now);

  if (validProxies.length === 0) return 'auth none\nproxy -n -p3128\nflush\n';

  const users = validProxies.map(p => `${p.user}:CL:${p.pass}`).join(' ');
  const proxiesConf = validProxies.map(p =>
    `proxy -n -a -p${p.port} -i${BIND_IP} -u${p.user} -P${p.pass}`
  ).join('\n');

  return `auth strong
users ${users}

${proxiesConf}

flush`;
}

function reload3proxy() {
  exec(RELOAD_CMD, (err, stdout, stderr) => {
    if (err) console.error('Reload 3proxy error:', err);
    else {
      if (stdout) console.log('3proxy reload stdout:', stdout.trim());
      if (stderr) console.error('3proxy reload stderr:', stderr.trim());
      else console.log('3proxy reloaded successfully');
    }
  });
}

// API lấy danh sách proxy
app.get('/api/proxies', (req, res) => {
  res.json(readProxies());
});

// API thêm proxy mới
app.post('/api/proxies', (req, res) => {
  const { port, user, pass, expire, fullname, phone } = req.body;

  if (!port || !user || !pass) {
    return res.status(400).json({ error: 'Missing required fields: port, user, pass' });
  }
  if (isNaN(port) || port < 1 || port > 65535) {
    return res.status(400).json({ error: 'Invalid port number' });
  }
  if (expire && !isValidDate(expire)) {
    return res.status(400).json({ error: 'Invalid expire date' });
  }

  let proxies = readProxies();
  if (proxies.find(p => p.port === port)) {
    return res.status(400).json({ error: 'Port already exists' });
  }

  proxies.push({ port, user, pass, expire: expire || null, fullname: fullname || '', phone: phone || '' });
  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  console.log(`Added proxy port:${port} user:${user}`);
  res.json({ success: true });
});

// API sửa proxy
app.put('/api/proxies/:port', (req, res) => {
  const port = parseInt(req.params.port);
  const { pass, expire, fullname, phone } = req.body;

  if (expire && !isValidDate(expire)) {
    return res.status(400).json({ error: 'Invalid expire date' });
  }

  let proxies = readProxies();
  const proxy = proxies.find(p => p.port === port);
  if (!proxy) return res.status(404).json({ error: 'Proxy not found' });

  if (pass !== undefined) proxy.pass = pass;
  proxy.expire = expire || null;
  proxy.fullname = fullname || '';
  proxy.phone = phone || '';

  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  console.log(`Updated proxy port:${port}`);
  res.json({ success: true });
});

// API xóa proxy
app.delete('/api/proxies/:port', (req, res) => {
  const port = parseInt(req.params.port);
  let proxies = readProxies();
  if (!proxies.find(p => p.port === port)) return res.status(404).json({ error: 'Not found' });

  proxies = proxies.filter(p => p.port !== port);
  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  console.log(`Deleted proxy port:${port}`);
  res.json({ success: true });
});

// API thêm batch proxy dạng from-to + thông tin chung
app.post('/api/proxies/batch-range', (req, res) => {
  let { from, to, expire, fullname, phone } = req.body;
  from = Number(from);
  to = Number(to);

  if (isNaN(from) || isNaN(to) || from <= 0 || to <= 0 || from > to) {
    return res.status(400).json({ error: 'Invalid port range' });
  }
  if (expire && !isValidDate(expire)) {
    return res.status(400).json({ error: 'Invalid expire date' });
  }
  if (!fullname || !phone) {
    return res.status(400).json({ error: 'Missing fullname or phone' });
  }

  let existing = readProxies();
  const existingPorts = new Set(existing.map(p => p.port));

  let addedCount = 0;
  for (let port = from; port <= to; port++) {
    if (existingPorts.has(port)) continue;

    const user = 'user' + port;
    const pass = randomString(8); // Bạn cần định nghĩa randomString ở server nếu chưa có
    existing.push({ port, user, pass, expire: expire || null, fullname, phone });
    addedCount++;
  }

  if (addedCount === 0) {
    return res.status(400).json({ error: 'All ports already exist' });
  }

  writeProxies(existing);
  fs.writeFileSync(CONFIG_PATH, generateConfig(existing));
  reload3proxy();

  res.json({ added: addedCount, skipped: to - from + 1 - addedCount });
});

// Thêm hàm randomString ở server nếu chưa có:
function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
// API xóa proxy hết hạn & reload 3proxy
app.post('/api/proxies/reload-expired', (req, res) => {
  let proxies = readProxies();
  const now = new Date();

  const filtered = proxies.filter(p => !p.expire || new Date(p.expire) > now);
  const deletedCount = proxies.length - filtered.length;

  if (deletedCount > 0) {
    writeProxies(filtered);
    fs.writeFileSync(CONFIG_PATH, generateConfig(filtered));
    reload3proxy();
  }

  res.json({ deleted: deletedCount });
});

// Scheduler xóa proxy hết hạn mỗi giờ
setInterval(() => {
  let proxies = readProxies();
  const now = new Date();
  const filtered = proxies.filter(p => !p.expire || new Date(p.expire) > now);
  if (filtered.length !== proxies.length) {
    writeProxies(filtered);
    fs.writeFileSync(CONFIG_PATH, generateConfig(filtered));
    reload3proxy();
    console.log('Removed expired proxies and reloaded 3proxy');
  }
}, 3600000);


app.post('/api/proxies/extend-expire', (req, res) => {
  const { ports, newExpire } = req.body;

  if (!Array.isArray(ports) || ports.length === 0) {
    return res.status(400).json({ error: 'Danh sách port không hợp lệ' });
  }
  if (!newExpire || isNaN(new Date(newExpire).getTime())) {
    return res.status(400).json({ error: 'Ngày hết hạn không hợp lệ' });
  }

  let proxies = readProxies();
  let updatedCount = 0;

  proxies = proxies.map(proxy => {
    if (ports.includes(proxy.port)) {
      proxy.expire = newExpire;
      updatedCount++;
    }
    return proxy;
  });

  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  res.json({ success: true, updated: updatedCount });
});


app.listen(SERVER_PORT, () => {
  console.log(`Server running at http://${BIND_IP}:${SERVER_PORT}`);
});
// Kiểm tra và tạo file proxies.json nếu chưa tồn tại