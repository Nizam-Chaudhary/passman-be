import { randomBytes } from 'crypto';

export function generateOtp(length: number = 6): string {
  let otp = '';
  const digits = '0123456789';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

export function generateSalt(length: number = 16): string {
  return randomBytes(length).toString('hex');
}
