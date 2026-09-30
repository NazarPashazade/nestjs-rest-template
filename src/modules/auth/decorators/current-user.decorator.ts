import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../jwt/jwt-payload';
import { JWT_SECRET } from '../../config/environment';

export const extractUserFromRequest = (request: { headers: Record<string, string | string[] | undefined> }): JwtPayload => {
    const authorizationHeader = request.headers['authorization'] as string;

    if (!authorizationHeader) {
        return null;
    }

    try {
        const token = authorizationHeader.split(' ')[1];

        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
};

const factory = (field: keyof JwtPayload, context: ExecutionContext): JwtPayload | JwtPayload[typeof field] => {
    const request = context.switchToHttp().getRequest();
    const user = extractUserFromRequest(request);
    return field ? user && user[field] : user;
};

export const CurrentUser = createParamDecorator(factory);
