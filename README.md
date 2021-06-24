# Expressify

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

`Expressify` is an express boilerplate for building rest api's.

- Register, Login and Password Recovery, Password Change calls are already a part of the boilerplate.
- You can build api calls on top of it.
- The boilerplate follows a rough mvc kind of structure.

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
```

```
METHOD: POST 
PATH: /auth/login
REQUEST: Body {
"email": "email",
"password": "Password",
"remember_me": false
}
```

```
METHOD: PUT 
PATH: /auth/refresh-session
REQUEST: Headers {
    refresh_token:<token>
}
```

```
METHOD: PATCH  
PATH: /auth/forgot-password
REQUEST: Headers {
    email:<email>
}
```

```
METHOD: PATCH  
PATH: /auth/reset-password
REQUEST: Body {
    "otp":"otp code",
    "password":"Password",
    "confirm_password":"Password"
 }
```

```
METHOD: GET  
PATH: /test
```

```
METHOD: PATCH  
PATH: /profile-settings/change-password
     Headers {
        authorization:bearer <token>
     }
REQUEST: Body {
    "old_password":"Password",
    "new_password":"Password",
    "confirm_password":"Password"
 }
```

```
METHOD: GET  
PATH: /authTest
REQUEST: Headers {
    authorization:bearer <token>
 }
```

## License

[MIT](https://opensource.org/licenses/mit-license.html)

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
