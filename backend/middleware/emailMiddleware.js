// backend/middleware/emailMiddleware.js
import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    console.log('1. Setting up email transport');
    console.log('Environment variables:', {
      META_MAIL_FROM: process.env.META_MAIL_FROM,
      META_MAIL_PASSWORD: process.env.META_MAIL_PASSWORD ? 'Set' : 'Not set'
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: process.env.META_MAIL_FROM,
        pass: process.env.META_MAIL_PASSWORD
      },
      debug: true,
      logger: true // Включаємо детальне логування
    });

    console.log('2. Verifying transport');
    await transporter.verify();
    console.log('3. Transport verified');

    const mailOptions = {
      from: `"PowerTools" <${process.env.META_MAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };
    console.log('4. Mail options prepared:', { ...mailOptions, html: '[HTML Content]' });

    const info = await transporter.sendMail(mailOptions);
    console.log('5. Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Detailed email error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};

export const getPasswordResetHTML = (resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Відновлення паролю</h2>
      <p>Ви отримали цей лист, тому що запросили відновлення паролю для вашого облікового запису на PowerTools.</p>
      <p>Будь ласка, перейдіть за посиланням нижче для встановлення нового паролю:</p>
      <a href="${resetUrl}"
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Відновити пароль
      </a>
      <p style="color: #666;">Це посилання дійсне протягом 1 години.</p>
      <p style="color: #666;">Якщо ви не запитували відновлення паролю, проігноруйте цей лист.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #888; font-size: 12px;">Це автоматичний лист, будь ласка, не відповідайте на нього.</p>
    </div>
  `;
};