import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ValidationPipe } from './pipes/validation.pipe';
import { readFileSync } from 'fs';

async function start() {
  const PORT = process.env.PORT || 5000;
  const keyFile = readFileSync(
    '../www/number.apiuser.ru/sert/number_apiuser_ru.key',
  );
  const certFile = readFileSync(
    '../www/number.apiuser.ru/sert/number_apiuser_ru.crt',
  );

  const app = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions: {
      key: keyFile,
      cert: certFile,

    },
  });

  const config = new DocumentBuilder()
    .setTitle('Тестовое задание для компании')
    .setDescription('Документация REST API')
    .setVersion('0.0.1')
    .addTag('And Romanov')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  await app.listen(PORT, async () => {
    const url = await app.getUrl();
    console.log(`Server started on port = ${PORT}`);
    console.log(url);
  });
}

start();
