import { Injectable } from "@nestjs/common";
import { EntityRepository } from "typeorm";
import { User } from "../domain/models/user.model";
import { BaseRelayRepository } from "@modules/shared/repositories/base-relay-repository";
 
@Injectable()
@EntityRepository(User)
export class UsersRepository extends BaseRelayRepository<User>{}