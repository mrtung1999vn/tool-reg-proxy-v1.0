require('dotenv').config();
const fs = require('fs');
const { users } = require('./config');
const vpsIP = process.env.VPS_IP;

const proxyTxt = users.map(u => `${u.user}:${u.pass}@${vpsIP}:${u.port}`).join('\n');
fs.writeFileSync('proxy.txt', proxyTxt);
console.log(`✅ Đã tạo proxy.txt với ${users.length} proxy.`);

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
auth strong
`;

const proxyBlocks = users.map(u => {
  return `users ${u.user}:CL:${u.pass}\nallow ${u.user}\nproxy -6 -n -a -p${u.port} -i0.0.0.0 -e${u.ip}\nflush`;
}).join('\n\n');

fs.writeFileSync('3proxy.cfg', `${header}\n${proxyBlocks}`);
console.log(`✅ Đã tạo 3proxy.cfg.`);