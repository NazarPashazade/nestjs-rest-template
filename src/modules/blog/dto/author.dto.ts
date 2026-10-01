import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthorDTO {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;
}
