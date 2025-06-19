require('dotenv').config(); // 👈 load từ .env
const generateIPv6List = require('./ipv6-gen');
require('dotenv').config(); // nếu chưa có dòng này
const proxyCount = parseInt(process.env.PROXY_COUNT, 10);
// 👇 lấy biến từ .env
const ipv6Prefix = process.env.IPV6_PREFIX;
const basePort = parseInt(process.env.BASE_PORT, 10);

// Tạo danh sách IPv6
const ipList = generateIPv6List(ipv6Prefix, proxyCount);

// Hàm padding
function pad(num, size) {
  let s = num.toString();
  while (s.length < size) s = '0' + s;
  return s;
}

// Tạo user list
const users = ipList.map((ip, i) => {
  const index = pad(i + 1, 3);
  return {
    user: `proxy${index}`,
    pass: `secret${index}`,
    ip,
    port: basePort + i,
  };
});

module.exports = {
  basePort,
  users,
};
// Lưu ý: Đảm bảo rằng biến môi trường đã được thiết lập đúng trong file .env
// Ví dụ:   VPS_IP=123.45.67.89