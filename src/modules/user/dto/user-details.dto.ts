import { Exclude, Expose } from "class-transformer";
import { Gender } from "../domain/enums/gender";
import { FileInfoDTO } from "./file-info.dto";

@Exclude()
export class UserDetailsDTO {

    @Expose()
    phoneNumber: string;

    @Expose()
    dateOfBirth?: Date;

    @Expose()
    gender?: Gender;

    @Expose()
    bio?: string;

    @Expose()
    nickname?: string;

    @Expose()
    avatar?: FileInfoDTO;

    @Expose()
    coverPhoto?: FileInfoDTO;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}