const fs = require('fs');
const { users, basePort } = require('./config');

const VPS_IP = 'YOUR_VPS_IP'; // ⚠️ Thay bằng IP thật của VPS

const lines = users.map((u, i) => {
  const port = basePort + i;
  return `${u.user}:${u.pass}@${VPS_IP}:${port}`;
});

fs.writeFileSync('proxy.txt', lines.join('\n'));
console.log('✅ Đã tạo proxy.txt.');
