const fs = require('fs');
const { users, basePort } = require('./config');

let config = `
daemon
maxconn 2000
nserver 8.8.8.8
nserver 1.1.1.1
nscache 65536
timeouts 1 5 30 60 180 1800 15 60
setgid 65535
setuid 65535
stacksize 6291456
flush
`;

users.forEach((u, i) => {
  const port = basePort + i;
  config += `
auth strong
users ${u.user}:CL:${u.pass}
allow ${u.user}
proxy -6 -n -a -p${port} -i0.0.0.0 -e${u.ip}
flush
`;
});

fs.writeFileSync('3proxy.cfg', config);
console.log(`✅ Đã tạo 3proxy.cfg với ${users.length} proxy.`);
