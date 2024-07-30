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
| name           | description              | default                          |
|----------------|--------------------------|----------------------------------|
| INFO_LOG       | log file path            | logs/%DATE%.log                  |
| ERROR_LOG      | error log file path      | logs/%DATE%.error                |
| MAX_LOG_SIZE   | log file maximum size    | 20m                              |
| MAX_LOG_FILES  | maximum log file numbers | 14d                              |
| TOKEN_SECRET   | JWT token secret         | wPi8cmXPp3kTqJmvdHE6mfn0iqiP3dVE |
| AREA_CSV_FILE  | Area data csv file path  | docs/area_20240513.csv           |
| DB_HOST        | MySQL DB host            | localhost                        |
| DB_PORT        | MySQL DB port            | 3306                             |
| DB_USER        | MySQL DB username        | bilbil                           |
| DB_PASSWORD    | MySQL DB password        | bilbil                           |
| DB_DATABASE    | MySQL DB database name   | bilbil                           |
| REDIS_HOST     | Redis host               | localhost                        |
| REDIS_PORT     | Redis port               | 6379                             |
| REDIS_USERNAME | Redis username           | default                          |
| REDIS_PASSWORD | Redis password           | bilbil                           | 

This project using `dotenv` package so you can using `.env` file for setting environment variables.    
See more in `.env.example` file
