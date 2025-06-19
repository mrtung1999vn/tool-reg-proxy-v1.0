require('dotenv').config();
const fs = require('fs');
const { execSync } = require('child_process');
const generateIPv6List = require('./ipv6-gen');

// Load từ .env
const ipv6Prefix = process.env.IPV6_PREFIX;
const proxyCount = parseInt(process.env.PROXY_COUNT, 10);
const basePort = parseInt(process.env.BASE_PORT, 10);
const vpsIP = process.env.VPS_IP;

// Generate IPs
const ipList = generateIPv6List(ipv6Prefix, proxyCount);

// Pad
const pad = (num, size) => String(num).padStart(size, '0');

// Create user list
const users = ipList.map((ip, i) => {
  const index = pad(i + 1, 3);
  return {
    user: `proxy${index}`,
    pass: `secret${index}`,
    ip,
    port: basePort + i,
  };
});

// Export proxy.txt
const proxyTxt = users.map(u => `${u.user}:${u.pass}@${vpsIP}:${u.port}`).join('\n');
fs.writeFileSync('proxy.txt', proxyTxt);
console.log(`✅ Đã tạo proxy.txt với ${users.length} proxy.`);

// Generate 3proxy.cfg
const header = `daemon
log /var/log/3proxy.log D
logformat "L %Y-%m-%d %H:%M:%S %n %p %C:%c %R:%r %T %U %N"

maxconn 5000
nserver 8.8.8.8
nserver 1.1.1.1
nscache 65536
timeouts 5 5 30 60 180 1800 15 60
setgid 65535
setuid 65535
stacksize 6291456
auth strong`;

const proxyBlocks = users.map(u => {
  return `users ${u.user}:CL:${u.pass}
allow ${u.user}
proxy -6 -n -a -p${u.port} -i0.0.0.0 -e${u.ip}
flush`;
}).join('\n\n');

fs.writeFileSync('3proxy.cfg', `${header}\n\n${proxyBlocks}`, 'utf-8');
console.log(`✅ Đã tạo 3proxy.cfg.`);
