// Work around sandboxed containers (gVisor) blocking uv_interface_addresses.
// No-op in normal environments: only patches if the real call throws.
const os = require('os');
const fake = {
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8',
    },
  ],
};
try {
  os.networkInterfaces();
} catch {
  os.networkInterfaces = () => fake;
}
