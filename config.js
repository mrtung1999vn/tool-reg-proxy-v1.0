require('dotenv').config();
const generateIPv6List = require('./ipv6-gen');

const ipv6Prefix = process.env.IPV6_PREFIX;
const proxyCount = parseInt(process.env.PROXY_COUNT, 10);
const basePort = parseInt(process.env.BASE_PORT, 10);

const ipList = generateIPv6List(ipv6Prefix, proxyCount);

function pad(num, size) {
  let s = num.toString();
  while (s.length < size) s = '0' + s;
  return s;
}

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
  users
};