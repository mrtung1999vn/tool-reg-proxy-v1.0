function generateIPv6List(prefix, count) {
  const ipList = [];
  for (let i = 0; i < count; i++) {
    const hex = i.toString(16).padStart(4, '0');
    ipList.push(`${prefix}:${hex}`);
  }
  return ipList;
}

module.exports = generateIPv6List;
