import { Exclude, Expose } from "class-transformer";

@Exclude()
export class FileInfoDTO {
    @Expose()
    id: string;

    @Expose()
    objectName?: string;

    @Expose()
    name: string;

    @Expose()
    url: string;

    @Expose()
    size: number;

    @Expose()
    extension: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}