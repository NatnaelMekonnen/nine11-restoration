import { Client } from "@sendgrid/client";
import sgMail from "@sendgrid/mail";
import envConfig from "../config/env.config";
import { errorLogger, successLogger } from "../utils/logger";

const { SEND_GRIDE_API_KEY, SENDER } = envConfig;

sgMail.setClient(new Client());

sgMail.setApiKey(SEND_GRIDE_API_KEY as string);

class MailService {
  public async sendMail({
    subject,
    text,
    to,
  }: {
    to: string;
    subject: string;
    text: string;
  }) {
    if (SENDER) {
      const result = await sgMail.send({
        to,
        from: {
          email: SENDER,
          name: "Miles",
        },
        subject,
        text,
      });
      if (result) {
        return true;
      }

      errorLogger.log(result);
    }

    return false;
  }
  public async sendMailWithTemplate(
    to: string,
    templateID: string,
    data: string | Record<string, unknown>,
  ) {
    try {
      if (SENDER) {
        const msg = {
          to,
          from: SENDER,
          templateId: templateID,
          dynamic_template_data: data,
        };
        sgMail
          .send(msg)
          .then(() => {
            successLogger.log("Sent");
          })
          .catch((e) => {
            errorLogger.log(e);
          });
      }
    } catch (error: unknown) {
      errorLogger.log(error);
    }
  }
}

export default MailService;
