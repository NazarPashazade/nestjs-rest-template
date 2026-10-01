import { ConflictException, Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { runOnTransactionCommit, Transactional } from 'typeorm-transactional';
import { BaseHandler } from '../../shared/queries/base-handler';
import { RoleName } from '../../user/domain/enums/role-name';
import { User } from '../../user/domain/models/user.model';
import { EmailVerificationService } from '../services/email-verification.service';
import { RegisterInput } from '../types/register-input';
import { RegisterPayload } from '../types/register-payload';
import { hashPassword } from '../utils/password';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class RegisterHandler extends BaseHandler {
    constructor(private readonly emailVerificationService: EmailVerificationService) {
        super();
    }

    async execute(input: RegisterInput): Promise<RegisterPayload> {
        try {
            return await this.register(input);
        } catch (error) {
            // Two concurrent sign-ups with one email both pass the existence check; the unique index rejects the second.
            if (error instanceof QueryFailedError && error.driverError?.code === PG_UNIQUE_VIOLATION) {
                throw new ConflictException('An account with this email already exists');
            }
            throw error;
        }
    }

    @Transactional()
    private async register({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth,
        gender,
    }: RegisterInput): Promise<RegisterPayload> {
        const existingUser = await this.dbContext.users.findOne({ where: { email } });

        if (existingUser) {
            throw new ConflictException('An account with this email already exists');
        }

        const role = await this.dbContext.roles.findOneOrFail({ where: { name: RoleName.member } });

        const user = this.dbContext.users.create({
            email,
            firstName,
            lastName,
            password: await hashPassword(password),
            emailVerified: false,
            roleId: role.id,
        });

        await this.dbContext.users.save(user);

        const details = this.dbContext.userDetails.create({
            user,
            phoneNumber,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            gender,
        });

        await this.dbContext.userDetails.save(details);

        runOnTransactionCommit(() => this.sendVerificationEmail(user));

        return { id: user.id, email: user.email, emailVerified: user.emailVerified };
    }

    private sendVerificationEmail(user: User): void {
        this.emailVerificationService.sendAsync(user).catch((error) => this.logger.error(error, RegisterHandler.name));
    }
}
