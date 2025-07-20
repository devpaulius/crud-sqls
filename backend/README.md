cd backend
cp .env.example .env            # or create .env manually (see below)
npm install
npx prisma generate             # create Prisma client
npx prisma migrate dev --name init   # creates dev.db + tables
npm run dev                     # http://localhost:5000


* JWT auth (register / login)
* Posts CRUD + likes + scheduled publish
* Categories CRUD
* Public / private user profiles
* Admin panel (block / unblock users, approve posts)
* Dark / light theme stored in DB
* Runs on **any SQL** – default is SQLite, swap `DATABASE_URL` for MySQL, Postgres, etc.


npx prisma generate
<!-- npx prisma migrate dev --name sqlite ==> bad -->
<!-- npx prisma migrate dev --create-only --name init-sqlite -->

npx prisma migrate dev --name init-sqlite
npx prisma migrate deploy
