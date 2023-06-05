import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import { v5 } from 'uuid';
import { UserInfo } from "./UserInfo";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) { }

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email, name);

    const signupVerifyToken = v5(email.concat(new Date().toISOString()), process.env.NAMESPACE_UUID);

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string, name: string) {
    const userInfo = await this.usersRepository.find({
      where: [{ email }, { name }],
    });
    if (userInfo.length !== 0) {
      throw new UnprocessableEntityException(`duplicate ${userInfo[0].email === email ? 'email' : 'name'}`);
    }
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.checkUserExists(email, name);

    const user = new UserEntity();
    user.uuid = v5(name, process.env.NAMESPACE_UUID);
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
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

  async getUserInfo(uuid: string): Promise<UserInfo> {
    const userInfo = await this.usersRepository.findOne({
      where: { uuid },
    });
    return userInfo;
  }

  async remove(uuid: string) {
    const res = await this.usersRepository.delete({ uuid });
    if (res.affected !== 1) {
      return false;
    }
    return true;
  }
}