## Technology

Server side, the Indais Data Analytics Platform is built with the [hapi.js](https://hapijs.com/) framework
and toolset. We're using [MongoDB](http://www.mongodb.org/) as a data store. We
also use [Nodemailer](http://www.nodemailer.com/) for email transport.

The front-end is built with [React](http://facebook.github.io/react/). We're
using a totally vanilla [Flux](https://facebook.github.io/flux/)
implementation. Client side routing is done with [React
Router](https://github.com/rackt/react-router). We're using
[Gulp](http://gulpjs.com/) for the asset pipeline.

## Installation

```bash
$ git clone git@github.com:indais/data-analytics-platform.git && cd ./data-analytics-platform
$ npm install
```


## Setup

__WARNING:__ This will clear all data in existing `users`, `admins` and
`adminGroups` MongoDB collections. It will also overwrite `/config.js` if one
exists.

$ npm run setup

## Running the app

$ npm start


This will start the app using [`nodemon`](https://github.com/remy/nodemon).
`nodemon` will watch for changes and restart the app as needed.

Now you should be able to point your browser to http://localhost:8000/ and see
the welcome page.



## Features

 - Basic front end web pages
 - Contact page has form to email
 - Account signup page
 - Login system with forgot password and reset password
 - Abusive login attempt detection
 - User roles for accounts and admins
 - Facilities for notes and status updates
 - Admin groups with shared permissions
 - Admin level permissions that override group permissions

