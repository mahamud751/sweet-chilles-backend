import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Savasaachi Growth Engine API')
    .setDescription(
      'Hospitality growth platform — competitions, loyalty vouchers, Gold membership, owner dashboard. White-label per restaurant slug.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Restaurants', 'White-label branding')
    .addTag('Auth', 'Member & staff authentication')
    .addTag('Vouchers', 'Wallet & QR redemption')
    .addTag('Competitions', 'Phase 1 acquisition')
    .addTag('Dashboard', 'Owner analytics')
    .addTag('Campaigns', 'AI-style automated engagement')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`Growth Engine API: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
