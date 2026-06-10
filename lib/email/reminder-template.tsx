type Locale = "pt-BR" | "en"

interface ReminderEmailProps {
  userName: string
  certName: string
  examDate: string
  daysUntil: number
  locale?: Locale
}

const copy: Record<Locale, {
  subject: (certName: string, daysUntil: number) => string
  title: string
  greeting: (name: string) => string
  body: (certName: string, daysText: string, examDate: string) => string
  hint: string
  cta: string
  footer: string
  tomorrow: string
  inDays: (n: number) => string
}> = {
  "pt-BR": {
    subject: (cert, days) =>
      days === 1 ? `Lembrete: exame ${cert} amanhã` : `Lembrete: exame ${cert} em ${days} dias`,
    title: "📅 Lembrete de Exame",
    greeting: name => `Olá, ${name}!`,
    body: (cert, daysText, date) =>
      `Seu exame de <strong>${cert}</strong> está agendado <strong>${daysText}</strong>, no dia <strong>${date}</strong>.`,
    hint: "Boa sorte! Entre no certplan para revisar ou remarcar seu exame.",
    cta: "Ver Calendário",
    footer: "Você está recebendo este e-mail porque agendou um exame no certplan.",
    tomorrow: "amanhã",
    inDays: n => `em ${n} dias`,
  },
  en: {
    subject: (cert, days) =>
      days === 1 ? `Reminder: ${cert} exam tomorrow` : `Reminder: ${cert} exam in ${days} days`,
    title: "📅 Exam Reminder",
    greeting: name => `Hi ${name},`,
    body: (cert, daysText, date) =>
      `Your <strong>${cert}</strong> exam is scheduled <strong>${daysText}</strong> on <strong>${date}</strong>.`,
    hint: "Good luck! Log in to certplan to review or reschedule your exam.",
    cta: "View Calendar",
    footer: "You're receiving this because you scheduled an exam on certplan.",
    tomorrow: "tomorrow",
    inDays: n => `in ${n} days`,
  },
}

export function getEmailSubject({
  certName,
  daysUntil,
  locale = "pt-BR",
}: Pick<ReminderEmailProps, "certName" | "daysUntil" | "locale">): string {
  return copy[locale].subject(certName, daysUntil)
}

export function ReminderEmailHtml({
  userName,
  certName,
  examDate,
  daysUntil,
  locale = "pt-BR",
}: ReminderEmailProps): string {
  const c = copy[locale]
  const daysText = daysUntil === 1 ? c.tomorrow : c.inDays(daysUntil)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>certplan</title>
</head>
<body style="font-family: 'Lexend', system-ui, sans-serif; background: #f9fafb; margin: 0; padding: 40px 16px;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #e5e7eb;">
    <div style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">
      ${c.title}
    </div>
    <p style="color: #6b7280; margin: 0 0 24px;">${c.greeting(userName)}</p>
    <p style="color: #111827; font-size: 16px; margin: 0 0 16px;">
      ${c.body(certName, daysText, examDate)}
    </p>
    <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px;">
      ${c.hint}
    </p>
    <a href="${siteUrl}/calendar"
       style="display: inline-block; background: #111827; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
      ${c.cta}
    </a>
    <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
      ${c.footer}
    </p>
  </div>
</body>
</html>
  `.trim()
}
