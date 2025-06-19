function generateIPv6List(prefix, count) {
  const ips = [];
  for (let i = 1; i <= count; i++) {
    const hex = i.toString(16).padStart(4, '0');
    ips.push(`${prefix}::${hex}`);
  }
  return ips;
}
module.exports = generateIPv6List;