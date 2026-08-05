import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

export const mailerProvider: Provider = {
  provide: 'MAILER',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    createTransport({
      host: configService.get('SMTP_HOST'),
      port: parseInt(configService.get('SMTP_PORT', '465')),
      secure: true,
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    }),
};
