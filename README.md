# Aqua

A website and user system starter.

[![Build Status](https://travis-ci.org/jedireza/aqua.svg?branch=master)](https://travis-ci.org/jedireza/aqua)
[![Dependency Status](https://david-dm.org/jedireza/aqua.svg?style=flat)](https://david-dm.org/jedireza/aqua)
[![devDependency Status](https://david-dm.org/jedireza/aqua/dev-status.svg?style=flat)](https://david-dm.org/jedireza/aqua#info=devDependencies)


## Technology

Server side, Aqua is built with the [hapi.js](https://hapijs.com/) framework
and toolset. We're using [MongoDB](http://www.mongodb.org/) as a data store.

The front-end is built with [React](https://github.com/facebook/react). We're
using [Redux](https://github.com/reactjs/redux) as our state container. Client
side routing is done with [React Router](https://github.com/reactjs/react-router).
We're using [Gulp](http://gulpjs.com/) for the build system.


## API only

If you don't use React and/or would rather bring your own front-end, checkout
[Frame](https://github.com/jedireza/frame). It's just the HTTP API parts of Aqua.


## Live demo

| url                                                              | username | password |
|:---------------------------------------------------------------- |:-------- |:-------- |
| [https://getaqua.herokuapp.com/](https://getaqua.herokuapp.com/) | root     | root     |

__Note:__ The live demo has been modified so you cannot change the root user,
the root user's linked admin role or the root admin group. This was done in
order to keep the app ready to use at all times.


## Requirements

You need [Node.js](http://nodejs.org/download/) and
[MongoDB](http://www.mongodb.org/downloads) installed and running.

We use [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) for hashing
secrets. If you have issues during installation related to `bcrypt` then [refer
to this wiki
page](https://github.com/jedireza/aqua/wiki/bcrypt-Installation-Trouble).


## Installation

```bash
$ git clone git@github.com:jedireza/aqua.git && cd ./aqua
$ npm install
```


## Setup

__WARNING:__ This will clear all data in existing `users`, `admins` and
`adminGroups` MongoDB collections. It will also overwrite `/config.js` if one
exists.

```bash
$ npm run setup

# > aqua@0.0.0 setup /Users/jedireza/projects/aqua
# > ./setup.js

# Project name: (Aqua)
# MongoDB URL: (mongodb://localhost:27017/aqua)
# Root user email: jedireza@gmail.com
# Root user password:
# System email: (jedireza@gmail.com)
# SMTP host: (smtp.gmail.com)
# SMTP port: (465)
# SMTP username: (jedireza@gmail.com)
# SMTP password:
# Setup complete.
```


## Running the app

```bash
$ npm start

# > aqua@0.0.0 start /Users/jedireza/projects/aqua
# > gulp react && gulp

# [23:41:44] Using gulpfile ~/projects/aqua/gulpfile.js
# ...
```

This will start the app using [`nodemon`](https://github.com/remy/nodemon).
`nodemon` will watch for changes and restart the app as needed.

Now you should be able to point your browser to http://127.0.0.1:8000/ and see
the welcome page.

We also pass the `--inspect` flag to Node so you have a debugger available.
Watch the output of `npm start` and look for the debugging url and open it in
Chrome. It looks something like this:

`chrome-devtools://devtools/remote/serve_file/@62cd277117e6f8ec53e31b1be58290a6f7ab42ef/inspector.html?experiments=true&v8only=true&ws=localhost:9229/node`


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


## Questions and contributing

Any issues or questions (no matter how basic), open an issue. Please take the
initiative to read relevant docs and if possible create a pull request.

Contributions are welcome. Your code should:

 - include 100% test coverage
 - follow the [hapi.js coding conventions](http://hapijs.com/styleguide)

If you're changing something non-trivial, you may want to submit an issue
before creating a large pull request.


## Running tests

[Lab](https://github.com/hapijs/lab) is part of the hapi.js toolset and what we
use to write all of our tests.

For command line output:

```bash
$ npm test

# > aqua@0.0.0 test /Users/jedireza/projects/aqua
# > lab -t 100 -S -T ./test/lab/transform -L --lint-options '{"extensions":[".js",".jsx"]}' ./test/lab/client-before.js ./test/client/ ./test/lab/client-after.js ./test/server/ ./test/lab/server-after.js ./test/misc/

#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  ..................................................
#  .............

# 863 tests complete
# Test duration: 6382 ms
# No global variable leaks detected
# Coverage: 100.00%
# Linting results: No issues
```


## License

MIT

## Don't forget

What you build with Aqua is more important than Aqua.
