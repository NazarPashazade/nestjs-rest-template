const TRANSLITERATION: Record<string, string> = {
    ə: 'e',
    ı: 'i',
    ö: 'o',
    ü: 'u',
    ş: 's',
    ç: 'c',
    ğ: 'g',
};

export function slugify(value: string): string {
    return value
        .toLocaleLowerCase('az')
        .replace(/[əıöüşçğ]/g, (char) => TRANSLITERATION[char])
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
