import { Exclude, Expose } from "class-transformer";

@Exclude()
export class RoleDTO {
    @Expose()
    id: string;

    @Expose()
    name: string;
}