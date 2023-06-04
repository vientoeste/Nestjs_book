import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.toValidate(metatype)) {
      return value;
    }
    const validationErrors = await validate(plainToClass(metatype, value));
    if (validationErrors.length === 0) {
      return value;
    } else {
      throw new BadRequestException('validation failed');
    }
  }

  private toValidate(metatype: unknown): boolean {
    // return !types.includes(metatype)
    const types = ['string', 'boolean', 'number', 'object'];

    return types.includes(typeof metatype) || Array.isArray(metatype);
  }
}