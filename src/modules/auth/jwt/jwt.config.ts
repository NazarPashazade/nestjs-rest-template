import { JwtModuleOptions } from '@nestjs/jwt';
import { JWT_SECRET } from '../../config/environment';

export const JwtConfig: JwtModuleOptions = {
    secret: JWT_SECRET,
    signOptions: {
        expiresIn: '365d',
    },
};
