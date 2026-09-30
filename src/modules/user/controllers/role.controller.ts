import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleConnection } from '../types/role-connection-types';
import { RoleService } from '../services/role.service';

@ApiTags('Roles')
@Controller('/roles')
export class RoleController {

  constructor(
    private readonly roleService: RoleService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List roles' })
  async getRoles(): Promise<RoleConnection> {
    return this.roleService.getRoles();
  }
}
