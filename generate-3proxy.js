const fs = require('fs');
const { users } = require('./config');

// ✅ Cấu hình đầu file
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

// ✅ Tạo block proxy
const proxyBlocks = users.map(u => {
  return `users ${u.user}:CL:${u.pass}
allow ${u.user}
proxy -6 -n -a -p${u.port} -i0.0.0.0 -e${u.ip}
flush`;
}).join('\n\n');

// ✅ Ghi file cấu hình
fs.writeFileSync('3proxy.cfg', `${header}\n\n${proxyBlocks}`, 'utf-8');

// ✅ Log ra màn hình
console.log(`✅ Đã tạo 3proxy.cfg với ${users.length} proxy.`);
console.log('📁 File lưu tại: ./3proxy.cfg');
console.log('💡 Sử dụng lệnh sau để khởi chạy:');
console.log('   ./3proxy/bin/3proxy ./3proxy.cfg\n');
console.log('🚀 Chúc bạn thành công với hệ thống Proxy! 🔥');
// Lưu ý: Đảm bảo rằng bạn đã cài đặt 3proxy và cấu hình đúng đường dẫn
// Bạn có thể cần chạy lệnh `chmod +x 3proxy` để cấp quyền thực thi cho file 3proxy nếu cần.
// Đảm bảo rằng bạn đã cài đặt Node.js và các package cần thiết trước khi chạy script này.
// Bạn có thể chạy script này bằng lệnh: `node generate-3proxy.js`  