import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload, decode, sign, verify } from 'jsonwebtoken';

interface User {
  uuid: string,
  name: string,
  email: string,
}
@Injectable()
export class AuthService {
  login(user: User) {
    const payload = { name: user.name, email: user.email };

    const token = sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
      audience: user.uuid,
      issuer: process.env.JWT_ISS
    });

    return token;
  }

  verify(jwtToken: string) {
    try {
      const payload = verify(jwtToken, 'este') as (JwtPayload | string) & User;
      const { uuid, email } = payload;

      return {
        userUuid: uuid,
        email,
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}