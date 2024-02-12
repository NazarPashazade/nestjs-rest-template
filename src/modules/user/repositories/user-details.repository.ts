import { Injectable } from "@nestjs/common";
import { EntityRepository } from "typeorm";
import { BaseRelayRepository } from "../../shared/repositories/base-relay-repository";
import { UserDetails } from "../domain/models/user-detail.model";

@Injectable()
@EntityRepository(UserDetails)
export class UserDetailsRepository extends BaseRelayRepository<UserDetails>{ }