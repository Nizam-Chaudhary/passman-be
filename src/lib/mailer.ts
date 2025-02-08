import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import env from "./env";

// configuring AWS SDK
const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "ap-south-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_ACCESS_KEY_ID,
  },
});

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
  sendingRate: 1, // max 1 messages/second,
  maxConnections: 1,
});

export const deliverEmail = (
  toAddresses: string,
  subject: string,
  emailBody: string
) => {
  return new Promise(async (resolve, reject) => {
    transporter.sendMail(
      {
        from: env.FROM_EMAIL_ADDR,
        to: toAddresses,
        subject,
        html: emailBody,
      },
      (err, info) => {
        transporter.close();
        resolve(true);
        if (err) {
          console.error(err);
        } else {
          console.log(new Date().toLocaleString(), info?.envelope);
          console.log(info?.messageId);
        }
      }
    );
    resolve(true);
  });
};
