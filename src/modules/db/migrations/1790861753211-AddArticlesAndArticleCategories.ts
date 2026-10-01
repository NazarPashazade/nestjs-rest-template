import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticlesAndArticleCategories1790861753211 implements MigrationInterface {
    name = 'AddArticlesAndArticleCategories1790861753211';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "article_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_eca1ad880e57e2860d7f7a20bc5" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_e7213f33ed41c37959c1b7fbe5" ON "article_categories" ("name") `,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_0178208684bd3fcacaa7581fce" ON "article_categories" ("slug") `,
        );
        await queryRunner.query(`CREATE TYPE "public"."articles_status_enum" AS ENUM('DRAFT', 'PUBLISHED')`);
        await queryRunner.query(
            `CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "excerpt" character varying(500) NOT NULL, "content" text NOT NULL, "cover_image_url" character varying, "status" "public"."articles_status_enum" NOT NULL DEFAULT 'DRAFT', "published_at" TIMESTAMP WITH TIME ZONE, "view_count" integer NOT NULL DEFAULT '0', "category_id" uuid NOT NULL, "author_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1123ff6815c5b8fec0ba9fec37" ON "articles" ("slug") `);
        await queryRunner.query(
            `CREATE INDEX "IDX_c907bb0b30a0992f94e85cddaa" ON "articles" ("status", "published_at") `,
        );
        await queryRunner.query(
            `ALTER TABLE "articles" ADD CONSTRAINT "FK_e025eeefcdb2a269c42484ee43f" FOREIGN KEY ("category_id") REFERENCES "article_categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_e025eeefcdb2a269c42484ee43f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c907bb0b30a0992f94e85cddaa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1123ff6815c5b8fec0ba9fec37"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TYPE "public"."articles_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0178208684bd3fcacaa7581fce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7213f33ed41c37959c1b7fbe5"`);
        await queryRunner.query(`DROP TABLE "article_categories"`);
    }
}
