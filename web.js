const express = require('express');
const { users, basePort } = require('./config');
const os = require('os');
const { execSync } = require('child_process');

const app = express();
const port = 8080;

// 🧠 Tự động lấy public IP
function getPublicIP() {
  try {
    const platform = os.platform();
    let result = '';

    if (platform === 'win32') {
      // Windows
      result = execSync('curl ifconfig.me', { encoding: 'utf8' });
    } else {
      // Ubuntu / Linux
      result = execSync('curl -s https://api.ipify.org', { encoding: 'utf8' });
    }

    return result.trim();
  } catch (error) {
    console.error('❌ Không lấy được IP public:', error.message);
    return '127.0.0.1';
  }
}

const VPS_IP = getPublicIP();

app.get('/', (req, res) => {
  const proxies = users.map((u, i) => ({
    proxy: `${u.user}:${u.pass}@${VPS_IP}:${basePort + i}`
  }));

  const html = `
    <h2>Danh sách Proxy (${users.length} cái)</h2>
    <pre>${proxies.map(p => p.proxy).join('\n')}</pre>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`🌐 Web UI đang chạy tại: http://localhost:${port}`);
  console.log(`🌐 Hoặc truy cập từ máy khác: http://${VPS_IP}:${port}`);
});
