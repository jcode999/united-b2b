import nodemailer from 'nodemailer';

interface SendEmailParams {
  from:string,
  to: string,
  subject: string,
  text: string,
  html?:string,
  auth:{
    user:string,
    pass:string,
  },
  
}

export async function sendEmail({ from,to, subject, text, html,auth }: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure:true,
    auth,
  });
 
  
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
   
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