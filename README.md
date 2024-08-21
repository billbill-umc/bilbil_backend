# BilBil Back-end Repository

## Requirements

* Node.js >= 20.15.1
* Yarn >= 1.22.22
* Docker >= 25.0.3

## Startup

1. `yarn install` for install dependencies.
2. `yarn start:dev-db` for start databases in docker. (So you need to have docker installed)
3. `yarn start:dev` for start the server in development mode.

## Environment variables
| name           | description              | default                |
|----------------|--------------------------|------------------------|
| INFO_LOG       | log file path            | logs/%DATE%.log        |
| ERROR_LOG      | error log file path      | logs/%DATE%.error      |
| MAX_LOG_SIZE   | log file maximum size    | 20m                    |
| MAX_LOG_FILES  | maximum log file numbers | 14d                    |
| TOKEN_SECRET   | JWT token secret         |                        |
| AREA_CSV_FILE  | Area data csv file path  | docs/area_20240513.csv |
| DB_HOST        | MySQL DB host            | localhost              |
| DB_PORT        | MySQL DB port            | 3306                   |
| DB_USER        | MySQL DB username        | bilbil                 |
| DB_PASSWORD    | MySQL DB password        | bilbil                 |
| DB_DATABASE    | MySQL DB database name   | bilbil                 |
| REDIS_HOST     | Redis host               | localhost              |
| REDIS_PORT     | Redis port               | 6379                   |
| MAIL_USER      | SMTP mail user           |                        |
| MAIL_PASSWORD  | SMTP mail password       |                        |
| MAIL_HOST      | SMTP mail host           |                        |
| MAIL_PORT      | SMTP mail port           | 465                    |
| AWS_ACCESS_KEY | AWS access key id        |                        |
| AWS_SECRET_KEY | AWS secret access key    |                        |
| AWS_REGION     | AWS region               |                        |
| AWS_S3_BUCKET  | AWS S3 bucket name       |                        | 

This project using `dotenv` package so you can using `.env` file for setting environment variables.    
See more in `.env.example` file

## Back-end Infrastructure
![infrastructure-diagram.png](https://raw.githubusercontent.com/billbill-umc/bilbil_backend/main/docs/infrastructure-diagram.png)

### AWS Based infrastructure   
* Server: EC2
* DB: MySQL in RDS
* Cache: Redis in ElastiCache
* Storage (static file hosting): S3
* DNS: Cloudflare
* Docker registry: ECR

### CI/CD Pipeline
1. Commit code to `feat/*` branch.
2. Create a pull request to `main` branch and merge it.
3. If the `main` branch is suitable for publish, then create PR to `publish` branch.
4. Merging PR to `publish`, then Github Actions script will be triggered.
5. Triggered script will build the project to dockerfile and push it to AWS ECR.
6. The script also will deploy the new image to EC2 and restart the container.


## Tech Stack
See more in [package.json](https://github.com/billbill-umc/bilbil_backend/blob/main/package.json)

### Runtime
* [Express](https://expressjs.com/): Web framework for Node.js
* [Knex](https://knexjs.org/): SQL builder for Node.js
* [multer](https://www.npmjs.com/package/multer): Express.js middleware for handling `multipart/form-data` (binary file upload)
* [Nodemailer](https://nodemailer.com/): SMTP client for Node.js
* [Redis](https://github.com/redis/node-redis): Redis client for Node.js
* [Socket.io](https://socket.io/): Real-time bidirectional event-based communication (like websocket) library for Node.js
* [winston](https://github.com/winstonjs/winston): Node.js logging library (Like log4j in Java)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): JWT library for Node.js
* [Passport.js](https://www.passportjs.org/): Express.js middleware for authentication (esp. HTTP Bearer token)
* [Zod](https://zod.dev/): Node.js object validator
* [AWS SDK v3](https://github.com/aws/aws-sdk-js-v3): AWS SDK for Node.js (esp. S3)

### Development
* [Babel](https://babeljs.io/): JS transpiler
* [ESLint](https://eslint.org/): JS linter
* [ESLint Stylistic](https://eslint.style/): ESLint plugin for formatting (Replace Prettier)
* [Jest](https://jestjs.io/): JS testing framework
* [Supertest](https://www.npmjs.com/package/supertest): Testing library for Express.js HTTP call
* [Nodemon](https://www.npmjs.com/package/nodemon): File watcher for restart server automatically
