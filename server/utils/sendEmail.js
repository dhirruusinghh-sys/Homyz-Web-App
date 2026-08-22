import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'user',
      pass: process.env.SMTP_PASSWORD || 'password',
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'Homyz'} <${process.env.FROM_EMAIL || 'noreply@homyz.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
