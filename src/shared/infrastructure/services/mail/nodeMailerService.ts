import { Transporter } from "nodemailer";
import { LoggingService } from "../../../domain/services/loggerService.js";
import { MailService } from "../../../domain/services/mailService.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class NodeMailerService implements MailService {
  constructor(
    private readonly transporter: Transporter,
    private readonly fromMailAddress: string,
    @inject("LoggingService") private readonly logger: LoggingService
  ) {}

  sendMail(to: string, subject: string, text: string): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.transporter.sendMail(
        {
          from: this.fromMailAddress,
          to,
          subject,
          text,
        },
        (err, info) => {
          this.transporter.close();
          resolve();
          if (err) {
            this.logger.error(err);
          } else {
            this.logger.error(new Date().toLocaleString(), info.envelope);
            this.logger.error(info.messageId);
          }
        }
      );
      resolve();
    });
  }
}
