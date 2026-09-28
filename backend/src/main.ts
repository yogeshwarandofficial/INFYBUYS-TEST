import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

// ---------------------------------------------------------------------------
// Startup environment validation
// Fail fast with a clear message rather than silently misbehaving at runtime.
// ---------------------------------------------------------------------------
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
];

function validateEnv(): void {
  const logger = new Logger('Bootstrap');
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    logger.error(
      `FATAL: Missing required environment variables: ${missing.join(', ')}. ` +
        'Please check your .env file.',
    );
    process.exit(1);
  }
}

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);

  // -------------------------------------------------------------------------
  // CORS
  // In production, the frontend origin is read from FRONTEND_URL.
  // Supports comma-separated list of origins for multi-domain setups.
  // Defaults to localhost:5173 for local development.
  // -------------------------------------------------------------------------
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
    : ['http://localhost:5173'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // -------------------------------------------------------------------------
  // Global pipes
  // -------------------------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on port ${port}`);
  logger.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
}

bootstrap();
