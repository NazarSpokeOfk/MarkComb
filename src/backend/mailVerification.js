import crypto from 'crypto';
import nodemailer from 'nodemailer';

class MailVerification {
  constructor() {
    this.verificationCodes = {};
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mknoreplyy@gmail.com',
        pass: 'n_xo-maFf8Y_Ytj'
      }
    });
  }

  async sendVerificationCode(email) {
    const verificationCode = crypto.randomBytes(3).toString('hex');
    const ttl = 10 * 60 * 1000; // 10 minutes in milliseconds

    this.verificationCodes[email] = {
      code: verificationCode,
      expiresAt: Date.now() + ttl
    };

    const mailOptions = {
      from: 'mknoreplyy@gmail.com',
      to: email,
      subject: 'Подтверждение регистрации',
      text: `Ваш код подтверждения: ${verificationCode}`
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent to:', email);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }

  async verifyCode(email,code){
    const storedCode = this.verificationCodes[email]

    if(!storedCode){
        return {success : false,message : "Код не найден."}
    }

    if(Date.now() > storedCode.expiresAt){
        delete this.verificationCodes[email]
        return {success : false,message : "Срок действия кода истек."}
    }

    if(code != storedCode){
        return{success : false,message : "Код неверный."}
    }

    delete this.verificationCodes[email];
    return {success : true}
  } 
}

export default MailVerification;