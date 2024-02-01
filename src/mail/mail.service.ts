import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private async transporter() {
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
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
      html: `<a href='${process.env.PROJECT_URL}/auth/signup-confirmation?token=${token}'>Confirm your email address</a>
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
