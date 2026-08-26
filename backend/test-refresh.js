const http = require('http');

const PORT = 3000;
const HOST = '127.0.0.1';
let testUserEmail = `test_${Date.now()}@example.com`;
let testUserPassword = 'password123';
let accessToken = null;
let refreshToken = null;
let newAccessToken = null;
let newRefreshToken = null;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Test A: Register ---');
  const regRes = await request('POST', '/auth/register', { name: 'Test User', email: testUserEmail, password: testUserPassword });
  console.log('Status:', regRes.status);
  if (regRes.status !== 201) throw new Error('Registration failed');

  console.log('\n--- Test B: Login ---');
  const loginRes = await request('POST', '/auth/login', { email: testUserEmail, password: testUserPassword });
  console.log('Status:', loginRes.status);
  if ((loginRes.status !== 200 && loginRes.status !== 201) || !loginRes.data.accessToken || !loginRes.data.refreshToken) {
    throw new Error('Login failed or missing tokens');
  }
  accessToken = loginRes.data.accessToken;
  refreshToken = loginRes.data.refreshToken;

  console.log('\n--- Test C: /users/me using accessToken ---');
  const meRes = await request('GET', '/users/me', null, { Authorization: `Bearer ${accessToken}` });
  console.log('Status:', meRes.status);
  if (meRes.status !== 200) throw new Error('me endpoint failed');

  console.log('\n--- Test D: /auth/refresh using refreshToken ---');
  const refreshRes = await request('POST', '/auth/refresh', { refreshToken });
  console.log('Status:', refreshRes.status);
  if (refreshRes.status !== 200 || !refreshRes.data.accessToken || !refreshRes.data.refreshToken) {
    throw new Error('Refresh failed or missing tokens');
  }
  newAccessToken = refreshRes.data.accessToken;
  newRefreshToken = refreshRes.data.refreshToken;
  if (newRefreshToken === refreshToken) {
    throw new Error('Tokens were not rotated');
  }

  console.log('\n--- Test E: /users/me using NEW accessToken ---');
  const newMeRes = await request('GET', '/users/me', null, { Authorization: `Bearer ${newAccessToken}` });
  console.log('Status:', newMeRes.status);
  if (newMeRes.status !== 200) throw new Error('me endpoint failed with new token');

  console.log('\n--- Test F: /auth/refresh using OLD refreshToken ---');
  const oldRefreshRes = await request('POST', '/auth/refresh', { refreshToken });
  console.log('Status:', oldRefreshRes.status);
  if (oldRefreshRes.status !== 401) throw new Error('Old refresh token should be invalid');

  console.log('\n--- Test G: /auth/logout using NEW refreshToken ---');
  const logoutRes = await request('POST', '/auth/logout', { refreshToken: newRefreshToken });
  console.log('Status:', logoutRes.status);
  if (logoutRes.status !== 200) throw new Error('Logout failed');

  console.log('\n--- Test H: /auth/refresh using logged-out refreshToken ---');
  const loggedOutRefreshRes = await request('POST', '/auth/refresh', { refreshToken: newRefreshToken });
  console.log('Status:', loggedOutRefreshRes.status);
  if (loggedOutRefreshRes.status !== 401) throw new Error('Logged out refresh token should be invalid');

  console.log('\n--- Test I: /auth/refresh using random refresh token ---');
  const randomRefreshRes = await request('POST', '/auth/refresh', { refreshToken: 'random_junk_token' });
  console.log('Status:', randomRefreshRes.status);
  if (randomRefreshRes.status !== 401) throw new Error('Random refresh token should be invalid');

  console.log('\n--- Test J: Verification done ---');
  console.log('All tests passed successfully!');
}

runTests().catch(console.error);
