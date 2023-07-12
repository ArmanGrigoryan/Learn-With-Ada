# server

# Back-end Project Set Up

## Stage 1 (Cloning from git)

Run following commands to clone from GitHub.

    git clone https://github.com/learnwithada/web-js.git

## Stage 2 (Add .env file)

Create .env file in ./server/src/envs directory with such content

    PORT=8000
    DB_PASS=
    DB_USER=
    DB_HOST=
    DB_NAME=
    DB_PORT=
    SSL_MODE=
    ADMIN_PASS=
    SPACES_KEY=
    SENDGRID_KEY=
    SENDGRID_MAIL=
    SECRET_SPACES=
    SALT=
    JWT_KEY=
    INVITE_KEY=
    DIGITAL_OCEAN_ENDPOINT=
    CLIENT_HOST=
    ACCESS_TIME=8h
    BUCKET=

## Stage 3 (Installing node modules, and running project on server);

Run following commands to set up project.

    npm install
    npm run prettify
    npm run lint
    npm run postgres:up (only for first time)
    npm run postgres:seed:up (only for first time)
    npm run dev

## Requirements

    Node JS v16.14.0
    TypeScript v4.6.2

## Installing PostgreSQL (MacOS)

You must have [Homebrew](https://brew.sh/) installed first, then:

```sh
brew update
brew install postgresql
```

To then start MongoDB:

`brew services start postgresql`

To stop MongoDB:

`brew services stop postgresql`

Source: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

You should then be able to use a tool like [DBVisualizer](https://www.dbvis.com/) to connect to your local instance on `postgres://localhost:5432`.
