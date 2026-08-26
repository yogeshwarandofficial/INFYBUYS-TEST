import * as http from 'http';
import { PrismaClient, Role, ListingType, ListingStatus } from './dist/generated/prisma/client.js';
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
    const ts = Date.now();
    const applicantEmail = `onboarding_applicant_${ts}@example.com`;
    const adminEmail = `onboarding_admin_${ts}@example.com`;

    console.log('--- Setup: Creating Users ---');
    // Normal User (BUYER)
    const regApplicant = await request('POST', '/auth/register', { name: 'Seller Applicant', email: applicantEmail, password: 'password123' });
    const applicantId = regApplicant.data.id;
    const applicantLogin = await request('POST', '/auth/login', { email: applicantEmail, password: 'password123' });
    const applicantToken = applicantLogin.data.accessToken;

    // Admin
    const regAdmin = await request('POST', '/auth/register', { name: 'Onboarding Admin', email: adminEmail, password: 'password123' });
    await prisma.user.update({ where: { id: regAdmin.data.id }, data: { roles: [Role.ADMIN] } });
    const adminLogin = await request('POST', '/auth/login', { email: adminEmail, password: 'password123' });
    const adminToken = adminLogin.data.accessToken;

    console.log('--- Test 1: User tries to use normal seller API -> 403 Forbidden ---');
    const listingPayload = {
      type: ListingType.SALE, category: 'Tech', title: 'StartUp XYZ', description: 'Test', priceOrRent: 50000, locationArea: 'NY', locationPostcode: '10001'
    };
    const resListingBlock = await request('POST', '/listings', listingPayload, { Authorization: `Bearer ${applicantToken}` });
    if (resListingBlock.status !== 403) throw new Error(`Expected 403 Forbidden, got ${resListingBlock.status}`);

    console.log('--- Test 2: User starts onboarding application -> DRAFT ---');
    const resApply = await request('POST', '/seller/apply', listingPayload, { Authorization: `Bearer ${applicantToken}` });
    if (resApply.status !== 201) throw new Error(`Onboarding start failed: ${resApply.status}`);
    const listingId = resApply.data.id;
    if (resApply.data.status !== ListingStatus.DRAFT) throw new Error(`Expected DRAFT, got ${resApply.data.status}`);

    console.log('--- Test 3: User tries to start another onboarding application -> 409 Conflict ---');
    const resApplyDuplicate = await request('POST', '/seller/apply', listingPayload, { Authorization: `Bearer ${applicantToken}` });
    if (resApplyDuplicate.status !== 409) throw new Error(`Expected 409 Conflict for duplicate application, got ${resApplyDuplicate.status}`);

    console.log('--- Test 4: User updates onboarding application ---');
    const resUpdate = await request('PATCH', `/seller/apply/${listingId}`, { description: 'Updated desc' }, { Authorization: `Bearer ${applicantToken}` });
    if (resUpdate.status !== 200) throw new Error(`Onboarding update failed: ${resUpdate.status}`);

    console.log('--- Test 5: Submit for review ---');
    const resSubmit = await request('POST', `/seller/apply/${listingId}/submit`, null, { Authorization: `Bearer ${applicantToken}` });
    if (resSubmit.status !== 201) throw new Error(`Submit for review failed: ${resSubmit.status}`);
    if (resSubmit.data.status !== ListingStatus.SUBMITTED_FOR_REVIEW) throw new Error(`Expected SUBMITTED_FOR_REVIEW, got ${resSubmit.data.status}`);

    console.log('--- Test 6: Verify public search cannot see it ---');
    const resSearch = await request('GET', `/listings?status=SUBMITTED_FOR_REVIEW`);
    const foundInSearch = resSearch.data.data.find(l => l.id === listingId);
    if (foundInSearch) throw new Error(`Public search should not return unapproved listing`);

    console.log('--- Test 7: Verify Admin search can see it ---');
    const resAdminSearch = await request('GET', `/listings/admin/search?status=SUBMITTED_FOR_REVIEW`, null, { Authorization: `Bearer ${adminToken}` });
    const foundInAdminSearch = resAdminSearch.data.data.find(l => l.id === listingId);
    if (!foundInAdminSearch) throw new Error(`Admin search should return the listing`);

    console.log('--- Test 8: Admin approves listing -> PUBLISHED & User gets SELLER role ---');
    const resApprove = await request('POST', `/listings/${listingId}/approve`, null, { Authorization: `Bearer ${adminToken}` });
    if (resApprove.status !== 201) throw new Error(`Admin approve failed: ${resApprove.status}`);
    
    // Fetch user to verify roles
    const userAfterApprove = await prisma.user.findUnique({ where: { id: applicantId } });
    if (!userAfterApprove.roles.includes(Role.SELLER)) throw new Error('User did not receive SELLER role');
    if (!userAfterApprove.roles.includes(Role.BUYER)) throw new Error('User lost BUYER role');

    console.log('--- Test 9: Approved seller can now use normal /listings APIs ---');
    // We need to re-login to get the new role in JWT!
    const newApplicantLogin = await request('POST', '/auth/login', { email: applicantEmail, password: 'password123' });
    const newApplicantToken = newApplicantLogin.data.accessToken;

    const resListingAllow = await request('POST', '/listings', listingPayload, { Authorization: `Bearer ${newApplicantToken}` });
    if (resListingAllow.status !== 201) throw new Error(`Expected successful listing creation as SELLER, got ${resListingAllow.status}`);

    console.log('--- Test 10: Approved seller cannot use /seller/apply again ---');
    const resApplyBlock = await request('POST', '/seller/apply', listingPayload, { Authorization: `Bearer ${newApplicantToken}` });
    if (resApplyBlock.status !== 403) throw new Error(`Expected 403 Forbidden for existing seller applying again, got ${resApplyBlock.status}`);

    console.log('\n✅ All Seller Onboarding Tests Passed Successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
