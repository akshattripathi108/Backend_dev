const http = require('http');
const querystring = require('querystring');

const BASE_URL = 'http://localhost:3000';
const TEST_ACCOUNTS = [{ username: 'alice', password: 'password123' }, { username: 'bob', password: 'securepass' }];

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = { hostname: url.hostname, port: url.port, path: url.pathname + url.search, method: method, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { const parsed = JSON.parse(data); resolve({ status: res.statusCode, headers: res.headers, body: parsed }); }
        catch (e) { resolve({ status: res.statusCode, headers: res.headers, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n================================');
  console.log('🧪 Session & Cookie Authentication Tests');
  console.log('================================\n');

  let sessionCookie = null;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    console.log('Test 1: Server Health Check (GET /)');
    try {
      const res = await makeRequest('GET', '/');
      if (res.status === 200 && res.body.message) { console.log('✅ Server is running'); testsPassed++; }
      else { throw new Error('Invalid response'); }
    } catch (err) { console.log('❌ Server health check failed:', err.message); testsFailed++; }

    console.log('\nTest 2: Login with valid credentials');
    try {
      const loginData = TEST_ACCOUNTS[0];
      const res = await makeRequest('POST', '/login', loginData);
      if (res.status === 200 && res.body.success) {
        console.log(`✅ Login successful for user: ${res.body.user.username}`);
        console.log(`   User ID: ${res.body.user.id}`);
        console.log(`   Email: ${res.body.user.email}`);
        const setCookieHeaders = res.headers['set-cookie'];
        if (setCookieHeaders) { sessionCookie = setCookieHeaders[0].split(';')[0]; console.log(`   Session cookie set: ${sessionCookie.substring(0, 30)}...`); }
        testsPassed++;
      } else { throw new Error(res.body.message || 'Login failed'); }
    } catch (err) { console.log('❌ Login test failed:', err.message); testsFailed++; }

    console.log('\nTest 3: Session Check (GET /session-check)');
    try {
      if (!sessionCookie) throw new Error('No session cookie available');
      const res = await makeRequest('GET', '/session-check');
      if (res.status === 200 && res.body.isActive) {
        console.log('✅ Session is active');
        console.log(`   User: ${res.body.user.username} (ID: ${res.body.user.id})`);
        testsPassed++;
      } else { throw new Error('Session check failed - no active session'); }
    } catch (err) { console.log('❌ Session check failed:', err.message); testsFailed++; }

    console.log('\nTest 4: Get User Profile (GET /profile)');
    try {
      const res = await makeRequest('GET', '/profile');
      if (res.status === 200 && res.body.profile) {
        console.log('✅ Profile retrieved successfully');
        console.log(`   Username: ${res.body.profile.username}`);
        console.log(`   Email: ${res.body.profile.email}`);
        console.log(`   Session created: ${res.body.profile.sessionCreated}`);
        testsPassed++;
      } else { throw new Error('Profile retrieval failed'); }
    } catch (err) { console.log('❌ Profile test failed:', err.message); testsFailed++; }

    console.log('\nTest 5: Get Session Status (GET /session-status)');
    try {
      const res = await makeRequest('GET', '/session-status');
      if (res.body.isActive) {
        console.log('✅ Session status retrieved');
        console.log(`   Session ID: ${res.body.sessionId.substring(0, 10)}...`);
        console.log(`   User: ${res.body.username}`);
        console.log(`   TTL: ${Math.floor(res.body.cookie.maxAge / 1000 / 60 / 60)} hours`);
        testsPassed++;
      } else { throw new Error('No active session'); }
    } catch (err) { console.log('❌ Session status test failed:', err.message); testsFailed++; }

    console.log('\nTest 6: Login with invalid credentials');
    try {
      const res = await makeRequest('POST', '/login', { username: 'alice', password: 'wrongpassword' });
      if (res.status === 401 && !res.body.success) {
        console.log('✅ Invalid login correctly rejected');
        console.log(`   Error: ${res.body.message}`);
        testsPassed++;
      } else { throw new Error('Invalid login was not rejected'); }
    } catch (err) { console.log('❌ Invalid login test failed:', err.message); testsFailed++; }

    console.log('\nTest 7: Logout (POST /logout)');
    try {
      const res = await makeRequest('POST', '/logout');
      if (res.status === 200 && res.body.success) {
        console.log('✅ Logout successful');
        console.log(`   Message: ${res.body.message}`);
        testsPassed++;
      } else { throw new Error('Logout failed'); }
    } catch (err) { console.log('❌ Logout test failed:', err.message); testsFailed++; }

    console.log('\nTest 8: Access protected route after logout');
    try {
      const res = await makeRequest('GET', '/profile');
      if (res.status === 401) {
        console.log('✅ Protected route correctly blocked after logout');
        console.log(`   Error: ${res.body.error}`);
        testsPassed++;
      } else { throw new Error('Should not be able to access protected route'); }
    } catch (err) { console.log('❌ Post-logout access test failed:', err.message); testsFailed++; }

    console.log('\nTest 9: Get available routes (GET /routes)');
    try {
      const res = await makeRequest('GET', '/routes');
      if (res.status === 200 && res.body.routes) {
        console.log(`✅ Retrieved ${res.body.routes.length} available routes`);
        testsPassed++;
      } else { throw new Error('Failed to get routes'); }
    } catch (err) { console.log('❌ Routes test failed:', err.message); testsFailed++; }

    console.log('\nTest 10: 404 Not Found (GET /invalid-route)');
    try {
      const res = await makeRequest('GET', '/invalid-route');
      if (res.status === 404) {
        console.log('✅ 404 error correctly returned');
        console.log(`   Error: ${res.body.error}`);
        testsPassed++;
      } else { throw new Error('Should return 404'); }
    } catch (err) { console.log('❌ 404 test failed:', err.message); testsFailed++; }

  } catch (err) {
    console.error('Test suite error:', err);
  }

  console.log('\n================================');
  console.log('📊 Test Results');
  console.log('================================');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
  console.log('================================\n');

  process.exit(testsFailed > 0 ? 1 : 0);
}

console.log('⏳ Starting tests...');
console.log('Make sure the server is running on http://localhost:3000\n');

setTimeout(runTests, 1000);
