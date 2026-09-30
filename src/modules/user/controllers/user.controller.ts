import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../dto/user.dto';
import { UserConnection } from '../types/user-connection-types';
import { AuthorizeMember } from '../../auth/decorators/authorize-member.decorator';
import { AuthorizeUser } from '../../auth/decorators/authorize-user.decorator';

@ApiTags('Users')
@Controller('/users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  @AuthorizeUser()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List users' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async getUsers(): Promise<UserConnection> {
    return await this.userService.getUsers();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  async getUserById(@Param('id') id: string): Promise<UserDTO> {
    const user = await this.userService.getUserById(id);
    return plainToInstance(UserDTO, user);
  }
}
