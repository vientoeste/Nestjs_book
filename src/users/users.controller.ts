import {
  Body, Controller, DefaultValuePipe, Delete, Get, Headers, HttpCode, NotFoundException, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, Res, UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { ValidationPipe } from 'src/validation.pipe';
import { AuthGuard } from 'src/auth.guard';
import { AuthService } from 'src/auth/auth.service';

// [TODO] add service logic and res for each endpoints
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Get()
  async findAll(
    @Query('offset', new DefaultValuePipe(0), ValidationPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return;
  }

  @HttpCode(201)
  @Post()
  async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
    return;
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:userUuid')
  async getUserInfo(@Param('userUuid', new ParseUUIDPipe({ errorHttpStatusCode: 406 })) userUuid: string,
    @Headers() headers: Headers & { Authorization: string }): Promise<UserInfo> {
    const { Authorization: token } = headers;
    this.authService.verify(token);

    return await this.usersService.getUserInfo(userUuid);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete('/:userUuid')
  async remove(
    @Param('userUuid', new ParseUUIDPipe({ errorHttpStatusCode: 406 })) userUuid: string,
  ) {
    await this.usersService.remove(userUuid).then((isRemoved) => {
      if (!isRemoved) {
        throw new NotFoundException('user not found');
      }
    });
  }
}
