require('dotenv').config();
const fs = require('fs');
const { users } = require('./config');

// 👇 lấy IP từ .env
const VPS_IP = process.env.VPS_IP;

const lines = users.map((u) => {
  return `${u.user}:${u.pass}@${VPS_IP}:${u.port}`;
});

fs.writeFileSync('proxy.txt', lines.join('\n'), 'utf-8');

console.log('✅ Danh sách proxy đã tạo:\n');
lines.forEach(line => console.log(line));

console.log('\n✅ Đã lưu danh sách vào proxy.txt');
console.log('Bạn có thể sử dụng danh sách này trong ứng dụng của mình.');
console.log('Chúc bạn thành công với dự án của mình! 🚀');