const generateIPv6List = require('./ipv6-gen');

const ipv6Prefix = '2001:db8:abcd'; // Thay bằng prefix của VPS
const proxyCount = 100;
const basePort = 30000;

// Tạo danh sách IP
const ipList = generateIPv6List(ipv6Prefix, proxyCount);

// Format: proxy001 / secret001
function pad(num, size) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

const users = ipList.map((ip, i) => {
  const index = pad(i + 1, 3); // VD: 001, 002...
  return {
    user: `proxy${index}`,
    pass: `secret${index}`,
    ip,
  };
});

module.exports = {
  basePort,
  users,
};
// Lưu ý: Đảm bảo rằng prefix IPv6 và basePort được cấu hình đúng với môi trường của bạn.
// Bạn có thể thay đổi prefix và basePort theo nhu cầu của mình.