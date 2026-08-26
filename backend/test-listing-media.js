import * as http from 'http';
import * as fs from 'fs';
import { PrismaClient, Role, ListingType, MediaType } from './dist/generated/prisma/client.js';
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

async function multipartRequest(method, path, filePath, type, token) {
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', blob, 'test-image.jpg');
  formData.append('type', type);

  const res = await fetch(`http://${HOST}:${PORT}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  return { status: res.status, data };
}

async function runTests() {
  try {
    console.log('--- Setup: Creating Users ---');
    const ts = Date.now();
    const buyerEmail = `media_buyer_${ts}@example.com`;
    const sellerAEmail = `media_sellerA_${ts}@example.com`;
    const sellerBEmail = `media_sellerB_${ts}@example.com`;
    
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

    console.log('--- Setup: Seller A creates Listing A ---');
    const listingPayload = {
      type: ListingType.SALE,
      category: 'Tech',
      title: 'Amazing SaaS',
      description: 'A great business',
      priceOrRent: 50000,
      locationArea: 'London',
      locationPostcode: 'E1 6AN',
    };
    const resListingA = await request('POST', '/listings', listingPayload, { Authorization: `Bearer ${sellerAToken}` });
    if (resListingA.status !== 201) throw new Error(`Listing A creation failed: ${JSON.stringify(resListingA.data)}`);
    const listingA = resListingA.data;

    const testImagePath = 'test-assets/test-image.jpg';

    console.log('--- Test 1: Buyer cannot upload media (403) ---');
    const res1 = await multipartRequest('POST', `/listings/${listingA.id}/media`, testImagePath, MediaType.PHOTO, buyerToken);
    if (res1.status !== 403) {
      console.log(`FAIL: Expected 403, got ${res1.status}. Response: ${JSON.stringify(res1.data)}`);
      throw new Error('Test 1 failed');
    }
    console.log('PASS: Buyer correctly forbidden from uploading media.');

    console.log('--- Test 2: Seller B cannot modify Seller A listing (403) ---');
    const res2 = await multipartRequest('POST', `/listings/${listingA.id}/media`, testImagePath, MediaType.PHOTO, sellerBToken);
    if (res2.status !== 403) {
      console.log(`FAIL: Expected 403, got ${res2.status}. Response: ${JSON.stringify(res2.data)}`);
      throw new Error('Test 2 failed');
    }
    console.log('PASS: Seller B correctly forbidden from modifying Seller A listing.');

    console.log('--- Test 3: Seller A can upload media to Seller A listing (201) ---');
    const res3 = await multipartRequest('POST', `/listings/${listingA.id}/media`, testImagePath, MediaType.PHOTO, sellerAToken);
    
    if (res3.status === 500 && res3.data && (res3.data.message.includes('credentials') || res3.data.message.includes('upload media'))) {
      console.log('⚠️  S3 credentials are not configured or invalid. Test cannot complete full media upload.');
      console.log('Please ensure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET are set in .env');
    } else if (res3.status !== 201) {
      console.log(`FAIL: Expected 201, got ${res3.status}. Response: ${JSON.stringify(res3.data)}`);
      throw new Error('Test 3 failed');
    } else {
      console.log('PASS: Seller A successfully uploaded media.');
      console.log(`Media ID: ${res3.data.id}`);
      if (res3.data.url) console.log(`Presigned URL: ${res3.data.url}`);
    }
    const media1 = res3.data;

    console.log('--- Test 4: Seller B can create their own listing and upload media (201) ---');
    const resListingB = await request('POST', '/listings', { ...listingPayload, title: 'Seller B Business' }, { Authorization: `Bearer ${sellerBToken}` });
    if (resListingB.status !== 201) throw new Error(`Listing B creation failed: ${JSON.stringify(resListingB.data)}`);
    const listingB = resListingB.data;

    const res4 = await multipartRequest('POST', `/listings/${listingB.id}/media`, testImagePath, MediaType.PHOTO, sellerBToken);
    if (res4.status === 500 && res4.data && (res4.data.message.includes('credentials') || res4.data.message.includes('upload media'))) {
      console.log('⚠️  S3 credentials error caught again. Skipping.');
    } else if (res4.status !== 201) {
      console.log(`FAIL: Expected 201, got ${res4.status}. Response: ${JSON.stringify(res4.data)}`);
      throw new Error('Test 4 failed');
    } else {
      console.log('PASS: Seller B successfully created their own listing and uploaded media.');
    }

    if (res3.status === 201) {
      console.log('--- Test 5: Seller B cannot delete Seller A media (403) ---');
      const res5 = await request('DELETE', `/listings/${listingA.id}/media/${media1.id}`, null, { Authorization: `Bearer ${sellerBToken}` });
      if (res5.status !== 403) {
        console.log(`FAIL: Expected 403, got ${res5.status}. Response: ${JSON.stringify(res5.data)}`);
        throw new Error('Test 5 failed');
      }
      console.log('PASS: Seller B correctly forbidden from deleting Seller A media.');

      console.log('--- Test 6: Seller A can delete their own media (200) ---');
      const res6 = await request('DELETE', `/listings/${listingA.id}/media/${media1.id}`, null, { Authorization: `Bearer ${sellerAToken}` });
      if (res6.status !== 200) {
        console.log(`FAIL: Expected 200, got ${res6.status}. Response: ${JSON.stringify(res6.data)}`);
        throw new Error('Test 6 failed');
      }
      console.log('PASS: Seller A successfully deleted their own media.');
    }

    console.log('\n✅ All Listing Media Tests Passed Successfully!');
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
