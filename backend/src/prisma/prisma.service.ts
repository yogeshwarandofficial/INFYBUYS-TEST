import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      // This guard is a safety net. The primary check is in main.ts validateEnv().
      // If PrismaService is ever instantiated outside the normal bootstrap
      // (e.g. in a seed script or test), this provides a clear failure message.
      throw new Error(
        'DATABASE_URL environment variable is not set. ' +
          'Please configure it in your .env file.',
      );
    }

    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }
}
