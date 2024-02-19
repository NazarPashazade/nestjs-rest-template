import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../domain/models/role.model';
import { RoleName } from '../domain/enums/role-name';
import { DbContext } from '../../db/db-context';
import { SeederService } from '../../../modules/db/services/seeder.service';

@Injectable()
export class RoleService {

  constructor(
    private readonly seederService: SeederService,
    // @InjectRepository(Role) private rolesRepository: Repository<Role>
    // @Inject()
    // protected readonly dbContext: DbContext
  ) { }

  async getRole() {
    console.log("User")
    // const managerRole = await this.dbContext.roles.findOne({ where: { name: RoleName.admin } });
    // console.log(managerRole)
    await this.seederService.runSeedsAsync()
    return 'Hello Role!';
  }
}
