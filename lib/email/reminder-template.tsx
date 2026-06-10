interface ReminderEmailProps {
  userName: string
  certName: string
  examDate: string
  daysUntil: number
}

export function ReminderEmailHtml({
  userName,
  certName,
  examDate,
  daysUntil,
}: ReminderEmailProps): string {
  const daysText = daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>certplan Exam Reminder</title>
</head>
<body style="font-family: 'Lexend', system-ui, sans-serif; background: #f9fafb; margin: 0; padding: 40px 16px;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #e5e7eb;">
    <div style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">
      📅 Exam Reminder
    </div>
    <p style="color: #6b7280; margin: 0 0 24px;">Hi ${userName},</p>
    <p style="color: #111827; font-size: 16px; margin: 0 0 16px;">
      Your <strong>${certName}</strong> exam is scheduled <strong>${daysText}</strong> on <strong>${examDate}</strong>.
    </p>
    <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px;">
      Good luck! Log in to certplan to review or reschedule your exam.
    </p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/calendar"
       style="display: inline-block; background: #111827; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
      View Calendar
    </a>
    <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
      You're receiving this because you scheduled an exam on certplan.
    </p>
  </div>
</body>
</html>
  `.trim()
}
