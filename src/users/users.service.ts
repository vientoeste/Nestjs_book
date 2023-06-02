import { Injectable } from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import { v5 } from 'uuid';
import { UserInfo } from "./UserInfo";

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) { }

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = v5(email.concat(new Date().toISOString()), process.env.NAMESPACE_UUID);

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string) {
    // [TODO] must be implemented after connect DB
    return false;
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    // [TODO] must be implemented after connect DB
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // [TODO] must be implemented after DB/JWT
    throw new Error('method not implemented');
  }

  async login(email: string, password: string): Promise<string> {
    // [TODO] must be implemented after DB
    throw new Error('method not implemented');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    // [TODO] must be implemented after DB
    throw new Error('method not implemented');
  }

  remove(id: number) {
    return 'This action removs a user(id)';
  }
}