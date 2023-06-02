import { Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    private configService: ConfigService,
  ) {
    const mailAddr = this.configService.get('MAIL_ADDR');
    const mailPW = this.configService.get('MAIL_PW')
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: mailAddr,
        pass: mailPW,
      }
    })
  }

  async sendMemberJoinVerification(addr: string, signupVerifyToken: string) {
    const baseUrl = this.configService.get('BASE_URL');
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: addr,
      subject: '가입 인증 메일',
      html: `
가입 확인 버튼을 누르시면 가입 인증이 완료됩니다.<br />
<form action="${url}" method="POST">
  <button>가입 확인</button>
</form>`
    }

    return await this.transporter.sendMail(mailOptions);
  }
}
