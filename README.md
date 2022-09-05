# Backend Project: News

## Database

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
