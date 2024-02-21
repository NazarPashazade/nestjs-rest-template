import { Gender } from "../domain/enums/gender";
import { FileInfoDTO } from "./file-info.dto";

export class UserDetailsDTO {
    id: string;

    phoneNumber: string;

    dateOfBirth?: Date;

    gender?: Gender;

    bio?: string;

    nickname?: string;

    avatar?: FileInfoDTO;

    coverPhoto?: FileInfoDTO;

    createdAt: Date;

    updatedAt: Date;
}