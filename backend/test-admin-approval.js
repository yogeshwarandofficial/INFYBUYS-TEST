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
    const applicantEmail = `approval_applicant_${ts}@example.com`;
    const applicant2Email = `approval_applicant2_${ts}@example.com`;
    const adminEmail = `approval_admin_${ts}@example.com`;

    console.log('--- Setup: Creating Users ---');
    // Normal User 1 (BUYER)
    const regApplicant = await request('POST', '/auth/register', { name: 'Seller Applicant', email: applicantEmail, password: 'password123' });
    const applicantId = regApplicant.data.id;
    const applicantLogin = await request('POST', '/auth/login', { email: applicantEmail, password: 'password123' });
    const applicantToken = applicantLogin.data.accessToken;

    // Normal User 2 (BUYER)
    const regApplicant2 = await request('POST', '/auth/register', { name: 'Seller Applicant 2', email: applicant2Email, password: 'password123' });
    const applicant2Id = regApplicant2.data.id;
    const applicant2Login = await request('POST', '/auth/login', { email: applicant2Email, password: 'password123' });
    const applicant2Token = applicant2Login.data.accessToken;

    // Admin
    const regAdmin = await request('POST', '/auth/register', { name: 'Onboarding Admin', email: adminEmail, password: 'password123' });
    await prisma.user.update({ where: { id: regAdmin.data.id }, data: { roles: [Role.ADMIN, Role.BUYER] } });
    const adminLogin = await request('POST', '/auth/login', { email: adminEmail, password: 'password123' });
    const adminToken = adminLogin.data.accessToken;

    console.log('--- Test 1: User creates DRAFT listing ---');
    const listingPayload = {
      type: ListingType.SALE, category: 'Tech', title: 'StartUp XYZ', description: 'Test', priceOrRent: 50000, locationArea: 'NY', locationPostcode: '10001'
    };
    const resListing = await request('POST', '/listings', listingPayload, { Authorization: `Bearer ${applicantToken}` });
    if (resListing.status !== 201) throw new Error(`Expected 201, got ${resListing.status}`);
    const listingId = resListing.data.id;
    if (resListing.data.status !== ListingStatus.DRAFT) throw new Error(`Expected DRAFT, got ${resListing.data.status}`);

    console.log('--- Test 2: User submits DRAFT listing ---');
    const resSubmit = await request('POST', `/listings/${listingId}/submit`, null, { Authorization: `Bearer ${applicantToken}` });
    if (resSubmit.status !== 201) throw new Error(`Submit for review failed: ${resSubmit.status}`);
    if (resSubmit.data.status !== ListingStatus.SUBMITTED_FOR_REVIEW) throw new Error(`Expected SUBMITTED_FOR_REVIEW, got ${resSubmit.data.status}`);

    console.log('--- Test 3: Admin approves listing -> PUBLISHED & User gets SELLER role ---');
    const resApprove = await request('POST', `/admin/listings/${listingId}/approve`, null, { Authorization: `Bearer ${adminToken}` });
    if (resApprove.status !== 201) throw new Error(`Admin approve failed: ${resApprove.status}`);
    
    // Fetch user to verify roles
    const userAfterApprove = await prisma.user.findUnique({ where: { id: applicantId } });
    if (!userAfterApprove.roles.includes(Role.SELLER)) throw new Error('User did not receive SELLER role');
    if (!userAfterApprove.roles.includes(Role.BUYER)) throw new Error('User lost BUYER role');

    console.log('--- Test 4: Try approving the same listing again -> 409 Conflict ---');
    const resApproveDuplicate = await request('POST', `/admin/listings/${listingId}/approve`, null, { Authorization: `Bearer ${adminToken}` });
    if (resApproveDuplicate.status !== 409) throw new Error(`Expected 409 Conflict, got ${resApproveDuplicate.status}`);

    console.log('--- Test 5: Reject listing workflow ---');
    const resListing2 = await request('POST', '/listings', listingPayload, { Authorization: `Bearer ${applicant2Token}` });
    const listing2Id = resListing2.data.id;
    await request('POST', `/listings/${listing2Id}/submit`, null, { Authorization: `Bearer ${applicant2Token}` });
    
    const resReject = await request('POST', `/admin/listings/${listing2Id}/reject`, { rejectionReasonCode: "INVALID_DOCUMENTS" }, { Authorization: `Bearer ${adminToken}` });
    if (resReject.status !== 201) throw new Error(`Admin reject failed: ${resReject.status}`);
    if (resReject.data.rejectionReasonCode !== "INVALID_DOCUMENTS") throw new Error('Rejection reason code not stored correctly');

    const userAfterReject = await prisma.user.findUnique({ where: { id: applicant2Id } });
    if (userAfterReject.roles.includes(Role.SELLER)) throw new Error('User erroneously received SELLER role upon rejection');
    if (!userAfterReject.roles.includes(Role.BUYER)) throw new Error('User lost BUYER role');

    console.log('--- Test 6: Auth/Role Enforcement Checks ---');
    const resAuthMissing = await request('POST', `/admin/listings/${listingId}/approve`, null, {});
    if (resAuthMissing.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${resAuthMissing.status}`);

    const resAuthBuyer = await request('POST', `/admin/listings/${listingId}/approve`, null, { Authorization: `Bearer ${applicantToken}` });
    if (resAuthBuyer.status !== 403) throw new Error(`Expected 403 Forbidden, got ${resAuthBuyer.status}`);

    const resAuthManipulateAdmin = await request('POST', `/admin/listings/${listingId}/approve`, { adminId: applicantId }, { Authorization: `Bearer ${adminToken}` });
    if (resAuthManipulateAdmin.status === 401 || resAuthManipulateAdmin.status === 403) {
      throw new Error(`Admin manipulation block failed, should have ignored body but executed request successfully or failed on logic. Got ${resAuthManipulateAdmin.status}`);
    }

    console.log('\n✅ All Admin Approval Tests Passed Successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
