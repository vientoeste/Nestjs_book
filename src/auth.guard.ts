import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateReq(req);
  }

  private validateReq(req: Request) {
    const token: string = req.headers.Authorization[0] ?? req.headers.Authorization as string;
    if (!token) {
      throw new BadRequestException('token not found');
    }

    this.authService.verify(token);

    return true;
  }
}