# Ride Together

![preview](assets/logo.png)

This is the server part of my team's school project called **Ride Together** (carpooling web application). The purpose of this application is to help people find carpooling offer easily.

## Content

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment](#environment)
- [Running the app](#running-the-app)
- [Testing](#testing)

## Features

Here are the current features right now:

- Basic authentication with Firebase & PostgreSQL
- User (create, update, getOne)
- Offer (creation, update, get, getAll)
- Room (getAll)
- Review (creation, update, delete, getAll)
- Live chat using websocket (Not scalable yet)
- Data caching with [Redis](https://redis.io)

## Prerequisites

To be able to run the app you'll need to install:

- [nodejs](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [nest-cli](https://docs.nestjs.com/cli/overview#installation)
- [docker](https://docs.docker.com)
- [firebase-project](https://firebase.google.com)

For the database I am using:

> [!NOTE]
> I've only installed the redis stack with docker, but you can also add the postgresql container. All you need to do is modify the [docker-compose.yml](docker-compose.yml) file to add the new container and use prisma studio to view the database, so using pgAdmin is optional.
>
> ```bash
> # command
> $ npx prisma studio
> ```

- [pgAdmin](https://www.pgadmin.org/download/)

## Installation

```bash
# command
$ npm install

# redis stack contrainer
$ docker-compose up -d
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

## Running the app

> [!IMPORTANT]
> You'll also need to configure the firebase project and add authentication (email and password) and storage, otherwise authentication and image storage won't work properly on either the server or client side. If you are not yet familiar with firebase, you may wish to consult the [documentation](https://firebase.google.com/docs)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

> [!WARNING]
> I still have to set up tests for all controllers, providers and services, so the tests are not yet available.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
