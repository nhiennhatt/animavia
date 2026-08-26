import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ResponseInterceptor } from './utils/common/interceptors';
import {
  EveryExceptionFilter,
  HttpExceptionFilter,
} from './utils/common/exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Animavia API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new EveryExceptionFilter(), new HttpExceptionFilter());
  app.use(helmet({}));
  app.use(compression());
  app.enableCors({
    origin: 'http://localhost:3303',
  });

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, getSwaggerConfig()),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
