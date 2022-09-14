# Backend Project: News API

## Summary

This project I made as part of the Backend module at [Northcoders](https://northcoders.com/). It aimed to build an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

-> [Hosted Version](https://news-backend-project.herokuapp.com/)

## Getting started

### 1. Clone this repository

```
https://github.com/ismaelpaul/be-nc-news.git
cd be-nc-news
```

### 2. Install packages and dependencies

```
npm install
npm install -D jest
npm install -D jest-sorted
npm install -D supertest
```

### 3. Seed local database

The database is PSQL, and we will interact with it using node-postgres.
You can add these two scripts to package.json

```
"scripts":
{
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/seeds/run-seed.js",
  }
```

And then run it

```
npm run setup-dbs
npm run seed
```

### 4. Create .env files

You’ll have two databases in this project. One for real looking dev data and another for simpler test data.

You will need to create two `.env` files (in the main folder) for your project: `.env.test` and `.env.development`. Into each, add:

```
PGDATABASE=<database_name_here>
```

with the correct database name for that environment (see `/db/setup.sql` for the database names).

So the `.env.test` file should be as follow:

```
PGDATABASE=nc_news_test
```

And the `.env.development` file should be:

```
PGDATABASE=nc_news
```

**_Double check_** that these .env files are `.gitignored`.

### 5. Run tests

```
npm test
```

## Requirements

<ul>
    <li>Node.js version 16.17.0</li>
    <li>Postgres version 14.5</li>

</ul>
