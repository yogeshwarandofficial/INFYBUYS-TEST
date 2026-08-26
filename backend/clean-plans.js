import { PrismaClient } from './generated/prisma/client.js';

const prisma = new PrismaClient();

async function run() {
  const plans = await prisma.subscriptionPlan.findMany();
  for (const plan of plans) {
    if (plan.price === 99 || plan.price === 99.99 || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plan.id)) {
      console.log('Deleting', plan.id, plan.price);
      try {
          await prisma.subscriptionPlan.delete({ where: { id: plan.id } });
      } catch (e) {
          console.error(e);
      }
    }
  }
  console.log('Done');
}

run().then(()=>process.exit(0)).catch(e => { console.error(e); process.exit(1); });
