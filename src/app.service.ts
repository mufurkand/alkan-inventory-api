import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'No service is provided in the root path. Please check the documentation for the available routes.';
  }
}
