import { User } from '@modules/user/domain/models/user.model';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { BaseHandler } from '../../shared/queries/base-handler';
import { JwtPayload } from '../jwt/jwt-payload';

@Injectable()
export class LoginService extends BaseHandler {

    async generateJwtPayload(user: User): Promise<JwtPayload> {
        const {
            id,
            email,
            firstName,
            lastName,
            role,
            details: { avatar, coverPhoto, gender },
        } = user;

        const jwtPayload: JwtPayload = {
            id,
            email,
            firstName,
            lastName,
            gender,
            avatar,
            role: role.name,
        };

        if (avatar) {
            jwtPayload.avatar = { url: avatar.url };
        }

        if (coverPhoto) {
            jwtPayload.coverPhoto = { url: coverPhoto.url };
        }

        // switch (role.name) {
        //     case RoleName.admin:
        //         if (!manager) {
        //             throw new NotFoundException('Manager not found');
        //         }

        //         jwtPayload.manager = { id: manager.id, type: manager.type };
        //         jwtPayload.statusText = 'MANAGER';

        //         break;

        //     case RoleName.Member:
        //         if (!member) {
        //             throw new NotFoundException('Member not found');
        //         }

        //         jwtPayload.member = { id: member.id, status: member.status };

        //         if (member.status == MemberStatus.APPROVED) {
        //             jwtPayload.statusText = 'MEMBER';
        //         } else {
        //             jwtPayload.statusText = 'GUEST';
        //         }

        //         break;
        // }

        return jwtPayload;
    }

    async checkValidations(password: string, user: User): Promise<void> {
        if (!user) {
            throw new ForbiddenException('Email or password is incorrect');
        }

        if (!user.emailVerified) {
            throw new BadRequestException('Email is not verified');
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new ForbiddenException('Email or password is incorrect');
        }
    }
}
