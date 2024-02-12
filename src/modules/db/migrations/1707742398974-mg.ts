import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1707742398974 implements MigrationInterface {
    name = 'Mg1707742398974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectName" character varying, "name" character varying NOT NULL, "url" character varying NOT NULL, "size" integer NOT NULL, "extension" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_332d10755187ac3c580e21fbc0" ON "files" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2a26d04373d1dcc04c7f7aee21" ON "files" ("url") `);
        await queryRunner.query(`CREATE INDEX "IDX_2131397e72958a5d3d76b356c4" ON "files" ("extension") `);
        await queryRunner.query(`CREATE TYPE "public"."user_details_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "user_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_number" character varying NOT NULL, "date_of_birth" TIMESTAMP, "gender" "public"."user_details_gender_enum", "bio" text, "incognito" boolean NOT NULL DEFAULT false, "nickname" character varying, "avatar_id" uuid, "cover_photo_id" uuid, "user_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_ef1a1915f99bcf7a87049f7449" UNIQUE ("user_id"), CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_182a355d5a26d08ccf459928eb" ON "user_details" ("nickname") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL DEFAULT 'firstName', "last_name" character varying NOT NULL DEFAULT 'lastName', "password" character varying NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "role_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_8d5e97c30a0ba60a324439a114d" FOREIGN KEY ("avatar_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_d8f2eb7c073c64fb729d66c4e87" FOREIGN KEY ("cover_photo_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_ef1a1915f99bcf7a87049f74494" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_ef1a1915f99bcf7a87049f74494"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_d8f2eb7c073c64fb729d66c4e87"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_8d5e97c30a0ba60a324439a114d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_182a355d5a26d08ccf459928eb"`);
        await queryRunner.query(`DROP TABLE "user_details"`);
        await queryRunner.query(`DROP TYPE "public"."user_details_gender_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2131397e72958a5d3d76b356c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a26d04373d1dcc04c7f7aee21"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_332d10755187ac3c580e21fbc0"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
