
# Mean Enterprise Starter Server

Back End solution for an enterprise application 

## Usage

* ```npm start``` compile to /dist and serve application + watch for source changes.

* ```npm test``` compile to /dist and run tests + watch for source changes.

* ```npm run test:once``` compile to /dist and run tests once.

* ```npm run serve``` serve application only (must be pre-compiled to /dist).

* ```npm run build``` compile to /dist

* ```npm run build:watch``` compile to /dist + watch for source changes

## Setting up the environment variables

```bash
    cp config/config.template.json config/config.json
```

## DB Management

*   Run MongoDB server without authorization
    ```mongod```
    
*   Run MongoDB server with authorization
    ```mongod --auth```

*   Setup database

    ```scripts/setupDb.sh -h localhost -d mean-enterprise-starter -u root -p example```
    
    *   -h : Mongo process hostname
    *   -d : Database name
    *   -u : Mongo user
    *   -p : Mongo password

*   Connect to mongo shell
    
    ```mongo mongodb://root:example@localhost:27017/mean-enterprise-starter```

## Miscellaneous

* Count lines of code
    ```
    find src -name '*.ts' | xargs wc -l
    ```
