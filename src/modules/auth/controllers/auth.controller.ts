import { Body, Controller, Post } from '@nestjs/common';
import { LoginHandler } from '../handlers/login-handler';
import { LoginInput } from '../types/login-input';
import { LoginPayload } from '../types/login-payload';

@Controller('/auth')
export class AuthorizeUserController {

  constructor(
    private readonly loginHandler: LoginHandler,
  ) { }

  @Post('login')
  async login(@Body() input: LoginInput): Promise<LoginPayload> {
    return await this.loginHandler.execute(input);
  }
}
