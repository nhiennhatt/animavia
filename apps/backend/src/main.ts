import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ResponseInterceptor } from './utils/common/interceptors';
import {
  EveryExceptionFilter,
  HttpExceptionFilter,
} from './utils/common/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new EveryExceptionFilter(), new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
