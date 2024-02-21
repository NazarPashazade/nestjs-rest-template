
import { RoleDTO } from './role.dto';
import { UserDetailsDTO } from './user-details.dto';

export class UserDTO {
    id: string;

    email: string;

    firstName: string;

    lastName: string;

    emailVerified: boolean;

    role: RoleDTO;

    details: UserDetailsDTO;

    createdAt: Date;

    updatedAt: Date;
}