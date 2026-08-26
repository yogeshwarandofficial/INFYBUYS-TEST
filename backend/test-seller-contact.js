import * as http from 'http';
import { PrismaClient, Role, ListingType, ListingStatus, SubscriptionAudience, SubscriptionStatus, BillingCycle } from './dist/generated/prisma/client.js';
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
    const applicantEmail = `seller_contact_applicant_${ts}@example.com`;
    const buyerEmail = `seller_contact_buyer_${ts}@example.com`;
    const adminEmail = `seller_contact_admin_${ts}@example.com`;

    console.log('--- Setup: Creating Users ---');
    // Normal User 1 (Applicant)
    const regApplicant = await request('POST', '/auth/register', { name: 'Seller Applicant', email: applicantEmail, password: 'password123' });
    const applicantId = regApplicant.data.id;
    const applicantLogin = await request('POST', '/auth/login', { email: applicantEmail, password: 'password123' });
    const applicantToken = applicantLogin.data.accessToken;

    // Normal User 2 (Buyer)
    const regBuyer = await request('POST', '/auth/register', { name: 'Buyer User', email: buyerEmail, password: 'password123' });
    const buyerId = regBuyer.data.id;
    const buyerLogin = await request('POST', '/auth/login', { email: buyerEmail, password: 'password123' });
    const buyerToken = buyerLogin.data.accessToken;

    // Admin
    const regAdmin = await request('POST', '/auth/register', { name: 'Onboarding Admin', email: adminEmail, password: 'password123' });
    await prisma.user.update({ where: { id: regAdmin.data.id }, data: { roles: [Role.ADMIN, Role.BUYER] } });
    const adminLogin = await request('POST', '/auth/login', { email: adminEmail, password: 'password123' });
    const adminToken = adminLogin.data.accessToken;

    console.log('--- Test C: Create DRAFT listing ---');
    const listingPayload = {
      type: ListingType.SALE, category: 'Tech', title: 'StartUp XYZ', description: 'Test', priceOrRent: 50000, locationArea: 'NY', locationPostcode: '10001', ndaRequired: true
    };
    const resListing = await request('POST', '/listings', listingPayload, { Authorization: `Bearer ${applicantToken}` });
    const listingId = resListing.data.id;

    console.log('--- Test D & E: Submit & Approve listing ---');
    await request('POST', `/listings/${listingId}/submit`, null, { Authorization: `Bearer ${applicantToken}` });
    await request('POST', `/admin/listings/${listingId}/approve`, null, { Authorization: `Bearer ${adminToken}` });

    console.log('--- Test G: Buyer attempts GET seller-contact without subscription -> 403 ---');
    const resContactNoSub = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactNoSub.status !== 403) throw new Error(`Expected 403 Forbidden without subscription, got ${resContactNoSub.status}`);

    console.log('--- Setup: Create BUYER subscription ---');
    const plan = await prisma.subscriptionPlan.create({
      data: {
        audience: SubscriptionAudience.BUYER,
        name: 'Pro Buyer',
        price: 99.99,
        billingCycle: BillingCycle.MONTHLY,
        featureLimits: {}
      }
    });

    const sub = await prisma.userSubscription.create({
      data: {
        userId: buyerId,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
      }
    });

    console.log('--- Test O: Buyer attempts GET seller-contact without NDA -> 403 ---');
    const resContactNoNda = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactNoNda.status !== 403) throw new Error(`Expected 403 Forbidden without NDA, got ${resContactNoNda.status}`);

    console.log('--- Test P: Accept NDA and retry -> 200 ---');
    await request('POST', `/listings/${listingId}/nda/accept`, null, { Authorization: `Bearer ${buyerToken}` });
    
    const resContactSuccess = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactSuccess.status !== 200) throw new Error(`Expected 200 OK after NDA, got ${resContactSuccess.status}`);
    if (!resContactSuccess.data.data.seller.email) throw new Error(`Seller email missing in contact response`);

    console.log('--- Test J & K: Verify public endpoints omit sensitive data ---');
    const resPublicGet = await request('GET', `/listings/${listingId}`);
    if (resPublicGet.data.seller && (resPublicGet.data.seller.email || resPublicGet.data.seller.phone)) {
      throw new Error(`Sensitive data leaked in GET /listings/:id`);
    }

    const resPublicSearch = await request('GET', `/listings`);
    const searchListing = resPublicSearch.data.data.find(l => l.id === listingId);
    if (searchListing && searchListing.seller && (searchListing.seller.email || searchListing.seller.phone)) {
      throw new Error(`Sensitive data leaked in GET /listings`);
    }

    console.log('--- Test L: Use CANCELLED subscription -> 403 ---');
    await prisma.userSubscription.update({ where: { id: sub.id }, data: { status: SubscriptionStatus.CANCELLED } });
    const resContactCancelled = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactCancelled.status !== 403) throw new Error(`Expected 403 Forbidden with CANCELLED subscription, got ${resContactCancelled.status}`);

    console.log('--- Test M: Use PAST_DUE subscription -> 403 ---');
    await prisma.userSubscription.update({ where: { id: sub.id }, data: { status: SubscriptionStatus.PAST_DUE } });
    const resContactPastDue = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactPastDue.status !== 403) throw new Error(`Expected 403 Forbidden with PAST_DUE subscription, got ${resContactPastDue.status}`);

    console.log('--- Test N: Use EXPIRED subscription -> 403 ---');
    await prisma.userSubscription.update({ where: { id: sub.id }, data: { status: SubscriptionStatus.EXPIRED } });
    const resContactExpiredStatus = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactExpiredStatus.status !== 403) throw new Error(`Expected 403 Forbidden with EXPIRED subscription, got ${resContactExpiredStatus.status}`);

    console.log('--- Test P: Test ACTIVE subscription with expired renewalDate -> 403 ---');
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // 1 day in the past
    await prisma.userSubscription.update({ where: { id: sub.id }, data: { status: SubscriptionStatus.ACTIVE, renewalDate: pastDate } });
    const resContactExpiredDate = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactExpiredDate.status !== 403) throw new Error(`Expected 403 Forbidden with ACTIVE but expired renewalDate, got ${resContactExpiredDate.status}`);

    console.log('--- Test Q: Set subscription back to ACTIVE and future renewalDate -> 200 ---');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // 30 days in the future
    await prisma.userSubscription.update({ where: { id: sub.id }, data: { status: SubscriptionStatus.ACTIVE, renewalDate: futureDate } });
    const resContactReactivated = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${buyerToken}` });
    if (resContactReactivated.status !== 200) throw new Error(`Expected 200 OK after reactivating, got ${resContactReactivated.status}`);

    console.log('--- Test T: Seller attempts to access their own listing through seller-contact -> 403 ---');
    // First give seller a subscription just to pass the guard
    await prisma.userSubscription.create({
      data: { userId: applicantId, planId: plan.id, status: SubscriptionStatus.ACTIVE }
    });
    const resContactOwner = await request('GET', `/listings/${listingId}/seller-contact`, null, { Authorization: `Bearer ${applicantToken}` });
    if (resContactOwner.status !== 403) throw new Error(`Expected 403 Forbidden for owner, got ${resContactOwner.status}`);

    console.log('\n✅ All Seller Contact Tests Passed Successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
