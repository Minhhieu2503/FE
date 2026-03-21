import nodemailer from 'nodemailer';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html }: SendEmailInput) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = getTransporter();

  if (!from) {
    console.warn('SMTP_FROM/SMTP_USER is missing. Skipping email send.');
    return false;
  }

  if (!transporter) {
    console.warn('SMTP config is missing. Skipping email send.');
    return false;
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return true;
};
