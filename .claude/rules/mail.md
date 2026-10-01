---
paths:
    - 'src/modules/infrastructure/mail/**/*.ts'
---

# Mail

- `MailService` sends via Nodemailer SMTP when `SMTP_HOST` is set, and only logs the message otherwise. In production that log leaves out the body, because bodies carry verification and reset links.
- Each email is a function in `templates/<name>.template.ts` returning `MailContent` (`{ subject, text, html }`). Always provide both `text` and `html`, and wrap the HTML with `layout(...)` and `button(...)` from `templates/layout.ts`.
- Escape every user-supplied value in HTML with `escapeHtml`; the plain-text version stays unescaped.
- Local testing: Mailpit (`docker run -d -p 1025:1025 -p 8025:8025 axllent/mailpit`, `SMTP_HOST=localhost`, `SMTP_PORT=1025`), inbox at http://localhost:8025. Production uses Brevo SMTP (`smtp-relay.brevo.com:587`).
