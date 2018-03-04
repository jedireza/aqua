'use strict';
const Confidence = require('confidence');
const Dotenv = require('dotenv');


Dotenv.config({ silent: true });

const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    $meta: 'This file configures the plot device.',
    projectName: 'Aqua',
    port: {
        web: {
            $filter: 'env',
            test: 9000,
            production: process.env.PORT,
            $default: 8000
        }
    },
    baseUrl: {
        $filter: 'env',
        $meta: 'values should not end in "/"',
        production: process.env.BASE_URL,
        $default: 'http://127.0.0.1:8000'
    },
    authAttempts: {
        forIp: 50,
        forIpAndUser: 7
    },
    cookieSecret: {
        $filter: 'env',
        production: process.env.COOKIE_SECRET,
        $default: '!k3yb04rdK4tz~4qu4~k3yb04rdd0gz!'
    },
    hapiMongoModels: {
        mongodb: {
            uri: {
                $filter: 'env',
                production: process.env.MONGODB_URI,
                test: process.env.MONGODB_URI + '-test',
                $default: process.env.MONGODB_URI
            }
        },
        autoIndex: true
    },
    nodemailer: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    },
    system: {
        fromAddress: {
            name: 'Aqua',
            address: process.env.SMTP_USERNAME
        },
        toAddress: {
            name: 'Aqua',
            address: process.env.SMTP_USERNAME
        }
    }
};


const store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
