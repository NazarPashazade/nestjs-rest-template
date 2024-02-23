import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { plainToClass } from 'class-transformer';
import { UserDTO } from '../dto/user.dto';
import { UserConnection } from '../types/user-connection-types';
import { AuthorizeMember } from '../../auth/decorators/authorize-member.decorator';
import { AuthorizeUser } from '../../auth/decorators/authorize-user.decorator';

@Controller('/users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  @AuthorizeUser()
  async getUsers(): Promise<UserConnection> {
    return await this.userService.getUsers();
  }


  @Get(':id')
  async getUserById(@Param('id') id): Promise<UserDTO> {
    const user = await this.userService.getUserById(id);
    return plainToClass(UserDTO, user);
  }
}
