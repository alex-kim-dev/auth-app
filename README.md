# Auth app

This is a learning project - a full-stack web app with authentication and user management.

## Built with

- Typescript, Zod
- React, React Hook Form, Zustand, Axios, CSS & BEM
- PostgreSQL & Prisma, Express, Bcrypt, JWT

Hosted on Vercel and Render.

## What I've learned

I've learned how to do authentication from scratch using a pair of tokens - JWT for the access token and a random string for the refresh token. The access token is stored only on the front-end in a zustand store, and also in the session storage. The refresh token is stored in an http only secure cookie, and also it's hash is stored in a database, which allows revoking the token. There's a token rotation mechanism, written using axios interceptors, that gets a new pair of tokens once an access token is expired. Passwords are hashed with salt using bcrypt.

Also I'm starting to learn a bit more about the back-end development - this time I've got familiar with the Postges database, Prisma ORM, database modelling, writing an api with Express and its middlewares.

## Requirements

- [x] Register & login forms
- [x] User management table:
  - [x] id, name, e-mail, last login time, registration time, status (active/blocked)
  - [x] The leftmost column of the table should contain checkboxes without labels for multiple selection (table header contains only checkbox without label that selects or deselects all records).
  - [x] There must be a toolbar over the table with the following actions: Block, Unblock, Delete.
- [x] Only authenticated users should have access to the user management
- [x] All users should be able to block or delete themselves or any other user.
- [x] If user account is blocked or deleted any next user’s request should redirect to the login page.
- [x] Blocked user should not be able to login, deleted user can re-register.

## For the future

### Todo

- [ ] extend Express' Request type with mandatory fields so no checks needed for prisma or decoded user data
- [ ] support multiple sessions (refresh tokens?) per user

### Manual tests

- signup: email exists
- login:
  - banned
  - invalid email or password
    - no user
    - wrong password
    - correct order: wrong email/password, then banned
- refresh (on users manipulation and page reload):
  - banned
  - not authenticated
    - user deleted
    - token expired
- ban/unban/delete
  - users: some users not found
  - self: banned / not authenticated

### API errors

- `401` unauthorized: invalid email/password, invalid/missing RT or AT, deleted user
- `403` forbidden: banned
- `404` not found: users not found when manipulating them in the table
- `409` conflict: email exists
