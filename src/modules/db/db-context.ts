// import { UsersRepository } from '@modules/user/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from '../user/repositories/roles.repository';
import { UserDetailsRepository } from '../user/repositories/user-details.repository';
import { UsersRepository } from '../user/repositories/users.repository';
import { ArticlesRepository } from '../blog/repositories/articles.repository';
import { ArticleCategoriesRepository } from '../blog/repositories/article-categories.repository';

@Injectable()
export class DbContext {
    @InjectRepository(RolesRepository)
    public readonly roles: RolesRepository;

    @InjectRepository(UsersRepository)
    public readonly users: UsersRepository;

    @InjectRepository(UserDetailsRepository)
    public readonly userDetails: UserDetailsRepository;

    @InjectRepository(ArticleCategoriesRepository)
    public readonly articleCategories: ArticleCategoriesRepository;

    @InjectRepository(ArticlesRepository)
    public readonly articles: ArticlesRepository;
}
