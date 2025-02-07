export const signUp = (data: { userName: string; otp: string }) => {
  return `
    <p>Welcome, ${data.userName} to Passman!</p
    ><br>
    <p style="font-size: 16px;">Your account OTP verification code is <strong style="color: #007bff; font-weight: bold;">${data.otp}</strong></p>
  `;
};
