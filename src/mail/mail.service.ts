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

  async sendMailConfirmation(email: string) {
    const transport = await this.transporter();

    await transport.sendMail({
      to: email,
      from: {
        name: process.env.EMAIL_NAME,
        address: process.env.EMAIL_FROM,
      },
      subject: 'Signup Confirmation',
      text: 'Confirm your email address',
    });
  }
}
