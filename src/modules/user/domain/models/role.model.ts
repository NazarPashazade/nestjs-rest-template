import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';
import { IBaseEntity } from '../../../shared/domain/interfaces/base-entity';
// import { IBaseEntity } from '@modules/shared/domain/interfaces/base-entity';

@Entity({ name: 'roles' })
export class Role implements IBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}