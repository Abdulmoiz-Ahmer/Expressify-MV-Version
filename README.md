# Expressify

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

`Expressify` is an express mvc like boilerplate for building rest api's.

- The boilerplate follows a rough mvc kind of structure.
- Linting and formatting are already a part of the boilerplate.
- Babel is also part of the boilerplate.
- Path Aliasing is also a part of the boilerplate.
- Register, Login and Password Recovery, Password Change calls are already a part of the boilerplate.

## Setup

Install the Repository:

```
git clone https://github.com/Abdulmoiz-Ahmer/express-boiler-plate-with-mongo-configuration.git
cd express-boiler-plate-with-mongo-configuration
```

Add the values to the variables in .Env:

```
CONNECTION_STRING=MongoDB string
JWT_SECRET=
SENDER_EMAIL=sender email
SENDGRID_API_KEY=Twilio SendGrid Key
```

Install nodemodules and start server.

```
yarn install
yarn server
```

or

```
npm install
npm run server
```

## Usage

```
BaseUrl=localhost:4000/api/v1
```

```

METHOD: POST
PATH: /auth/register
REQUEST: Body {
    "email":"email",
    "password":"Password"
    "confirm_password":"Password"
}
INVOKE: curl -X POST -H "Content-Type: application/json" -d '{"email":"<insert-email-here>","password":"<insert-password-here>","confirm_password":"<insert-password-here>"}' http://localhost:4000/api/v1/auth/register

```

```

METHOD: POST
PATH: /auth/login
REQUEST: Body {
"email": "email",
"password": "Password",
"remember_me": false //optional
}
INVOKE: curl -X POST -H "Content-Type: application/json" -d '{"email":"<insert-email-here>","password":"<insert-password-here>"}' http://localhost:4000/api/v1/auth/login

```

```

METHOD: PUT
PATH: /auth/refresh-session
REQUEST: Headers {
    refresh_token:<refresh-token>
}
INVOKE: curl -X PUT -H "refresh_token:<refresh-token-here>"  http://localhost:4000/api/v1/auth/refresh-session

```

```

METHOD: PATCH
PATH: /auth/forgot-password
REQUEST: Headers {
    email:<email>
}

INVOKE: curl -X PATCH -H "email:<insert-email-here>" http://localhost:4000/api/v1/auth/forgot-password

```

```

METHOD: PATCH
PATH: /auth/reset-password
REQUEST: Body {
    "otp":"otp code",
    "password":"Password",
    "confirm_password":"Password"
 }
INVOKE: curl -X PATCH -H "Content-Type: application/json" -d '{"otp":"<otp-code-here>","password":"<insert-password-here>","confirm_password":"<insert-password-here>"}' http://localhost:4000/api/v1/auth/reset-password

```

```

METHOD: GET
PATH: /test
INVOKE: curl  http://localhost:4000/api/v1/test

```

```
METHOD: PATCH
PATH: /profile-settings/change-password
     Headers {
        authorization:bearer <access-token>
     }
REQUEST: Body {
    "old_password":"Password",
    "new_password":"Password",
    "confirm_password":"Password"
 }

 INVOKE: curl -X PATCH  -H "Content-Type: application/json" -H "authorization:bearer <insert-access-token-here>" -d '{"old_password":"<insert-password-here>","new_password":"<insert-password-here>","confirm_password":"<insert-password-here>"}' http://localhost:4000/api/v1/profile-settings/change-password

```

```

METHOD: GET
PATH: /authTest
REQUEST: Headers {
    authorization:bearer <token>
 }
INVOKE: curl -X GET -H "authorization:bearer <<insert-access-token-here>"  http://localhost:4000/api/v1/authTest

```

## License

[MIT](https://opensource.org/licenses/mit-license.html)

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
