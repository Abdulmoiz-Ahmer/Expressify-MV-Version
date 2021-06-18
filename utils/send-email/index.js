import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = (to, subject, text, html) => {
  //Values that the send grid api expects as a must
  const msg = {
    to, // Change to your recipient
    from: process.env.SENDER_EMAIL, // Change to your verified sender
    subject,
    text,
    html,
  };

  //Invoking the Mail Sent function
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};
