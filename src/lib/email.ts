import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM = process.env.EMAIL_FROM || "NurseConnect <no-reply@nurseconnect.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function baseTemplate(content: string, title: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0d9488);padding:32px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">NurseConnect</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">Healthcare Staffing Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#6b7280;font-size:12px;">© ${new Date().getFullYear()} NurseConnect. All rights reserved.</p>
            <p style="margin:4px 0 0;color:#6b7280;font-size:12px;">
              <a href="${APP_URL}" style="color:#2563eb;text-decoration:none;">Visit Website</a> ·
              <a href="${APP_URL}/support" style="color:#2563eb;text-decoration:none;">Support</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Welcome to NurseConnect, ${name}! 👋</h2>
    <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">Your account has been created successfully. Our team will review your registration and activate your account shortly.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;color:#166534;font-weight:600;">Account Role: ${role}</p>
    </div>
    <a href="${APP_URL}/login" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">Get Started</a>
  `;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Welcome to NurseConnect!",
    html: baseTemplate(content, "Welcome to NurseConnect"),
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Reset Your Password</h2>
    <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">Reset Password</a>
    <p style="color:#9ca3af;margin:24px 0 0;font-size:13px;">If you didn't request this, please ignore this email. Your password won't change.</p>
  `;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Reset Your NurseConnect Password",
    html: baseTemplate(content, "Password Reset"),
  });
}

export async function sendAccountApprovedEmail(to: string, name: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Account Approved! 🎉</h2>
    <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">Great news, ${name}! Your NurseConnect account has been approved. You can now log in and access all features.</p>
    <a href="${APP_URL}/login" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">Log In Now</a>
  `;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Your NurseConnect Account is Approved",
    html: baseTemplate(content, "Account Approved"),
  });
}

export async function sendApplicationReceivedEmail(to: string, nurseName: string, jobTitle: string, facilityName: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Application Received</h2>
    <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">Hi ${nurseName}, your application for <strong>${jobTitle}</strong> at <strong>${facilityName}</strong> has been received successfully.</p>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;color:#1e40af;">We'll notify you when the facility reviews your application.</p>
    </div>
    <a href="${APP_URL}/nurse/applications" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">Track Application</a>
  `;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Application Submitted: ${jobTitle}`,
    html: baseTemplate(content, "Application Received"),
  });
}

export async function sendApplicationStatusEmail(
  to: string,
  nurseName: string,
  jobTitle: string,
  status: string
) {
  const statusMessages: Record<string, { emoji: string; message: string; bg: string; border: string; color: string }> = {
    SHORTLISTED: {
      emoji: "⭐",
      message: "You've been shortlisted for an interview!",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      color: "#166534",
    },
    INTERVIEW_SCHEDULED: {
      emoji: "📅",
      message: "An interview has been scheduled for your application.",
      bg: "#eff6ff",
      border: "#bfdbfe",
      color: "#1e40af",
    },
    OFFERED: {
      emoji: "🎉",
      message: "Congratulations! You've received a job offer!",
      bg: "#fefce8",
      border: "#fde68a",
      color: "#92400e",
    },
    REJECTED: {
      emoji: "ℹ️",
      message: "After careful consideration, the facility has decided to move forward with other candidates.",
      bg: "#fef2f2",
      border: "#fecaca",
      color: "#991b1b",
    },
  };

  const info = statusMessages[status] || { emoji: "📋", message: "Your application status has been updated.", bg: "#f9fafb", border: "#e5e7eb", color: "#374151" };

  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Application Update ${info.emoji}</h2>
    <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">Hi ${nurseName}, there's an update on your application for <strong>${jobTitle}</strong>.</p>
    <div style="background:${info.bg};border:1px solid ${info.border};border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;color:${info.color};">${info.message}</p>
    </div>
    <a href="${APP_URL}/nurse/applications" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">View Application</a>
  `;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Application Update: ${jobTitle}`,
    html: baseTemplate(content, "Application Status Update"),
  });
}

export async function sendInterviewScheduledEmail(
  to: string,
  name: string,
  jobTitle: string,
  interviewDate: Date,
  meetingLink?: string
) {
  const dateStr = interviewDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Interview Scheduled 📅</h2>
    <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">Hi ${name}, your interview for <strong>${jobTitle}</strong> has been scheduled.</p>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#1e40af;font-weight:600;">📅 ${dateStr}</p>
      ${meetingLink ? `<p style="margin:0;"><a href="${meetingLink}" style="color:#2563eb;">Join Video Interview</a></p>` : ""}
    </div>
    <a href="${APP_URL}/nurse/applications" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">View Details</a>
  `;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Interview Scheduled: ${jobTitle}`,
    html: baseTemplate(content, "Interview Scheduled"),
  });
}

export async function sendNewApplicationNotificationEmail(
  to: string,
  facilityName: string,
  jobTitle: string,
  nurseName: string
) {
  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">New Application Received</h2>
    <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">Hi ${facilityName}, <strong>${nurseName}</strong> has applied for the <strong>${jobTitle}</strong> position.</p>
    <a href="${APP_URL}/facility/applications" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">Review Application</a>
  `;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `New Application: ${jobTitle}`,
    html: baseTemplate(content, "New Application"),
  });
}
