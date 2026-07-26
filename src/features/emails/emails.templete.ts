export class EmailTemplate {
  otpMail(otp: string) {
    return `
      <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#06b6d4);padding:28px 32px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Email Verification</h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Secure your account with one-time password</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 16px;font-size:16px;color:#1f2937;line-height:1.6;">
                      Hi there,
                    </p>

                    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
                      We received a request to verify your email address. Please use the OTP below to complete your verification.
                    </p>

                    <div style="text-align:center;margin:28px 0;">
                      <div style="display:inline-block;padding:18px 28px;border:1px dashed #2563eb;border-radius:12px;background:#eff6ff;">
                        <span style="display:block;font-size:12px;letter-spacing:2px;color:#2563eb;margin-bottom:8px;font-weight:700;">YOUR OTP</span>
                        <span style="font-size:34px;font-weight:800;color:#111827;letter-spacing:6px;">${otp}</span>
                      </div>
                    </div>

                    <div style="background:#f9fafb;border-radius:12px;padding:16px 18px;margin:24px 0;">
                      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                        This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.
                      </p>
                    </div>

                    <p style="margin:24px 0 0;font-size:14px;color:#374151;line-height:1.6;">
                      If you did not request this, you can safely ignore this email.
                    </p>

                    <p style="margin:24px 0 0;font-size:14px;color:#374151;">
                      Thanks,<br />
                      <strong>Your Team</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 32px;background:#f9fafb;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">
                      © ${new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `;
  }
}
