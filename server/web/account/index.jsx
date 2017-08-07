'use strict';
const React = require('react');


class AccountPage extends React.Component {
    render() {

        return (
            <html>
                <head>
                    <title>Account</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/public/core.min.css" />
                    <link rel="stylesheet" href="/public/pages/account.min.css" />
                    <link rel="shortcut icon" href="/public/media/favicon.ico" />
                </head>
                <body>
                    <div id="app-mount"></div>
                    <script src="/public/core.min.js"></script>
                    <script src="/public/pages/account.min.js"></script>
                </body>
            </html>
        );
    }
}


module.exports = AccountPage;
