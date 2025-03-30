/**
 * Interface for email service functionality
 */
export interface MailService {
  /**
   * Sends an email to the specified recipient
   * @param to - The recipient's email address
   * @param subject - The subject line of the email
   * @param text - The body content of the email
   * @returns A promise that resolves when the email is sent
   */
  sendMail(to: string, subject: string, text: string): Promise<void>;
}
