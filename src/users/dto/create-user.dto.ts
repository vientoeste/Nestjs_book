import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @Transform(arg => arg.value.trim())
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @Transform(({ value, obj }) => {
    const { password, name } = obj;
    if ((String(password)).includes(name.trim())) {
      throw new BadRequestException('password cannot contain username');
    }
    return value;
  })
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  readonly password: string;
}