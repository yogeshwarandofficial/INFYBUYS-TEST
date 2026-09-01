import * as http from 'http';
import { PrismaClient, Role, SubscriptionAudience, SubscriptionStatus, ListingType } from './dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const PORT = 3000;
const HOST = '127.0.0.1';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
  try {
    console.log('--- Setup: Creating Users ---');
    const ts = Date.now();
    const buyerEmail = `buyer_${ts}@example.com`;
    const sellerAEmail = `sellerA_${ts}@example.com`;
    const sellerBEmail = `sellerB_${ts}@example.com`;
    
    const regBuyer = await request('POST', '/auth/register', { name: 'Buyer', email: buyerEmail, password: 'password123' });
    const regSellerA = await request('POST', '/auth/register', { name: 'Seller A', email: sellerAEmail, password: 'password123' });
    const regSellerB = await request('POST', '/auth/register', { name: 'Seller B', email: sellerBEmail, password: 'password123' });

    if (regBuyer.status !== 201) throw new Error(`Buyer reg failed: ${JSON.stringify(regBuyer.data)}`);
    if (regSellerA.status !== 201) throw new Error(`Seller A reg failed: ${JSON.stringify(regSellerA.data)}`);
    if (regSellerB.status !== 201) throw new Error(`Seller B reg failed: ${JSON.stringify(regSellerB.data)}`);

    // Set roles
    await prisma.user.update({ where: { id: regBuyer.data.id }, data: { roles: [Role.BUYER] } });
    await prisma.user.update({ where: { id: regSellerA.data.id }, data: { roles: [Role.SELLER] } });
    await prisma.user.update({ where: { id: regSellerB.data.id }, data: { roles: [Role.SELLER] } });

    const buyerLogin = await request('POST', '/auth/login', { email: buyerEmail, password: 'password123' });
    const sellerALogin = await request('POST', '/auth/login', { email: sellerAEmail, password: 'password123' });
    const sellerBLogin = await request('POST', '/auth/login', { email: sellerBEmail, password: 'password123' });
    
    const buyerToken = buyerLogin.data.accessToken;
    const sellerAToken = sellerALogin.data.accessToken;
    const sellerBToken = sellerBLogin.data.accessToken;
    const buyerUserId = buyerLogin.data.user.id;

    console.log('\n--- Test A: No JWT -> protected listing endpoint (401) ---');
    const resA = await request('POST', '/listings');
    if (resA.status !== 401) throw new Error(`Expected 401, got ${resA.status}`);

    console.log('--- Test B: BUYER attempts POST /listings (403) ---');
    const resB = await request('POST', '/listings', {}, { Authorization: `Bearer ${buyerToken}` });
    if (resB.status !== 403) throw new Error(`Expected 403, got ${resB.status}`);

    console.log('--- Test C: SELLER A creates listing (201) ---');
    const listingPayload = {
      type: ListingType.SALE,
      category: 'Tech',
      title: 'Amazing SaaS',
      description: 'A great business',
      priceOrRent: 50000,
      locationArea: 'London',
      locationPostcode: 'E1 6AN',
      ndaRequired: true
    };
    const resC = await request('POST', '/listings', listingPayload, { Authorization: `Bearer ${sellerAToken}` });
    if (resC.status !== 201) throw new Error(`Expected 201, got ${resC.status}`);
    const listingA = resC.data;

    console.log('--- Test D: sellerId is taken from JWT, not request body ---');
    // Ensure listingA.sellerId equals sellerALogin.data.user.id
    if (listingA.sellerId !== sellerALogin.data.user.id) throw new Error('Seller ID mismatch');

    console.log('--- Test E: Seller B attempts to update Seller A listing (403) ---');
    const resE = await request('PATCH', `/listings/${listingA.id}`, { title: 'Hacked' }, { Authorization: `Bearer ${sellerBToken}` });
    if (resE.status !== 403) throw new Error(`Expected 403, got ${resE.status}`);

    console.log('--- Test F: Seller A can update Seller A listing (200) ---');
    const resF = await request('PATCH', `/listings/${listingA.id}`, { title: 'Updated SaaS' }, { Authorization: `Bearer ${sellerAToken}` });
    if (resF.status !== 200) throw new Error(`Expected 200, got ${resF.status}`);
    if (resF.data.title !== 'Updated SaaS') throw new Error('Update failed');

    console.log('--- Test G: DRAFT listing is not publicly visible via search ---');
    const resG = await request('GET', '/listings');
    const foundG = resG.data.data.find(l => l.id === listingA.id);
    if (foundG) throw new Error('Draft listing should not be in public search');

    console.log('--- Test J: Seller cannot arbitrarily change status to PUBLISHED via PATCH ---');
    // Status is not in UpdateListingDto
    const resJ = await request('PATCH', `/listings/${listingA.id}`, { status: 'PUBLISHED' }, { Authorization: `Bearer ${sellerAToken}` });
    // In NestJS, properties not in DTO might be stripped or ignored, but it definitely shouldn't change the status.
    const getJ = await request('GET', `/listings/${listingA.id}`);
    if (getJ.data.status === 'PUBLISHED') throw new Error('Seller changed status via PATCH');

    console.log('--- Test K: Valid workflow transition (DRAFT -> SUBMITTED) (201/200) ---');
    const resK = await request('POST', `/listings/${listingA.id}/submit`, {}, { Authorization: `Bearer ${sellerAToken}` });
    if (![200, 201].includes(resK.status)) throw new Error(`Expected success, got ${resK.status}`);
    if (resK.data.status !== 'SUBMITTED_FOR_REVIEW') throw new Error(`Expected SUBMITTED_FOR_REVIEW, got ${resK.data.status}`);

    console.log('--- Test L: Invalid workflow transition is rejected (409) ---');
    // It's already SUBMITTED, cannot submit again
    const resL = await request('POST', `/listings/${listingA.id}/submit`, {}, { Authorization: `Bearer ${sellerAToken}` });
    if (resL.status !== 409) throw new Error(`Expected 409, got ${resL.status}`);

    console.log('--- Setup: Force PUBLISH listing directly via DB for testing ---');
    await prisma.listing.update({ where: { id: listingA.id }, data: { status: 'PUBLISHED' } });

    console.log('--- Test H: PUBLISHED listing is publicly visible ---');
    console.log('--- Test I: Listing search returns appropriate published listings ---');
    const resH = await request('GET', '/listings');
    const foundH = resH.data.data.find(l => l.id === listingA.id);
    if (!foundH) throw new Error('Published listing not found in search');

    console.log('--- Test O: Buyer can accept NDA ---');
    const resO = await request('POST', `/listings/${listingA.id}/nda/accept`, {}, { Authorization: `Bearer ${buyerToken}` });
    if (![200, 201].includes(resO.status)) throw new Error(`Expected success, got ${resO.status}`);

    console.log('--- Test P: Duplicate NDA acceptance handled safely ---');
    const resP = await request('POST', `/listings/${listingA.id}/nda/accept`, {}, { Authorization: `Bearer ${buyerToken}` });
    if (![200, 201].includes(resP.status)) throw new Error(`Expected success, got ${resP.status}`);

    console.log('--- Test Q: Seller cannot accept NDA as buyer ---');
    const resQ = await request('POST', `/listings/${listingA.id}/nda/accept`, {}, { Authorization: `Bearer ${sellerAToken}` });
    if (resQ.status !== 403) throw new Error(`Expected 403, got ${resQ.status}`);

    console.log('--- Test R: Response does not expose passwordHash ---');
    const resR = await request('GET', `/listings/${listingA.id}`);
    if (resR.data.seller && resR.data.seller.passwordHash) throw new Error('passwordHash exposed!');

    console.log('--- Test S: Response does not expose seller email/phone ---');
    if (resR.data.seller && (resR.data.seller.email || resR.data.seller.phone)) throw new Error('Email/phone exposed in normal response!');

    console.log('--- Test T: IDOR check on submit ---');
    const resT = await request('POST', `/listings/${listingA.id}/submit`, {}, { Authorization: `Bearer ${sellerBToken}` });
    if (resT.status !== 403) throw new Error(`Expected 403, got ${resT.status}`);

    console.log('--- Test U-AA: Existing systems regression check ---');
    const resU = await request('GET', '/users/me', null, { Authorization: `Bearer ${buyerToken}` });
    if (resU.status !== 200) throw new Error(`Regression: /users/me failed`);

    const resW = await request('POST', '/auth/refresh', { refreshToken: buyerLogin.data.refreshToken });
    if (resW.status !== 200) throw new Error(`Regression: /auth/refresh failed`);

    const resZ = await request('GET', '/auth/test/buyer', null, { Authorization: `Bearer ${buyerToken}` });
    if (resZ.status !== 200) throw new Error(`Regression: RBAC test failed`);

    console.log('\n✅ All Tests Passed Successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
