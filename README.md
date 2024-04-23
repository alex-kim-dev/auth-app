[![CI](https://github.com/alex-kim-dev/auth-app/actions/workflows/ci.yml/badge.svg)](https://github.com/alex-kim-dev/auth-app/actions/workflows/ci.yml)

# Auth app

Based on my [vite-react-template](https://github.com/alex-kim-dev/vite-react-template)

## Requirements

- [x] Typescript + React + Bootstrap
- [x] Register & login forms
- [x] User management table:
  - [x] id, name, e-mail, last login time, registration time, status (active/blocked)
  - [x] The leftmost column of the table should contain checkboxes without labels for multiple selection (table header contains only checkbox without label that selects or deselects all records).
  - [x] There must be a toolbar over the table with the following actions: Block (red button with text), Unblock (icon), Delete (icon).
- [x] Only authenticated users should have access the user management
- [x] All users should be able to block or delete themselves or any other user.
- [ ] If user account is blocked or deleted any next user’s request should redirect to the login page (works only after the access token is expired)
- [x] User can use any non-empty password (even one character) - min is 6: supabase requirement
- [x] Blocked user should not be able to login, deleted user can re-register.
