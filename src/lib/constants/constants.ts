import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
} as const;

export const DEFAULT_PAGE_SIZE = {
  PART: 10,
} as const satisfies Record<string, number>;

export const BATCH_SIZE = 1000;

export const SALT_OR_ROUNDS = 10;
