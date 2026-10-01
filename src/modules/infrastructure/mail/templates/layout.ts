export type MailContent = {
    subject: string;
    text: string;
    html: string;
};

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function button(label: string, link: string): string {
    return `<p style="margin:24px 0"><a href="${escapeHtml(link)}" style="background:#2563eb;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">${escapeHtml(label)}</a></p>
<p style="font-size:13px;color:#6b7280">If the button doesn't work, copy this link into your browser:<br><a href="${escapeHtml(link)}" style="color:#2563eb;word-break:break-all">${escapeHtml(link)}</a></p>`;
}

// Inline styles only: most mail clients strip <style> blocks.
export function layout(title: string, bodyHtml: string): string {
    return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827">
<div style="max-width:560px;margin:0 auto;bsackground:#ffffff;border-radius:8px;padding:32px;line-height:1.5">
${bodyHtml}
</div>
</body>
</html>`;
}
