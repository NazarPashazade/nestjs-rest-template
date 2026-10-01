import { button, escapeHtml, layout, MailContent } from './layout';

export function verifyEmailTemplate({ firstName, link }: { firstName: string; link: string }): MailContent {
    const subject = 'Verify your email address';

    return {
        subject,
        text: `Hi ${firstName},\n\nConfirm your email address by opening this link (valid for 2 days):\n${link}`,
        html: layout(
            subject,
            `<p>Hi ${escapeHtml(firstName)},</p>
<p>Confirm your email address by clicking the button below. The link is valid for 2 days.</p>
${button('Verify email', link)}`,
        ),
    };
}
