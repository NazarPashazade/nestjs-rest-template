import { Injectable } from "@nestjs/common";
import { EntityRepository } from "typeorm";
import { BaseRelayRepository } from "../../shared/repositories/base-relay-repository";
import { Role } from "../domain/models/role.model";
 
@Injectable()
@EntityRepository(Role)
export class RolesRepository extends BaseRelayRepository<Role>{}