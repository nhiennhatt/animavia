import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ResponseInterceptor } from './utils/common/interceptors';
import {
  EveryExceptionFilter,
  HttpExceptionFilter,
} from './utils/common/exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function getSwaggerConfig() {
  return new DocumentBuilder().setTitle('Pneuma API').setVersion('1.0').build();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new EveryExceptionFilter(), new HttpExceptionFilter());

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, getSwaggerConfig()),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
