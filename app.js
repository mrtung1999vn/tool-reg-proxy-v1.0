require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const BIND_IP = process.env.BIND_IP || '103.82.23.55';
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
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Lỗi đọc proxies.json:', error);
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

<<<<<<< HEAD
  const users = validProxies.map(p => {
    const md5 = crypto.createHash('md5').update(p.pass).digest('hex');
    return `${p.user}:CL:${md5}`;
  }).join(' ');

=======
  const users = validProxies.map(p => `${p.user}:CL:${p.pass}`).join(' ');
  const allows = validProxies.map(p => `allow ${p.user}`).join('\n');
>>>>>>> b14041daef3f22557ade073333af4bac91659dae
  const proxiesConf = validProxies.map(p =>
    `proxy -n -a -p${p.port} -i${BIND_IP}`
  ).join('\n');

  return `auth strong
users ${users}
<<<<<<< HEAD
allow * 
=======
${allows}
>>>>>>> b14041daef3f22557ade073333af4bac91659dae

${proxiesConf}

flush`;
}

function reload3proxy() {
  exec(RELOAD_CMD, (err, stdout, stderr) => {
    if (err) console.error('Lỗi reload 3proxy:', err);
    else {
      if (stdout) console.log('3proxy stdout:', stdout.trim());
      if (stderr) console.error('3proxy stderr:', stderr.trim());
      else console.log('✅ 3proxy reloaded OK');
    }
  });
}

function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// ------------------------- API -------------------------

app.get('/api/proxies', (req, res) => {
  res.json(readProxies());
});

app.post('/api/proxies', (req, res) => {
  const { port, user, pass, expire, fullname, phone } = req.body;
  if (!port || !user || !pass) return res.status(400).json({ error: 'Thiếu trường port, user, pass' });
  if (isNaN(port) || port < 1 || port > 65535) return res.status(400).json({ error: 'Port không hợp lệ' });
  if (expire && !isValidDate(expire)) return res.status(400).json({ error: 'Ngày hết hạn không hợp lệ' });

  const proxies = readProxies();
  if (proxies.find(p => p.port === port)) return res.status(400).json({ error: 'Port đã tồn tại' });

  proxies.push({ port, user, pass, expire: expire || null, fullname: fullname || '', phone: phone || '' });
  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  res.json({ success: true });
});

app.put('/api/proxies/:port', (req, res) => {
  const port = parseInt(req.params.port);
  const { pass, expire, fullname, phone } = req.body;
  if (expire && !isValidDate(expire)) return res.status(400).json({ error: 'Ngày hết hạn không hợp lệ' });

  const proxies = readProxies();
  const proxy = proxies.find(p => p.port === port);
  if (!proxy) return res.status(404).json({ error: 'Proxy không tồn tại' });

  if (pass !== undefined) proxy.pass = pass;
  proxy.expire = expire || null;
  proxy.fullname = fullname || '';
  proxy.phone = phone || '';

  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  res.json({ success: true });
});

app.delete('/api/proxies/:port', (req, res) => {
  const port = parseInt(req.params.port);
  let proxies = readProxies();
  if (!proxies.find(p => p.port === port)) return res.status(404).json({ error: 'Không tìm thấy proxy' });

  proxies = proxies.filter(p => p.port !== port);
  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  res.json({ success: true });
});

app.post('/api/proxies/batch-range', (req, res) => {
  let { from, to, expire, fullname, phone } = req.body;
  from = Number(from);
  to = Number(to);

  if (isNaN(from) || isNaN(to) || from <= 0 || to <= 0 || from > to) return res.status(400).json({ error: 'Khoảng port không hợp lệ' });
  if (expire && !isValidDate(expire)) return res.status(400).json({ error: 'Ngày hết hạn không hợp lệ' });
  if (!fullname || !phone) return res.status(400).json({ error: 'Thiếu thông tin fullname hoặc phone' });

  const proxies = readProxies();
  const existingPorts = new Set(proxies.map(p => p.port));
  let addedCount = 0;

  for (let port = from; port <= to; port++) {
    if (existingPorts.has(port)) continue;
    proxies.push({ port, user: 'user' + port, pass: randomString(8), expire: expire || null, fullname, phone });
    addedCount++;
  }

  if (addedCount === 0) return res.status(400).json({ error: 'Tất cả port đã tồn tại' });

  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  res.json({ added: addedCount });
});

app.post('/api/proxies/reload-expired', (req, res) => {
  const now = new Date();
  const proxies = readProxies();
  const filtered = proxies.filter(p => !p.expire || new Date(p.expire) > now);
  const deletedCount = proxies.length - filtered.length;

  if (deletedCount > 0) {
    writeProxies(filtered);
    fs.writeFileSync(CONFIG_PATH, generateConfig(filtered));
    reload3proxy();
  }

  res.json({ deleted: deletedCount });
});

app.post('/api/proxies/extend-expire', (req, res) => {
  const { ports, newExpire } = req.body;
  if (!Array.isArray(ports) || ports.length === 0) return res.status(400).json({ error: 'Danh sách port không hợp lệ' });
  if (!newExpire || isNaN(new Date(newExpire).getTime())) return res.status(400).json({ error: 'Ngày hết hạn không hợp lệ' });

  const proxies = readProxies();
  let updatedCount = 0;

  proxies.forEach(proxy => {
    if (ports.includes(proxy.port)) {
      proxy.expire = newExpire;
      updatedCount++;
    }
  });

  writeProxies(proxies);
  fs.writeFileSync(CONFIG_PATH, generateConfig(proxies));
  reload3proxy();

  res.json({ success: true, updated: updatedCount });
});

// Cron mỗi giờ tự xoá proxy hết hạn
setInterval(() => {
  const now = new Date();
  const proxies = readProxies();
  const filtered = proxies.filter(p => !p.expire || new Date(p.expire) > now);
  if (filtered.length !== proxies.length) {
    writeProxies(filtered);
    fs.writeFileSync(CONFIG_PATH, generateConfig(filtered));
    reload3proxy();
    console.log('⏰ Auto removed expired proxies and reloaded');
  }
}, 3600000);

app.listen(SERVER_PORT, () => {
  console.log(`✅ Server running at http://${BIND_IP}:${SERVER_PORT}`);
});
