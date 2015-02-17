var React = require('react/addons');


var Component = React.createClass({
    render: function () {

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/public/core.min.css" />
                    <link rel="shortcut icon" href="/public/media/favicon.ico" />
                    {this.props.neck}
                </head>
                <body>
                    {this.props.children}
                    <script src="/public/core.min.js"></script>
                    {this.props.feet}
                </body>
            </html>
        );
    }
});


module.exports = Component;
