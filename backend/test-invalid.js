import fs from 'fs';
import * as http from 'http';

const PORT = 3000;
const HOST = '127.0.0.1';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = { hostname: HOST, port: PORT, path, method, headers: { 'Content-Type': 'application/json', ...headers } };
    const req = http.request(options, (res) => {
      let data = ''; res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }); } 
        catch (e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const ts = Date.now();
  const sellerEmail = `seller_${ts}@example.com`;
  await request('POST', '/auth/register', { name: 'Seller', email: sellerEmail, password: 'password123' });
  const login = await request('POST', '/auth/login', { email: sellerEmail, password: 'password123' });
  const token = login.data.accessToken;

  const listingRes = await request('POST', '/listings', {
    type: 'SALE', category: 'Tech', title: 'Listing', description: 'Desc',
    priceOrRent: 50000, locationArea: 'London', locationPostcode: 'E1 6AN'
  }, { Authorization: `Bearer ${token}` });
  
  const listingId = listingRes.data.id;
  
  const fileBuffer = fs.readFileSync('test-assets/test-image.jpg');
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', blob, 'test-image.jpg');
  formData.append('type', 'photo'); // Lowercase!

  const res = await fetch(`http://${HOST}:${PORT}/listings/${listingId}/media`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  const data = await res.json();
  console.log('Status:', res.status, data);
}
run();
