import nodemailer from 'nodemailer';

// Интерфейс для параметров email
interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions: EmailOptions = {
    from: process.env.EMAIL_USER!,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
