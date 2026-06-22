import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for testing with frontend
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://www-healthsync.vercel.app"
    ],
    credentials: true,
  });

  // for entity validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
  * You can enable the seeding here
  * TODO: Remove this in production
  */
  // to create fake dummy data on each run
  // const seedService = app.get(SeedService);
  // await seedService.seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
