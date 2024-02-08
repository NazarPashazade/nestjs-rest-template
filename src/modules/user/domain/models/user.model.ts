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
    VersionColumn
} from 'typeorm';
 import { Role } from './role.model';
import { UserDetails } from './user-detail.model';
import { IEditableEntity } from '@modules/shared/domain/interfaces';
 
@Entity({ name: 'users' })
export class User implements IEditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column({ name: 'first_name', default: 'firstName' })
    firstName: string;

    @Column({ name: 'last_name', default: 'lastName' })
    lastName: string;

    @Column()
    password: string;

    @Column({ name: 'email_verified', default: false })
    emailVerified: boolean;

    @Column({ name: 'role_id', nullable: true })
    roleId: string;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToOne(() => UserDetails, (UserDetails) => UserDetails.user, { cascade: ['update'] })
    details: UserDetails;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;

    verifyEmail(): void {
        this.emailVerified = true;
    }
}