# Aqua

A website and user system starter. Implemented with Hapi, React and Flux.

[![Build Status](https://travis-ci.org/jedireza/aqua.svg?branch=master)](https://travis-ci.org/jedireza/aqua)
[![Dependency Status](https://david-dm.org/jedireza/aqua.svg?style=flat)](https://david-dm.org/jedireza/aqua)
[![devDependency Status](https://david-dm.org/jedireza/aqua/dev-status.svg?style=flat)](https://david-dm.org/jedireza/aqua#info=devDependencies)


## Technology

Server side, Aqua is built with the [hapi.js](https://hapijs.com/) framework
and toolset. We're using [MongoDB](http://www.mongodb.org/) as a data store. We
also use [Nodemailer](http://www.nodemailer.com/) for email transport.

The front-end is built with [React](http://facebook.github.io/react/). We're
using a totally vanilla [Flux](https://facebook.github.io/flux/)
implementation. Client side routing is done with [React
Router](https://github.com/rackt/react-router). We're using
[Gulp](http://gulpjs.com/) for the asset pipeline.


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
# [23:41:44] Starting 'react'...
# [23:41:44] Finished 'react' after 515 ms
# [23:41:45] Using gulpfile ~/projects/aqua/gulpfile.js
# [23:41:45] Starting 'watch'...
# [23:41:45] Finished 'watch' after 82 ms
# [23:41:45] Starting 'less'...
# [23:41:45] Finished 'less' after 15 ms
# [23:41:45] Starting 'webpack'...
# [23:41:45] Starting 'react'...
# [23:41:45] Starting 'nodemon'...
# [23:41:45] Finished 'nodemon' after 1.01 ms
# [23:41:45] Starting 'media'...
# [gulp] [nodemon] v1.3.7
# [gulp] [nodemon] to restart at any time, enter `rs`
# [gulp] [nodemon] watching: *.*
# [gulp] [nodemon] starting `node server.js`
# Started the plot device.
# [23:41:47] Finished 'media' after 2.16 s
# [23:42:01] [webpack] Hash: 746152d2793c42fb1240
# ...
# [23:42:01] Finished 'webpack' after 16 s
```

This will start the app using [`nodemon`](https://github.com/remy/nodemon).
`nodemon` will watch for changes and restart the app as needed.

Now you should be able to point your browser to http://localhost:8000/ and see
the welcome page.


## Philosophy

 - Create a website and user system
 - Write code in a simple and consistent way
 - It's just JavaScript
 - 100% test coverage


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
initiative to include basic debugging information like operating system
and relevant version details such as:

```bash
$ npm version

# { aqua: '0.0.0',
#   npm: '2.5.1',
#   http_parser: '2.3',
#   modules: '14',
#   node: '0.12.0',
#   openssl: '1.0.1l',
#   uv: '1.0.2',
#   v8: '3.28.73',
#   zlib: '1.2.8' }
```

Contributions are welcome. Your code should:

 - include 100% test coverage
 - follow the [hapi.js coding conventions](http://hapijs.com/styleguide)

If you're changing something non-trivial, you may want to submit an issue
first.


## Running tests

[Lab](https://github.com/hapijs/lab) is part of the hapi.js toolset and what we
use to write all of our tests.

For command line output:

```bash
$ npm test

# > aqua@1.0.0 test /Users/jedireza/projects/aqua
# > lab -c -L ./test/client-before.js ./test/client/ ./test/client-after.js ./test/misc/ ./test/server/

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
#  ..................................................
#  ..................................................
#  ..................................................
#  ......

# 1006 tests complete
# Test duration: 11004 ms
# No global variable leaks detected
# Coverage: 100.00%
# Linting results: No issues
```

With html code coverage report:

```bash
$ npm run test-cover

# > aqua@1.0.0 test-cover /Users/jedireza/projects/aqua
# > lab -c -r html -o ./test/artifacts/coverage.html ./test/client-before.js ./test/client/ ./test/client-after.js ./test/misc/ ./test/server/ && open ./test/artifacts/coverage.html
```

This will run the tests and open a web browser to the visual code coverage
artifacts. The generated source can be found in `/tests/artifacts/coverage.html`.


## License

MIT

## Don't forget

What you build with Aqua is more important than Aqua.
