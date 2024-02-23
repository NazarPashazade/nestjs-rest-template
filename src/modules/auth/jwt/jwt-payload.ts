import { Gender } from '../../user/domain/enums/gender';

export type JwtAvatar = { url: string };

export type JwtCoverPhoto = { url: string };

export class JwtPayload {
    id: string;

    firstName: string;

    lastName: string;

    email: string;

    role: string;

    statusText?: string;

    avatar?: JwtAvatar;

    coverPhoto?: JwtCoverPhoto;

    gender?: Gender;
}
