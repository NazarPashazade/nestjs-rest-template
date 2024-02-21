# nestjs-rest-template


## How to set up Postgres and PGadmin:

- [use Docker compose file: (https://github.com/NazarPashazade/stack/tree/main/database)]

 

## How to set up Set up Absulute path:

**Converting Relative path to Absolute Path**('.../../modules/user' == '@modules/user')


- **STEP 1:** Typescript Fix: (tsconfig.json)

```
    "paths": {
        "@config/*": [  "config/*"  ],
        "@modules/*": [   "modules/*"  ]
    },
```



- **STEP 2:** Install **module-alias** package

``` 
yarn add module-alias 
```



- **STEP 3:** Open package.json file. Add below lines:

 ```
       "_moduleAliases": {
            "@config/*": "./dist/config/*",
            "@modules/*": "./dist/modules/*"
       }
 ```



- **STEP 3:** Use absolute path to import

```
import { RolesRepository } from '../../modules/user/repositories/roles.repository';  // BEFORE
import { RolesRepository } from '@modules/user/repositories/roles.repository';       // AFTER

```



