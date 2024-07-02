# Auth app

## Requirements

- [x] Typescript + React
- [x] Register & login forms
- [x] User management table:
  - [x] id, name, e-mail, last login time, registration time, status (active/blocked)
  - [x] The leftmost column of the table should contain checkboxes without labels for multiple selection (table header contains only checkbox without label that selects or deselects all records).
  - [x] There must be a toolbar over the table with the following actions: Block, Unblock, Delete.
- [x] Only authenticated users should have access to the user management
- [x] All users should be able to block or delete themselves or any other user.
- [x] If user account is blocked or deleted any next user’s request should redirect to the login page.
- [x] Blocked user should not be able to login, deleted user can re-register.
