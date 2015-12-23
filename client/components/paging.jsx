'use strict';
const React = require('react');


const propTypes = {
    items: React.PropTypes.object,
    onChange: React.PropTypes.func,
    pages: React.PropTypes.object
};


class Paging extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
    }

    onPrevPage() {

        this.props.onChange(this.props.pages.prev);
    }

    onNextPage() {

        this.props.onChange(this.props.pages.next);
    }

    render() {

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
                        ref={(c) => (this.els.prev = c)}
                        className="btn btn-default"
                        disabled={!this.props.pages.hasPrev}
                        onClick={this.onPrevPage.bind(this)}>

                        Prev
                    </button>
                    <button
                        ref={(c) => (this.els.next = c)}
                        className="btn btn-default"
                        disabled={!this.props.pages.hasNext}
                        onClick={this.onNextPage.bind(this)}>

                        Next
                    </button>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
}

Paging.propTypes = propTypes;


module.exports = Paging;
