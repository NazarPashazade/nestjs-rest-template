import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ForgotPasswordHandler } from '../handlers/forgot-password-handler';
import { LoginHandler } from '../handlers/login-handler';
import { RegisterHandler } from '../handlers/register-handler';
import { ResendVerificationHandler } from '../handlers/resend-verification-handler';
import { ResetPasswordHandler } from '../handlers/reset-password-handler';
import { VerifyEmailHandler } from '../handlers/verify-email-handler';
import { ForgotPasswordInput } from '../types/forgot-password-input';
import { ForgotPasswordPayload } from '../types/forgot-password-payload';
import { LoginInput } from '../types/login-input';
import { LoginPayload } from '../types/login-payload';
import { RegisterInput } from '../types/register-input';
import { RegisterPayload } from '../types/register-payload';
import { ResendVerificationInput } from '../types/resend-verification-input';
import { ResendVerificationPayload } from '../types/resend-verification-payload';
import { ResetPasswordInput } from '../types/reset-password-input';
import { ResetPasswordPayload } from '../types/reset-password-payload';
import { VerifyEmailInput } from '../types/verify-email-input';
import { VerifyEmailPayload } from '../types/verify-email-payload';

@ApiTags('Auth')
@ApiTooManyRequestsResponse({ description: 'Rate limit exceeded' })
@Controller('/auth')
@UseGuards(ThrottlerGuard)
export class AuthorizeUserController {

  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly registerHandler: RegisterHandler,
    private readonly verifyEmailHandler: VerifyEmailHandler,
    private readonly resendVerificationHandler: ResendVerificationHandler,
    private readonly forgotPasswordHandler: ForgotPasswordHandler,
    private readonly resetPasswordHandler: ResetPasswordHandler,
  ) { }

  @Post('login')
  @ApiOperation({ summary: 'Log in and receive a JWT access token' })
  @ApiBadRequestResponse({ description: 'Invalid input, or the email is not verified' })
  @ApiForbiddenResponse({ description: 'Email or password is incorrect' })
  async login(@Body() input: LoginInput): Promise<LoginPayload> {
    return await this.loginHandler.execute(input);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create an account and send a verification email' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiConflictResponse({ description: 'An account with this email already exists' })
  async register(@Body() input: RegisterInput): Promise<RegisterPayload> {
    return await this.registerHandler.execute(input);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify an email with the token from the verification email' })
  @ApiBadRequestResponse({ description: 'Token is invalid or has expired' })
  async verifyEmail(@Body() input: VerifyEmailInput): Promise<VerifyEmailPayload> {
    return await this.verifyEmailHandler.execute(input);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Send the verification email again',
    description: 'Always returns 202, whether or not the email is registered.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async resendVerification(@Body() input: ResendVerificationInput): Promise<ResendVerificationPayload> {
    return await this.resendVerificationHandler.execute(input);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Send a password reset email',
    description: 'Always returns 202, whether or not the email is registered.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async forgotPassword(@Body() input: ForgotPasswordInput): Promise<ForgotPasswordPayload> {
    return await this.forgotPasswordHandler.execute(input);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set a new password with the token from the password reset email' })
  @ApiBadRequestResponse({ description: 'Invalid input, or the token is invalid, expired or already used' })
  async resetPassword(@Body() input: ResetPasswordInput): Promise<ResetPasswordPayload> {
    return await this.resetPasswordHandler.execute(input);
  }
}
