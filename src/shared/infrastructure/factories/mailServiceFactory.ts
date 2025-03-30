import { MailService } from "../../domain/services/mailService.js";
import env from "../../config/env.js";
import * as aws from "@aws-sdk/client-ses";
import { createTransport } from "nodemailer";
import { NodeMailerService } from "../services/mail/nodeMailerService.js";
import { LoggingService } from "../../domain/services/loggerService.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class MailServiceFactory {
  constructor(
    private readonly provider: MailServices,
    @inject("LoggingService") private readonly logger: LoggingService
  ) {}

  createService(): MailService {
    switch (this.provider) {
      case "SES": {
        // configuring AWS SDK
        const ses = new aws.SES({
          apiVersion: "2010-12-01",
          region: env.AWS_REGION,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          },
        });

        // create Nodemailer SES transporter
        const transporter = createTransport({
          SES: { ses, aws: aws },
          sendingRate: 1, // max 1 messages/second,
          maxConnections: 1,
        });

        return new NodeMailerService(
          transporter,
          env.FROM_EMAIL_ADDR,
          this.logger
        );
      }
      default:
        throw new Error(`Unsupported mail service: ${this.provider}`);
    }
  }
}

type MailServices = "SES";
