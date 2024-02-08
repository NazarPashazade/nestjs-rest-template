import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Gender } from '../enums/gender';
import { User } from './user.model';
import { IEditableEntity } from '../../../shared/domain/interfaces';
import { FileInfo } from '../../../file/domain/models/file-info.model';
// import { FileInfo } from '@modules/file/domain/models/file-info.model';
// import { IEditableEntity } from '@modules/shared/domain/interfaces';

@Entity({ name: 'user_details' })
export class UserDetails implements IEditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'phone_number' })
    phoneNumber: string;

    @Column({ name: 'date_of_birth', nullable: true })
    dateOfBirth?: Date;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender?: Gender;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column({ default: false })
    incognito: boolean;

    @Index({ unique: true })
    @Column({ nullable: true })
    nickname?: string;

    @Column({ name: 'avatar_id', nullable: true })
    avatarId?: string;

    @ManyToOne(() => FileInfo)
    @JoinColumn({ name: 'avatar_id' })
    avatar?: FileInfo;

    @Column({ name: 'cover_photo_id', nullable: true })
    coverPhotoId?: string;

    @ManyToOne(() => FileInfo)
    @JoinColumn({ name: 'cover_photo_id' })
    coverPhoto?: FileInfo;

    @Column({ name: 'user_id', nullable: true })
    userId: string;

    @OneToOne(() => User, (user) => user.details)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}