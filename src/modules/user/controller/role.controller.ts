import { Controller, Get } from '@nestjs/common';
import { RoleService } from '../services/role.service';

@Controller('/user')
export class RoleController {

  constructor(
    private readonly roleService: RoleService,
  ) { }

  @Get()
  async getUsers() {
    return this.roleService.getRole();
  }
}
