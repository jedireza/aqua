var React = require('react/addons');


var Component = React.createClass({
    onPrevPage: function () {

        this.props.onChange(this.props.pages.prev);
    },
    onNextPage: function () {

        this.props.onChange(this.props.pages.next);
    },
    render: function () {

        return (
            <div className="well">
                <div className="btn-group pull-left">
                    <button
                        className="btn btn-default"
                        disabled={true}>

                        Page {this.props.pages.current} of {this.props.pages.total}
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={true}>

                        Rows {this.props.items.begin} - {this.props.items.end} of {this.props.items.total}
                    </button>
                </div>
                <div className="btn-group pull-right">
                    <button
                        ref="prev"
                        className="btn btn-default"
                        disabled={!this.props.pages.hasPrev}
                        onClick={this.onPrevPage}>

                        Prev
                    </button>
                    <button
                        ref="next"
                        className="btn btn-default"
                        disabled={!this.props.pages.hasNext}
                        onClick={this.onNextPage}>

                        Next
                    </button>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});


module.exports = Component;
