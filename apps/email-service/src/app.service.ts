import { Inject, Injectable, Logger } from '@nestjs/common';
import { loadTemplate } from './utils/load-template';
import { type Transporter } from 'nodemailer';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(@Inject('MAILER') private readonly mailer: Transporter) {}

  async sendOtp(email: string, otp: string) {
    const result = await loadTemplate('registration-otp', { otp });
    await this.mailer.sendMail({
      from: '"No Reply" <hiennhatt1804@gmail.com>',
      to: email,
      subject: 'PAXORA | Registration OTP',
      html: result,
    });
  }
}
