
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDTO } from './role.dto';
import { UserDetailsDTO } from './user-details.dto';

@Exclude()
export class UserDTO {

    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    emailVerified: boolean;

    @Expose()
    @Type(() => RoleDTO)
    role: RoleDTO;

    @Expose()
    @Type(() => UserDetailsDTO)
    details: UserDetailsDTO

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}