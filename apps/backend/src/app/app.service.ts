import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}
  getHello() {
    this.clientProxy.emit('registration-otp', {
      email: 'hiennhatt1804@gmail.com',
    });
    return 'Hello World!';
  }
}
