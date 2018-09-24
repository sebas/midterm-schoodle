# Schooodle


## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8081/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- bootstrap
- jQuery
- Fontawesome
- PostgresSQL
- Knex
- Morgan
- Knex Logger

## Final Product

!["Organize"](/docs/-m.png)
!["Define"](/docs/-new.png)
!["Vote"](/docs/.png)
!["Pick"](/docs/t.png)

## Thanks for try it
:+1: :sparkles: :camel: :tada:
:rocket: :metal: :octocat: