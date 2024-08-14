import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntFieldsPipe implements PipeTransform {
  constructor(private readonly fieldNames: string[]) {}

  transform(value: any) {
    this.fieldNames.forEach((fieldName) => {
      const fieldValue = value[fieldName];

      // Check if the field exists and is not null or undefined
      if (fieldValue !== undefined && fieldValue !== null) {
        const parsedValue = parseInt(fieldValue, 10);

        if (isNaN(parsedValue)) {
          throw new BadRequestException(`${fieldName} must be an integer`);
        }

        value[fieldName] = parsedValue;
      }
    });
    return value;
  }
}
