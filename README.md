# nestjs-rest-template

# How to set up database(Postgres and PGadmin) with docker compose file:
go to https://github.com/NazarPashazade/stack/tree/main/database


# How to set up Set up Absulute path:  
('.../../modules/user' == '@modules/user')

**STEP 1:** Typescript Fix:

```
    "paths": {
        "@config/*": [  "config/*"  ],
        "@modules/*": [   "modules/*"  ]
    },
```



**STEP 2:** Install **module-alias** package

``` 
yarn add module-alias 
```



**STEP 3:** Open package.json file. Add below lines:

 ```
       "_moduleAliases": {
            "@config/*": "./dist/config/*",
            "@modules/*": "./dist/modules/*"
       }
 ```


**STEP 3:** Use absolute path to import

```
import { RolesRepository } from '../../modules/user/repositories/roles.repository';  // BEFORE
import { RolesRepository } from '@modules/user/repositories/roles.repository';       // AFTER

```



