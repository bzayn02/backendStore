import nodemailer from 'nodemailer';

//1. Reusable transporter

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const accountVerificationEmail = async (obj) => {
  const { email, fname, link } = obj;

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"BN Store" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Account Activation Required.', // Subject line
    text: `Dear ${fname}, please follow the link to activate your account. ${link}`, // plain text body
    html: `<p>Dear ${fname}</p>
    <p>Please follow the link below to activate your account.</p>
        <br/>
        <br/><p><a href=${link}>${link}</a></p> 
        <br/>
        <br/>
        <p>Regards, <br/>
        BN Store <br/>
        Customer Support Team</p>`, // html body
  });
  console.log('Message sent: %s', info.messageId);
};

export const accountVerifiedNotification = async (obj) => {
  const { email, fname } = obj;
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"BN Store" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Account verified.', // Subject line
    text: `Dear ${fname}, Your account has been verified. You may login now.`, // plain text body
    html: `<p>Dear ${fname}</p>
      <p>Your account has been verified. You may 
      <a href="${process.env.WEB_DOMAIN}/sign-in">sign in</a> now.</p>
          <br/>
         
          <br/>
          <br/>
          <p>Regards, <br/>
          BN Store <br/>
          Customer Support Team</p>`, // html body
  });
  console.log('Message sent: %s', info.messageId);
};
