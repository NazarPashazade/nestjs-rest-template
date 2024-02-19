import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BaseRelayRepository } from "../../shared/repositories/base-relay-repository";
import { UserDetails } from "../domain/models/user-detail.model";

@Injectable()
export class UserDetailsRepository extends BaseRelayRepository<UserDetails>{
    constructor(private dataSource: DataSource) {
        super(UserDetails, dataSource.createEntityManager());
    }
}