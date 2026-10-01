import { button, escapeHtml, layout, MailContent } from './layout';

export function resetPasswordTemplate({ firstName, link }: { firstName: string; link: string }): MailContent {
    const subject = 'Reset your password';

    return {
        subject,
        text:
            `Hi ${firstName},\n\nReset your password by opening this link (valid for 60 minutes, single use):\n${link}` +
            `\n\nIf you didn't request this, you can ignore this email.`,
        html: layout(
            subject,
            `<p>Hi ${escapeHtml(firstName)},</p>
<p>Reset your password by clicking the button below. The link is valid for 60 minutes and can be used once.</p>
${button('Reset password', link)}
<p style="font-size:13px;color:#6b7280">If you didn't request this, you can ignore this email.</p>`,
        ),
    };
}
