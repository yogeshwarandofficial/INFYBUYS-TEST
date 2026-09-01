const http = require('http');

const request = (path, method, data, token) => {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': data ? Buffer.byteLength(data) : 0,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method,
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

async function runTests() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'securepassword123';

  console.log('--- A. Registering user for tests ---');
  await request('/auth/register', 'POST', JSON.stringify({
    name: 'Refresh Test',
    email,
    password
  }));

  console.log('\n--- B. Test: Valid login ---');
  const resValid = await request('/auth/login', 'POST', JSON.stringify({
    email,
    password
  }));
  const loginBody = JSON.parse(resValid.body);
  const token = loginBody.accessToken;
  const refreshToken = loginBody.refreshToken;
  console.log('Status:', resValid.status, 'Has accessToken:', !!token, 'Has refreshToken:', !!refreshToken);

  console.log('\n--- C. Test: GET /users/me with a valid access token ---');
  const resMe = await request('/users/me', 'GET', null, token);
  console.log('Status:', resMe.status);

  console.log('\n--- D. Test: Refresh token ---');
  const resRefresh = await request('/auth/refresh', 'POST', JSON.stringify({ refreshToken }));
  const refreshBody = JSON.parse(resRefresh.body);
  const newAccessToken = refreshBody.accessToken;
  const newRefreshToken = refreshBody.refreshToken;
  console.log('Status:', resRefresh.status, 'Has new accessToken:', !!newAccessToken, 'Has new refreshToken:', !!newRefreshToken);

  console.log('\n--- E. Test: Use NEW access token ---');
  const resMeNew = await request('/users/me', 'GET', null, newAccessToken);
  console.log('Status:', resMeNew.status);

  console.log('\n--- F. Test: Reuse OLD refresh token ---');
  const resRefreshOld = await request('/auth/refresh', 'POST', JSON.stringify({ refreshToken }));
  console.log('Status:', resRefreshOld.status);
  console.log('Body:', resRefreshOld.body);

  console.log('\n--- G. Test: Logout ---');
  const resLogout = await request('/auth/logout', 'POST', JSON.stringify({ refreshToken: newRefreshToken }));
  console.log('Status:', resLogout.status);
  console.log('Body:', resLogout.body);

  console.log('\n--- H. Test: Use logged-out refresh token ---');
  const resRefreshLoggedOut = await request('/auth/refresh', 'POST', JSON.stringify({ refreshToken: newRefreshToken }));
  console.log('Status:', resRefreshLoggedOut.status);
  console.log('Body:', resRefreshLoggedOut.body);

  console.log('\n--- I. Test: Invalid refresh token ---');
  const resRefreshInvalid = await request('/auth/refresh', 'POST', JSON.stringify({ refreshToken: 'some-random-string' }));
  console.log('Status:', resRefreshInvalid.status);
  console.log('Body:', resRefreshInvalid.body);
}

setTimeout(runTests, 2000);
