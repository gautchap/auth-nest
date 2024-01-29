import { Injectable } from '@nestjs/common';
import { createTestAccount, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private async transporter() {
    const account = await createTestAccount();
    const transport = createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    return transport;
  }

  async sendMailConfirmation(email: string, token: string) {
    const transport = await this.transporter();

    await transport.sendMail({
      to: email,
      from: {
        name: process.env.EMAIL_NAME,
        address: process.env.EMAIL_FROM,
      },
      subject: 'Signup Confirmation',
      html: `<a href='http://localhost:3000/auth/signup-confirmation?token=${token}'>Confirm your email address</a>
     `,
    });
  }

  async sendResetPassword(
    email: string,
    url: string,
    code: string,
    time: number,
  ) {
    const transport = await this.transporter();

    await transport.sendMail({
      to: email,
      from: {
        name: process.env.EMAIL_NAME,
        address: process.env.EMAIL_FROM,
      },
      subject: 'Reset Password',
      html: `
      <a href="${url}">Reset Password</a>
      <p>Code: ${code}</p>
      <p>Code will expires in ${time / 60} minutes</p>
      `,
    });
  }
}
