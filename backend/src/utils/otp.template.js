export const otpTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Expense Tracker - Verification Code</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7fb;
  font-family:Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 15px;">

        <!-- Card -->
        <table
          width="400"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:400px;
            width:100%;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 6px 25px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <tr>
            <td align="center" style="
              background:#5379f5;
              padding:28px 20px;
            ">
              <div style="
                font-size:28px;
                margin-bottom:8px;
              ">
                💰
              </div>

              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:22px;
                font-weight:700;
              ">
                Expense Tracker
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 30px; text-align:center;">

              <h2 style="
                margin:0 0 10px;
                color:#222222;
                font-size:20px;
              ">
                Verify Your Account
              </h2>

              <p style="
                margin:0;
                color:#777777;
                font-size:14px;
                line-height:22px;
              ">
                Use the verification code below to
                complete your request.
              </p>

              <!-- OTP -->
              <div style="
                margin:25px 0;
                padding:15px;
                background:#f1f4ff;
                border:1px solid #dbe3ff;
                border-radius:10px;
              ">
                <span style="
                  color:#5379f5;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:8px;
                ">
                  ${otp}
                </span>
              </div>

              <p style="
                margin:0;
                color:#888888;
                font-size:13px;
              ">
                This code will expire in
                <strong style="color:#5379f5;">
                  5 minutes
                </strong>.
              </p>

              <p style="
                margin:18px 0 0;
                color:#999999;
                font-size:12px;
                line-height:18px;
              ">
                🔒 Never share this code with anyone.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="
              background:#f8f9fc;
              padding:18px;
              border-top:1px solid #eeeeee;
            ">
              <p style="
                margin:0;
                color:#999999;
                font-size:12px;
              ">
                © 2026 Expense Tracker
              </p>

              <p style="
                margin:5px 0 0;
                color:#bbbbbb;
                font-size:11px;
              ">
                Secure • Simple • Smart
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
