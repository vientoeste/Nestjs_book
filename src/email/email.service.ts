import { Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_ADDR,
        pass: process.env.MAIL_PW,
      }
    })
  }

  async sendMemberJoinVerification(addr: string, signupVerifyToken: string) {
    const baseUrl = process.env.BASE_URL;
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
