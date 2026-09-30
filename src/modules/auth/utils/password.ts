import { compare, hash } from 'bcryptjs';

const SALT_ROUNDS = 12;

// bcrypt ignores everything after 72 bytes, so longer passwords would silently collide.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const hashPassword = (password: string): Promise<string> => hash(password, SALT_ROUNDS);

export const verifyPassword = (password: string, passwordHash: string): Promise<boolean> =>
    compare(password, passwordHash);
