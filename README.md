# Expressify

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

`Expressify` is an express mvc like boilerplate for building rest api's with mongodb.

- The boilerplate follows a rough mvc kind of structure.
- Linting and formatting are already a part of the boilerplate.
- Babel is also part of the boilerplate.
- Path Aliasing is also a part of the boilerplate.
- Register, Login and Password Recovery, Password Change calls are already a part of the boilerplate.
- Swagger UI with JS Doc is also part of the boilerplate. You can access the api's through ui using route (/api-docs).
- Test Cases using mocha, chai and chaihttp are also part of the boilerplate.


## Swagger Route Showing Availble Api's
![swaggerui](https://user-images.githubusercontent.com/43717814/123559836-f25b7880-d7b7-11eb-80f0-c2b3b25f4cfd.png)


## Setup

Install the Repository:

```
git clone https://github.com/Abdulmoiz-Ahmer/express-boiler-plate-with-mongo-configuration.git
cd express-boiler-plate-with-mongo-configuration
```

Add the values to the variables in .Env:

```
CONNECTION_STRING_TESTING=<MongoDB Connection String For Testing/Development>
CONNECTION_STRING_PRODUCTION=<MongoDB Connection String For Production>
API_KEY=<Secret Key>
JWT_SECRET=<Secret For JSON Web Tokens>
SENDER_EMAIL=<sender email>
SENDGRID_API_KEY=<Twilio SendGrid Key>

//Optional It is only use in one route if you want to use that route than Front end ui screen to reset password after code is sent to email will be required.
FRONTEND_URL=
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
REQUEST: Headers {
    x-api-key:<api-key>
}
REQUEST: Body {
    "email":"email",
    "password":"Password"
    "confirm_password":"Password"
}
INVOKE: curl -X POST -H "Content-Type: application/json" -H 'x-api-key:<insert-api-key-here>' -d '{"email":"<insert-email-here>","password":"<insert-password-here>","confirm_password":"<insert-password-here>"}' http://localhost:4000/api/v1/auth/register
```

```
METHOD: POST
PATH: /auth/login
REQUEST: Headers {
    x-api-key:<api-key>
}
REQUEST: Body {
"email": "email",
"password": "Password",
"remember_me": false //optional
}
INVOKE: curl -X POST -H "Content-Type: application/json"  -H 'x-api-key:<insert-api-key-here>' -d '{"email":"<insert-email-here>","password":"<insert-password-here>"}' http://localhost:4000/api/v1/auth/login
```

```
METHOD: PUT
PATH: /auth/refresh-session
REQUEST: Headers {
    refresh_token:<refresh-token>
    x-api-key:<api-key>
}
INVOKE: curl -X PUT -H "refresh_token:<refresh-token-here>"  -H 'x-api-key:<insert-api-key-here>'  http://localhost:4000/api/v1/auth/refresh-session
```

```
METHOD: PATCH
PATH: /auth/forgot-password
REQUEST: Headers {
    email:<email>
    x-api-key:<api-key>
}

INVOKE: curl -X PATCH -H "email:<insert-email-here>"  -H 'x-api-key:<insert-api-key-here>' http://localhost:4000/api/v1/auth/forgot-password

```

```
METHOD: PATCH
PATH: /auth/reset-password
REQUEST: Headers {
    x-api-key:<api-key>
}
REQUEST: Body {
    "otp":"otp code",
    "password":"Password",
    "confirm_password":"Password"
}
INVOKE: curl -X PATCH -H "Content-Type: application/json"  -H 'x-api-key:<insert-api-key-here>' -d '{"otp":"<otp-code-here>","password":"<insert-password-here>","confirm_password":"<insert-password-here>"}' http://localhost:4000/api/v1/auth/reset-password
```

```
METHOD: GET
PATH: /test
REQUEST: Headers {
    api_key:<api_key>
    refresh_token:<refresh-token>
}
INVOKE: curl -H 'x-api-key:<api-key-here>' http://localhost:4000/api/v1/test
```

```
METHOD: PATCH
PATH: /profile-settings/change-password
REQUEST: Headers {
        authorization:bearer <access-token>
        x-api-key:<api-key>
}
REQUEST: Body {
    "old_password":"Password",
    "new_password":"Password",
    "confirm_password":"Password"
}

 INVOKE: curl -X PATCH  -H "Content-Type: application/json"  -H 'x-api-key:<insert-api-key-here>' -H "authorization:bearer <insert-access-token-here>"  -d '{"old_password":"<insert-password-here>","new_password":"<insert-password-here>","confirm_password":"<insert-password-here>"}' http://localhost:4000/api/v1/profile-settings/change-password
```

```
METHOD: GET
PATH: /authTest
REQUEST: Headers {
    authorization:bearer <token>
    x-api-key:<api-key>
}
INVOKE: curl -X GET  -H 'x-api-key:<insert-api-key-here>' -H "authorization:bearer <insert-access-token-here>"  http://localhost:4000/api/v1/authTest
```

## License

[MIT](https://opensource.org/licenses/mit-license.html)

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
