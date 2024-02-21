# nestjs-rest-template

# How to set up database(Postgres and PGadmin) with docker compose file:
go to https://github.com/NazarPashazade/stack/tree/main/database


# Set up Absulute path:  ('.../../modules/user' ----->  '@modules/user')

1) update Typescript configuration: tsconfig.json

      "paths": {

          "@config/*": [ "config/*" ],
          "@modules/*": [ "modules/*"]

        },
