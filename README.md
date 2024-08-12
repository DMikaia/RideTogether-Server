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

- Basic authentication with Firebase
- Data caching with [Redis](https://redis.io)
- User (create, update, getOne)
- Offer (creation, update, get, getAll)
- Review (creation, update, delete, getAll)
- Room (getAll)
- Live chat using websocket (Not scalable yet)

## Prerequisites

> [!NOTE]
> Using pgAdmin is optional, you can modify the [docker-compose.yml](docker-compose.yml) file to add the new postgresql service and use prisma to view the database.
>
> ```bash
> # command
> $ npx prisma studio
> ```

To be able to run the app you'll need to install:

- [nodejs](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [nest-cli](https://docs.nestjs.com/cli/overview#installation)
- [docker](https://docs.docker.com)
- [firebase-project](https://firebase.google.com)
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
> You'll also need to configure the firebase project and add authentication (e-mail and password) and storage, otherwise image authentication and storage won't work properly on either the server or client side. If you are not yet familiar with firebase, check out the [documentation](https://firebase.google.com/docs).

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
> At the moment, the tests are not available, so I've yet to implement them.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
