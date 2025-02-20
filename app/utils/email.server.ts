import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?:string,
  customerName:string,
  id:string,
}

export async function sendEmail({ to, subject, text, html,customerName,id }: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
 
  const formLink = `https://admin.shopify.com/store/6dcd6a/apps/united-b2b/app/tobaccoform/${String(id)}`
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html:`
      <h1>Account Creation Reuest from ${customerName}!</h1>
      <p>Click the link to view details.</p>
      <a href=${formLink}>${formLink}</a>
      <p>If the link doesn't work, copy and paste the URL into your browser.</p>
    `,
  };
  console.log("sending email to ",to)

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true };
  } catch (error: unknown) {
    console.error('Error sending email: ', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}