<p align="left">
  <img src="assets/logo.png" height="200" width="200" alt="Ride Together Logo" />
</p>

## Description

This is the server part of my team's school project called "ride together" (carpooling web application). The purpose of this application is to help people find carpooling offers easily.

## Features

Here are the current features right now:

- Basic authentication with Firebase & PostgreSQL
- User (find, update)
- Offer (creation, find, update)
- Room (find)
- Review (crud)
- Live chat using websocket (Not scalable yet)
- Data caching with Redis

## Installation

```bash
# command
$ npm install
```

## Running the app

To be able to run the app you'll need to install [npm](https://www.npmjs.com/) and also [docker](https://docs.docker.com) on your machine.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# docker contrainer
$ docker-compose up -d
```

## Test

> [!NOTE]
> I still have to set up tests for all the modules, which will make it easier to test the application.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment

```bash
# PostgreSQL database
DATABASE_URL=

# Firebase variables
TYPE=
PROJECT_ID=
PRIVATE_KEY_ID=
PRIVATE_KEY=
CLIENT_EMAIL=
CLIENT_ID=
UTH_URI=
TOKEN_URI=
AUTH_CERT_URL=
CLIENT_CERT_URL=
UNIVERSAL_DOMAIN=

# Redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```
